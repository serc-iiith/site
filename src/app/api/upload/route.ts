import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    // Get content type from request
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
    }

    // Determine destination folder based on type
    let destFolder = '';
    if (type === 'people') {
      destFolder = path.join(process.cwd(), 'public', 'images', 'people');
    } else if (type === 'events') {
      destFolder = path.join(process.cwd(), 'public', 'images', 'events');
    } else if (type === 'projects') {
      destFolder = path.join(process.cwd(), 'public', 'images', 'projects');
    } else if (type === 'blogs') {
      destFolder = path.join(process.cwd(), 'public', 'images', 'blogs');
    } else if (type === 'collaborators') {
      destFolder = path.join(process.cwd(), 'public', 'images', 'collaborators');
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Ensure folder exists
    await fs.mkdir(destFolder, { recursive: true });

    // Generate filename - use slug if available, otherwise use original name with timestamp
    let filename = '';
    if (slug) {
      // Get file extension from original filename
      const ext = path.extname(file.name);
      filename = `${slug}${ext}`;
    } else {
      // Create unique name with timestamp if no slug
      const timestamp = Date.now();
      const ext = path.extname(file.name);
      const base = path.basename(file.name, ext);
      filename = `${base}-${timestamp}${ext}`;
    }

    // Convert File to ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write to file
    const filepath = path.join(destFolder, filename);
    await fs.writeFile(filepath, buffer);

    // Return the relative path for use in the frontend
    const relativePath = `/images/${type}/${filename}`;

    return NextResponse.json({ success: true, filePath: relativePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}