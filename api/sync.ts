import { put, list, del, getDownloadUrl } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function blobKey(syncKey: string): string {
  return `mdac-profiles/${syncKey}.json`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const syncKey = req.query.key as string;

  if (!syncKey || syncKey.length < 4) {
    return res.status(400).json({ error: '同步密钥至少4位' });
  }

  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: blobKey(syncKey) });
      if (blobs.length === 0) {
        return res.json({ profiles: [], version: 1 });
      }
      const downloadUrl = await getDownloadUrl(blobs[0].url);
      const response = await fetch(downloadUrl);
      const data = await response.json();
      return res.json(data);
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      // Validate JSON
      JSON.parse(body);

      // Delete old blob if exists
      const { blobs } = await list({ prefix: blobKey(syncKey) });
      if (blobs.length > 0) {
        await del(blobs.map(b => b.url));
      }

      await put(blobKey(syncKey), body, {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
