import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-static";

const eventsFilePath = path.join(process.cwd(), 'public', 'data', 'events.json');

// Helper function to read the events data
function readEventsData() {
  const fileContents = fs.readFileSync(eventsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to write the events data
function writeEventsData(data: any) {
  fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 4), 'utf8');
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

    if (!event || !event.name || !event.startTime || !event.endTime || !event.location) {
      return NextResponse.json(
        { error: 'Required event data is missing' },
        { status: 400 }
      );
    }

    const events = readEventsData();

    // Ensure ID is unique
    const newId = events.length > 0 ? Math.max(...events.map((e: any) => e.id)) + 1 : 1;
    event.id = newId;

    // Ensure year is set properly
    event.year = new Date(event.startTime).getFullYear();

    // Add the new event
    events.push(event);

    // Sort events by date (newest first)
    events.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    writeEventsData(events);

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}

// PUT: Update an existing event
export async function PUT(request: NextRequest) {
  try {
    const updatedEvent = await request.json();

    if (!updatedEvent || !updatedEvent.id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const events = readEventsData();

    // Find the index of the event to update
    const index = events.findIndex((e: any) => e.id === updatedEvent.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Ensure year is set properly
    updatedEvent.year = new Date(updatedEvent.startTime).getFullYear();

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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const events = readEventsData();

    // Filter out the event to delete
    const filteredEvents = events.filter((e: any) => e.id !== parseInt(id));

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
