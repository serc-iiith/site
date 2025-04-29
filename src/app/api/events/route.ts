import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const eventsFilePath = path.join(process.cwd(), 'public', 'data', 'events.json');
const eventsImagesDir = path.join(process.cwd(), 'public', 'images', 'events');

// Helper function to read the events data
function readEventsData() {
  const fileContents = fs.readFileSync(eventsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the events data
function writeEventsData(data: any) {
  fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 4), 'utf8');
}

// Helper function to rename an event image file when slug changes
async function renameImageFile(oldImageURL: string, oldSlug: string, newSlug: string): Promise<string | null> {
  try {
    // Skip if no image or if the image isn't in the events directory
    if (!oldImageURL || !oldImageURL.includes('/images/events/')) {
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

    const oldFilePath = path.join(eventsImagesDir, oldFilename);
    const newFilePath = path.join(eventsImagesDir, newFilename);

    // Check if old file exists
    if (!fs.existsSync(oldFilePath)) {
      return null;
    }

    // Rename the file
    fs.renameSync(oldFilePath, newFilePath);

    // Return the new URL
    return `/images/events/${newFilename}`;
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

// GET: Fetch all events
export async function GET() {
  try {
    const data = readEventsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading events data:', error);
    return NextResponse.json({ error: 'Failed to read events data' }, { status: 500 });
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

    const events = readEventsData();

    // Check for unique slug
    if (events.some((e: any) => e.slug === event.slug)) {
      return NextResponse.json(
        { error: 'An event with this slug already exists' },
        { status: 400 }
      );
    }

    // Add the new event
    events.push(event);

    // Sort events by date (newest first)
    events.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    writeEventsData(events);

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

    const events = readEventsData();

    // Find the index of the event to update
    const index = events.findIndex((e: any) => e.slug === updatedEvent.slug);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Rename event images if slug has changed
    if (updatedEvent.slug !== events[index].slug) {
      updatedEvent.imageURLs = await renameEventImages(events[index].imageURLs, events[index].slug, updatedEvent.slug);
    }

    // Update the event
    events[index] = updatedEvent;

    // Sort events by date (newest first)
    events.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    writeEventsData(events);

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

    const events = readEventsData();

    // Filter out the event to delete
    const filteredEvents = events.filter((e: any) => e.slug !== slug);

    if (filteredEvents.length === events.length) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    writeEventsData(filteredEvents);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
