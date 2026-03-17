import { put, head, list, del } from '@vercel/blob';

export const config = { runtime: 'edge' };

function blobKey(syncKey: string): string {
  return `mdac-profiles/${syncKey}.json`;
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const syncKey = url.searchParams.get('key');

  if (!syncKey || syncKey.length < 4) {
    return new Response(JSON.stringify({ error: '同步密钥至少4位' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    if (req.method === 'GET') {
      // List blobs with the prefix to find the one we need
      const { blobs } = await list({ prefix: blobKey(syncKey) });
      if (blobs.length === 0) {
        return new Response(JSON.stringify({ profiles: [], version: 1 }), { headers });
      }
      const res = await fetch(blobs[0].url);
      const data = await res.text();
      return new Response(data, { headers });
    }

    if (req.method === 'PUT') {
      const body = await req.text();
      // Validate JSON
      JSON.parse(body);

      // Delete old blob if exists
      const { blobs } = await list({ prefix: blobKey(syncKey) });
      if (blobs.length > 0) {
        await del(blobs.map(b => b.url));
      }

      await put(blobKey(syncKey), body, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers });
  }
}
