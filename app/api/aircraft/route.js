import db from '@/lib/mongodb';

export async function GET(request) {
  try {
    const collection = db.collection('Aircraft'); 
    const aircraft = await collection.find({}).toArray();
    return new Response(JSON.stringify(aircraft), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch aircraft' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}