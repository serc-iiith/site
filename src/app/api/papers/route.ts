import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const papersFilePath = path.join(process.cwd(), 'public', 'data', 'papers.json');

// Helper function to read the papers data
function readPapersData() {
  try {
    const fileContents = fs.readFileSync(papersFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading papers data:', error);
    return [];
  }
}

// Helper function to write the papers data
function writePapersData(data: any) {
  fs.writeFileSync(papersFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all papers
export async function GET() {
  try {
    const data = readPapersData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading papers data:', error);
    return NextResponse.json({ error: 'Failed to read papers data' }, { status: 500 });
  }
}

// POST: Add a new paper
export async function POST(request: NextRequest) {
  try {
    const paper = await request.json();

    // Validate required fields
    if (!paper || !paper.title || !paper.authors || !paper.year || !paper.venue) {
      return NextResponse.json(
        { error: 'Required paper data is missing' },
        { status: 400 }
      );
    }

    // Ensure authors is an array
    if (!Array.isArray(paper.authors)) {
      paper.authors = [paper.authors];
    }

    const papers = readPapersData();

    // Add the new paper to the beginning of the array (most recent first)
    papers.unshift(paper);

    writePapersData(papers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding paper:', error);
    return NextResponse.json({ error: 'Failed to add paper' }, { status: 500 });
  }
}

// PUT: Update an existing paper
export async function PUT(request: NextRequest) {
  try {
    const updatedPaper = await request.json();

    // Validate required fields
    if (!updatedPaper || !updatedPaper.title || !updatedPaper.authors || !updatedPaper.year || !updatedPaper.venue) {
      return NextResponse.json(
        { error: 'Required paper data is missing' },
        { status: 400 }
      );
    }

    // Ensure authors is an array
    if (!Array.isArray(updatedPaper.authors)) {
      updatedPaper.authors = [updatedPaper.authors];
    }

    const papers = readPapersData();

    // Find the index of the paper to update (we're using title, year, authors as a composite key)
    const index = papers.findIndex((p: any) =>
      p.title === updatedPaper.originalTitle &&
      p.year === updatedPaper.originalYear &&
      JSON.stringify(p.authors) === JSON.stringify(updatedPaper.originalAuthors)
    );

    if (index === -1) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Remove metadata fields used for identification
    delete updatedPaper.originalTitle;
    delete updatedPaper.originalYear;
    delete updatedPaper.originalAuthors;

    // Update the paper
    papers[index] = updatedPaper;

    writePapersData(papers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating paper:', error);
    return NextResponse.json({ error: 'Failed to update paper' }, { status: 500 });
  }
}

// DELETE: Remove a paper
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const year = searchParams.get('year');
    const authorsString = searchParams.get('authors');

    if (!title || !year || !authorsString) {
      return NextResponse.json(
        { error: 'Paper identification data is required' },
        { status: 400 }
      );
    }

    const authors = JSON.parse(decodeURIComponent(authorsString));

    const papers = readPapersData();

    // Filter out the paper to delete
    const filteredPapers = papers.filter((p: any) =>
      !(p.title === title &&
        p.year === year &&
        JSON.stringify(p.authors) === JSON.stringify(authors))
    );

    if (filteredPapers.length === papers.length) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    writePapersData(filteredPapers);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}
