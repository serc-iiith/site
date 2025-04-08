import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const blogsFilePath = path.join(process.cwd(), 'public', 'data', 'blogs.json');

// Helper function to read the blogs data
function readBlogsData() {
  try {
    const fileContents = fs.readFileSync(blogsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading blogs data:', error);
    return [];
  }
}

// Helper function to write the blogs data
function writeBlogsData(data: any) {
  fs.writeFileSync(blogsFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET: Fetch all blogs
export async function GET() {
  try {
    const data = readBlogsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading blogs data:', error);
    return NextResponse.json({ error: 'Failed to read blogs data' }, { status: 500 });
  }
}

// POST: Add a new blog
export async function POST(request: NextRequest) {
  try {
    const blog = await request.json();

    if (!blog || !blog.title || !blog.author || !blog.content) {
      return NextResponse.json(
        { error: 'Required blog data is missing' },
        { status: 400 }
      );
    }

    const blogs = readBlogsData();

    // Generate a unique ID
    const newId = blogs.length > 0 ? Math.max(...blogs.map((b: any) => b.id)) + 1 : 0;
    blog.id = newId;

    // Generate slug if not provided
    if (!blog.slug) {
      blog.slug = generateSlug(blog.title);
    }

    // Set date if not provided
    if (!blog.date) {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      blog.date = now.toLocaleDateString('en-US', options);
    }

    // Add the new blog to the beginning of the array (most recent first)
    blogs.unshift(blog);

    writeBlogsData(blogs);

    return NextResponse.json({ success: true, id: newId, slug: blog.slug });
  } catch (error) {
    console.error('Error adding blog:', error);
    return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
  }
}

// PUT: Update an existing blog
export async function PUT(request: NextRequest) {
  try {
    const updatedBlog = await request.json();

    if (!updatedBlog || !updatedBlog.id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blogs = readBlogsData();

    // Find the index of the blog to update
    const index = blogs.findIndex((b: any) => b.id === updatedBlog.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Generate slug if title changed
    if (blogs[index].title !== updatedBlog.title && updatedBlog.generateNewSlug) {
      updatedBlog.slug = generateSlug(updatedBlog.title);
      delete updatedBlog.generateNewSlug;
    }

    // Update the blog
    blogs[index] = updatedBlog;

    writeBlogsData(blogs);

    return NextResponse.json({ success: true, slug: updatedBlog.slug });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE: Remove a blog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blogs = readBlogsData();

    // Filter out the blog to delete
    const filteredBlogs = blogs.filter((b: any) => b.id !== parseInt(id));

    if (filteredBlogs.length === blogs.length) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    writeBlogsData(filteredBlogs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
