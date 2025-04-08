import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const collaboratorsFilePath = path.join(process.cwd(), 'public', 'data', 'collaborators.json');

// Helper function to read the collaborators data
function readCollaboratorsData() {
  const fileContents = fs.readFileSync(collaboratorsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the collaborators data
function writeCollaboratorsData(data: any) {
  fs.writeFileSync(collaboratorsFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all collaborators
export async function GET() {
  try {
    const data = readCollaboratorsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading collaborators data:', error);
    return NextResponse.json({ error: 'Failed to read collaborators data' }, { status: 500 });
  }
}

// POST: Add a new collaborator
export async function POST(request: NextRequest) {
  try {
    const collaborator = await request.json();

    if (!collaborator || !collaborator.name || !collaborator.category) {
      return NextResponse.json(
        { error: 'Required collaborator data is missing' },
        { status: 400 }
      );
    }

    const collaborators = readCollaboratorsData();

    // Generate a unique ID if not provided
    if (!collaborator.id) {
      // Create a slug from the name
      const baseId = collaborator.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if ID already exists and append a number if needed
      let newId = baseId;
      let counter = 1;
      while (collaborators.some((c: any) => c.id === newId)) {
        newId = `${baseId}-${counter}`;
        counter++;
      }

      collaborator.id = newId;
    }

    // Add the new collaborator
    collaborators.push(collaborator);

    // Sort alphabetically by name
    collaborators.sort((a: any, b: any) => a.name.localeCompare(b.name));

    writeCollaboratorsData(collaborators);

    return NextResponse.json({ success: true, id: collaborator.id });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
  }
}

// PUT: Update an existing collaborator
export async function PUT(request: NextRequest) {
  try {
    const updatedCollaborator = await request.json();

    if (!updatedCollaborator || !updatedCollaborator.id) {
      return NextResponse.json(
        { error: 'Collaborator ID is required' },
        { status: 400 }
      );
    }

    const collaborators = readCollaboratorsData();

    // Find the index of the collaborator to update
    const index = collaborators.findIndex((c: any) => c.id === updatedCollaborator.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Collaborator not found' },
        { status: 404 }
      );
    }

    // Update the collaborator
    collaborators[index] = updatedCollaborator;

    // Sort alphabetically by name
    collaborators.sort((a: any, b: any) => a.name.localeCompare(b.name));

    writeCollaboratorsData(collaborators);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating collaborator:', error);
    return NextResponse.json({ error: 'Failed to update collaborator' }, { status: 500 });
  }
}

// DELETE: Remove a collaborator
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Collaborator ID is required' },
        { status: 400 }
      );
    }

    const collaborators = readCollaboratorsData();

    // Filter out the collaborator to delete
    const filteredCollaborators = collaborators.filter((c: any) => c.id !== id);

    if (filteredCollaborators.length === collaborators.length) {
      return NextResponse.json(
        { error: 'Collaborator not found' },
        { status: 404 }
      );
    }

    writeCollaboratorsData(filteredCollaborators);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collaborator:', error);
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
  }
}
