/* global Buffer, Headers, URL, console, fetch, process */
import { createReadStream, existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 4173);
const distDir = resolve('dist');
const indexHtmlPath = join(distDir, 'index.html');
const apiTarget = process.env.API_PROXY_TARGET ?? 'https://fe-technical-assignment.dxtr.asia';
const allowedOrigin =
  process.env.CORS_ALLOWED_ORIGIN ?? 'https://mifx-crypto-market-production.up.railway.app';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function applyCorsHeaders(request, response) {
  const origin = request.headers.origin;

  if (origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function proxyApiRequest(request, response) {
  applyCorsHeaders(request, response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host}`);
  const targetUrl = new URL(requestUrl.pathname + requestUrl.search, apiTarget);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (!value || ['host', 'origin', 'connection'].includes(key)) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method ?? '') ? undefined : await readRequestBody(request),
    });

    response.statusCode = upstreamResponse.status;

    upstreamResponse.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'set-cookie'].includes(key)) {
        response.setHeader(key, value);
      }
    });

    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
    response.end(responseBody);
  } catch {
    response.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ success: false, message: 'Unable to reach API proxy target' }));
  }
}

async function serveStaticFile(pathname, response) {
  const safePathname = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(distDir, safePathname);

  if (!filePath.startsWith(distDir) || !existsSync(filePath)) {
    return false;
  }

  const fileStat = await stat(filePath);

  if (!fileStat.isFile()) {
    return false;
  }

  response.writeHead(200, {
    'Content-Length': fileStat.size,
    'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);

  return true;
}

async function serveIndex(response) {
  const indexHtml = await readFile(indexHtmlPath);

  response.writeHead(200, {
    'Content-Length': indexHtml.length,
    'Content-Type': 'text/html; charset=utf-8',
  });
  response.end(indexHtml);
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (requestUrl.pathname.startsWith('/api/v1')) {
    await proxyApiRequest(request, response);
    return;
  }

  if (await serveStaticFile(requestUrl.pathname, response)) {
    return;
  }

  await serveIndex(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
