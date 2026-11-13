import { randomBytes } from 'node:crypto';
import { createContentStore } from './store.mjs';
export function createEditorHandler(root) {
  if (process.env.NODE_ENV === 'production') throw new Error('Create Mode is available in development only.');
  const store = createContentStore(root);
  const token = randomBytes(32).toString('hex');
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store');
    const reply = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
    try {
      const address = req.socket.remoteAddress;
      const host = req.headers.host || '';
      if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address) || !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return reply(403, { error: 'Create Mode is local only.' });
      if (req.headers.origin && new URL(req.headers.origin).host !== host) return reply(403, { error: 'Origin is not allowed.' });
      const url = new URL(req.url || '/', `http://${host}`);
      const route = url.pathname.replace(/^\/__zero/, '');
      if (req.method === 'GET') {
        if (route === '/state') return reply(200, { ...await store.load(), token, git: await store.gitState(), drafts: await store.drafts() });
        if (route === '/document') return reply(200, await store.read(url.searchParams.get('id')));
        if (route === '/draft') return reply(200, await store.readDraft(url.searchParams.get('id')));
      }
      if (req.method === 'POST') {
        if (req.headers['x-zero-token'] !== token || !req.headers['content-type']?.startsWith('application/json')) return reply(403, { error: 'Refresh Create Mode and retry this request.' });
        let size = 0; const chunks = [];
        for await (const chunk of req) { size += chunk.length; if (size > 30 * 1024 * 1024) return reply(413, { error: 'Import smaller batches (under 30 MB).' }); chunks.push(chunk); }
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (route === '/apply') return reply(200, await store.apply(payload));
        if (route === '/draft') return reply(200, await store.saveDraft(payload));
        if (route === '/publish') return reply(200, await store.publish(payload.message));
      }
      reply(404, { error: 'Unknown Create Mode action.' });
    } catch (error) { reply(400, { error: error instanceof Error ? error.message : 'The action could not be completed.' }); }
  };
}
