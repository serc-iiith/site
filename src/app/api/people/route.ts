import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const peopleFilePath = path.join(process.cwd(), 'public', 'data', 'people.json');
const peopleImagesDir = path.join(process.cwd(), 'public', 'images', 'people');

// Helper function to read the people data
function readPeopleData() {
  const fileContents = fs.readFileSync(peopleFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the people data
function writePeopleData(data: any) {
  fs.writeFileSync(peopleFilePath, JSON.stringify(data, null, 4), 'utf8');
}

// Helper function to generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to rename an image file when slug changes
async function renameImageFile(oldImageURL: string, oldSlug: string, newSlug: string): Promise<string | null> {
  try {
    // Skip if no image or if the image isn't in the people directory
    if (!oldImageURL || !oldImageURL.includes('/images/people/')) {
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
    const newFilename = `${newSlug}${fileExt}`;

    // Skip if the filename is already correctly named
    if (oldFilename === newFilename) {
      return null;
    }

    const oldFilePath = path.join(peopleImagesDir, oldFilename);
    const newFilePath = path.join(peopleImagesDir, newFilename);

    // Check if old file exists
    if (!fs.existsSync(oldFilePath)) {
      return null;
    }

    // Check if new file path already exists, avoid overwrite
    if (fs.existsSync(newFilePath)) {
      // Generate unique name with timestamp to avoid conflicts
      const timestamp = Date.now();
      const newUniqueFilename = `${newSlug}-${timestamp}${fileExt}`;
      const newUniqueFilePath = path.join(peopleImagesDir, newUniqueFilename);
      fs.renameSync(oldFilePath, newUniqueFilePath);
      return `/images/people/${newUniqueFilename}`;
    }

    // Rename the file
    fs.renameSync(oldFilePath, newFilePath);

    // Return the new URL
    return `/images/people/${newFilename}`;
  } catch (error) {
    console.error('Error renaming image file:', error);
    return null;
  }
}

export async function GET() {
  try {
    const data = readPeopleData();

    // Sort people alphabetically within each category
    for (const category in data) {
      if (Array.isArray(data[category])) {
        data[category].sort((a: any, b: any) => {
          return (a.name || '').localeCompare(b.name || '');
        });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading people data:', error);
    return NextResponse.json({ error: 'Failed to read people data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { person, category } = await request.json();

    if (!person || !category) {
      return NextResponse.json(
        { error: 'Person data and category are required' },
        { status: 400 }
      );
    }

    // If no slug is provided, generate one from the name
    if (!person.slug && person.name) {
      person.slug = generateSlug(person.name);
    }

    const data = readPeopleData();

    // Ensure the category exists
    if (!data[category]) {
      data[category] = [];
    }

    // Check if slug already exists
    if (data[category].some((p: any) => p.slug === person.slug)) {
      // Add a unique suffix if needed
      const baseSlug = person.slug;
      let count = 1;
      while (data[category].some((p: any) => p.slug === `${baseSlug}-${count}`)) {
        count++;
      }
      person.slug = `${baseSlug}-${count}`;
    }

    // Add the new person to the category
    data[category].push(person);

    writePeopleData(data);

    return NextResponse.json({ success: true, slug: person.slug });
  } catch (error) {
    console.error('Error adding person:', error);
    return NextResponse.json({ error: 'Failed to add person' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { person, category, oldCategory, oldSlug } = await request.json();

    if (!person || !category || !oldSlug) {
      return NextResponse.json(
        { error: 'Person data, category, and oldSlug are required' },
        { status: 400 }
      );
    }

    // If no slug is provided, generate one from the name
    if (!person.slug && person.name) {
      person.slug = generateSlug(person.name);
    }

    const data = readPeopleData();

    // Handle category change
    if (oldCategory && oldCategory !== category) {
      // Find the person in old category to get access to the current imageURL
      const oldPerson = data[oldCategory].find((p: any) => p.slug === oldSlug);

      // Remove from old category
      data[oldCategory] = data[oldCategory].filter((p: any) => p.slug !== oldSlug);

      // Ensure the new category exists
      if (!data[category]) {
        data[category] = [];
      }

      // Check if slug already exists in new category (only if slug changed)
      if (person.slug !== oldSlug && data[category].some((p: any) => p.slug === person.slug)) {
        const baseSlug = person.slug;
        let count = 1;
        while (data[category].some((p: any) => p.slug === `${baseSlug}-${count}`)) {
          count++;
        }
        person.slug = `${baseSlug}-${count}`;
      }

      // Rename image file if slug changed
      if (oldPerson && oldPerson.imageURL && person.slug !== oldSlug) {
        const newImageURL = await renameImageFile(oldPerson.imageURL, oldSlug, person.slug);
        if (newImageURL) {
          person.imageURL = newImageURL;
        }
      }

      // Add to new category
      data[category].push(person);
    } else {
      // Update in the same category
      const index = data[category].findIndex((p: any) => p.slug === oldSlug);
      if (index !== -1) {
        // Check if new slug already exists (if changed and not the current item)
        if (person.slug !== oldSlug &&
          data[category].some((p: any, i: number) => i !== index && p.slug === person.slug)) {
          const baseSlug = person.slug;
          let count = 1;
          while (data[category].some((p: any, i: number) =>
            i !== index && p.slug === `${baseSlug}-${count}`)) {
            count++;
          }
          person.slug = `${baseSlug}-${count}`;
        }

        // Rename image file if slug changed
        if (person.imageURL && person.slug !== oldSlug) {
          const newImageURL = await renameImageFile(person.imageURL, oldSlug, person.slug);
          if (newImageURL) {
            person.imageURL = newImageURL;
          }
        }

        data[category][index] = person;
      } else {
        return NextResponse.json(
          { error: 'Person not found' },
          { status: 404 }
        );
      }
    }

    writePeopleData(data);

    return NextResponse.json({ success: true, slug: person.slug });
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    if (!slug || !category) {
      return NextResponse.json(
        { error: 'Slug and category are required' },
        { status: 400 }
      );
    }

    const data = readPeopleData();

    if (!data[category]) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Remove person from the category
    data[category] = data[category].filter((p: any) => p.slug !== slug);

    writePeopleData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
