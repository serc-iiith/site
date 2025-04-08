import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const projectsFilePath = path.join(process.cwd(), 'public', 'data', 'projects.json');

// Helper function to read the projects data
function readProjectsData() {
  const fileContents = fs.readFileSync(projectsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the projects data
function writeProjectsData(data: any) {
  fs.writeFileSync(projectsFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all projects
export async function GET() {
  try {
    const data = readProjectsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading projects data:', error);
    return NextResponse.json({ error: 'Failed to read projects data' }, { status: 500 });
  }
}

// POST: Add a new project
export async function POST(request: NextRequest) {
  try {
    const project = await request.json();

    if (!project || !project.title || !project.description || !project.category) {
      return NextResponse.json(
        { error: 'Required project data is missing' },
        { status: 400 }
      );
    }

    const projects = readProjectsData();

    // Generate a unique ID if not provided
    if (!project.id) {
      // Create a slug from the title
      const baseId = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if ID already exists and append a number if needed
      let newId = baseId;
      let counter = 1;
      while (projects.some((p: any) => p.id === newId)) {
        newId = `${baseId}-${counter}`;
        counter++;
      }

      project.id = newId;
    }

    // Add the new project
    projects.push(project);

    writeProjectsData(projects);

    return NextResponse.json({ success: true, id: project.id });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

// PUT: Update an existing project
export async function PUT(request: NextRequest) {
  try {
    const updatedProject = await request.json();

    if (!updatedProject || !updatedProject.id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projects = readProjectsData();

    // Find the index of the project to update
    const index = projects.findIndex((p: any) => p.id === updatedProject.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    projects[index] = updatedProject;

    writeProjectsData(projects);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE: Remove a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projects = readProjectsData();

    // Filter out the project to delete
    const filteredProjects = projects.filter((p: any) => p.id !== id);

    if (filteredProjects.length === projects.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    writeProjectsData(filteredProjects);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
