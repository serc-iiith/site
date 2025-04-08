import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const peopleFilePath = path.join(process.cwd(), 'public', 'data', 'people.json');

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

export async function GET() {
  try {
    const data = readPeopleData();
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
