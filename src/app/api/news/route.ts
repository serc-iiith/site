import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const newsFilePath = path.join(process.cwd(), 'public', 'data', 'news.json');
const newsImagesDir = path.join(process.cwd(), 'public', 'images', 'news');

// Helper function to read the news data
function readNewsData() {
  const fileContents = fs.readFileSync(newsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the news data
function writeNewsData(data: any) {
  fs.writeFileSync(newsFilePath, JSON.stringify(data, null, 4), 'utf8');
}

// Helper function to rename an event image file when slug changes
async function renameImageFile(oldImageURL: string, oldSlug: string, newSlug: string): Promise<string | null> {
  try {
    // Skip if no image or if the image isn't in the news directory
    if (!oldImageURL || !oldImageURL.includes('/images/news/')) {
      return null;
    }

    // Extract old filename from URL
    const oldFilename = oldImageURL.split('/').pop();

    // Skip if we can't parse the filename
    if (!oldFilename) {
      return null;
    }

    // Get file extension
    const fileExt = path.extname(oldFilename);

    // Generate new filename with slug as prefix
    // Use a timestamp suffix to avoid naming conflicts for multiple event images
    const timestamp = Date.now();
    const newFilename = `${newSlug}-${timestamp}${fileExt}`;

    const oldFilePath = path.join(newsImagesDir, oldFilename);
    const newFilePath = path.join(newsImagesDir, newFilename);

    // Check if old file exists
    if (!fs.existsSync(oldFilePath)) {
      return null;
    }

    // Rename the file
    fs.renameSync(oldFilePath, newFilePath);

    // Return the new URL
    return `/images/news/${newFilename}`;
  } catch (error) {
    console.error('Error renaming event image file:', error);
    return null;
  }
}

// Helper function to rename all images in an event's imageURLs array
async function renameEventImages(imageURLs: string[], oldSlug: string, newSlug: string): Promise<string[]> {
  if (!imageURLs || !Array.isArray(imageURLs)) {
    return [];
  }

  const newImageURLs = [...imageURLs];

  for (let i = 0; i < imageURLs.length; i++) {
    const newImageURL = await renameImageFile(imageURLs[i], oldSlug, newSlug);
    if (newImageURL) {
      newImageURLs[i] = newImageURL;
    }
  }

  return newImageURLs;
}

// GET: Fetch all news
export async function GET() {
  try {
    const data = readNewsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading news data:', error);
    return NextResponse.json({ error: 'Failed to read news data' }, { status: 500 });
  }
}

// POST: Add a new event
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    if (!event || !event.name || !event.startTime || !event.location || !event.slug) {
      return NextResponse.json(
        { error: 'Required event data is missing' },
        { status: 400 }
      );
    }

    const news = readNewsData();

    // Check for unique slug
    if (news.some((e: any) => e.slug === event.slug)) {
      return NextResponse.json(
        { error: 'An event with this slug already exists' },
        { status: 400 }
      );
    }

    // Add the new event
    news.push(event);

    // Sort news by date (newest first)
    news.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    writeNewsData(news);

    return NextResponse.json({ success: true, slug: event.slug });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}

// PUT: Update an existing event
export async function PUT(request: NextRequest) {
  try {
    const updatedEvent = await request.json();

    if (!updatedEvent || !updatedEvent.slug) {
      return NextResponse.json(
        { error: 'Event slug is required' },
        { status: 400 }
      );
    }

    const news = readNewsData();

    // Find the index of the event to update
    const index = news.findIndex((e: any) => e.slug === updatedEvent.slug);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Rename event images if slug has changed
    if (updatedEvent.slug !== news[index].slug) {
      updatedEvent.imageURLs = await renameEventImages(news[index].imageURLs, news[index].slug, updatedEvent.slug);
    }

    // Update the event
    news[index] = updatedEvent;

    // Sort news by date (newest first)
    news.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    writeNewsData(news);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE: Remove an event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Event slug is required' },
        { status: 400 }
      );
    }

    const news = readNewsData();

    // Filter out the event to delete
    const filteredNews = news.filter((e: any) => e.slug !== slug);

    if (filteredNews.length === news.length) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    writeNewsData(filteredNews);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
