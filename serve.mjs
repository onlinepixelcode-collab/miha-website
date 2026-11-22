import http from 'node:http'; import { fileURLToPath } from 'node:url'; import { readFile} from 'node:fs/promises'; import { extname, join, normalize} from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url)); const port = process.env.PORT || 4173;
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webp':'image/webp' };
http.createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = normalize(join(root, p)); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  try { const b = await readFile(f); res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, () => console.log('MiHa site on http://localhost:' + port));
