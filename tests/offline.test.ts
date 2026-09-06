import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function worker() {
  const scope = 'https://classroom.test/lop/';
  const prefix = `happy-class-pwa-${encodeURIComponent(scope)}-`;
  const entries = new Map<string, Response>();
  const cachesByName = new Map<string, Map<string, Response>>([
    [prefix + 'new', entries], [prefix + 'old', new Map()], ['another-app', new Map()],
  ]);
  const listeners: Record<string, (event: any) => void> = {};
  const downloads: string[] = [];
  let networkCalls = 0;
  const shell = ['index.html', 'assets/app.js', 'assets/page.js', 'assets/font.woff2'];
  const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
    .replace('__BUILD_ID__', 'new').replace('/*__PRECACHE__*/[]', JSON.stringify(shell));
  runInNewContext(source, {
    URL, Response,
    self: { registration: { scope }, clients: { claim: async () => {} },
      addEventListener: (name: string, handler: (event: any) => void) => { listeners[name] = handler; } },
    caches: {
      keys: async () => [...cachesByName.keys()],
      delete: async (name: string) => cachesByName.delete(name),
      open: async (name: string) => ({
        addAll: async (urls: string[]) => {
          downloads.push(...urls);
          for (const url of urls) cachesByName.get(name)!.set(url, new Response(url));
        },
        match: async (request: string | { url: string }) => cachesByName.get(name)!.get(typeof request === 'string' ? request : request.url)?.clone(),
      }),
    },
    fetch: async () => { networkCalls++; throw new TypeError('Offline'); },
  });
  async function lifecycle(name: string) {
    let pending: Promise<unknown> | undefined;
    listeners[name]({ waitUntil: (value: Promise<unknown>) => { pending = value; } });
    await pending;
  }
  async function request(path: string, mode = 'cors', method = 'GET') {
    let pending: Promise<Response> | undefined;
    listeners.fetch({ request: { url: new URL(path, scope).href, mode, method },
      respondWith: (value: Promise<Response>) => { pending = value; } });
    return pending;
  }
  return { scope, prefix, shell, entries, cachesByName, downloads, lifecycle, request, networkCalls: () => networkCalls };
}

test('first worker install saves every supplied offline asset including lazy pages and fonts', async () => {
  const w = worker(); await w.lifecycle('install');
  assert.deepEqual(w.downloads, w.shell.map(path => w.scope + path));
  for (const path of w.shell) assert.equal((await w.request(path))?.status, 200);
  assert.equal(w.networkCalls(), 0);
});
test('worker activation removes only older caches belonging to this app and scope', async () => {
  const w = worker(); await w.lifecycle('activate');
  assert(w.cachesByName.has('another-app'));
  assert(w.cachesByName.has(w.prefix + 'new'));
  assert(!w.cachesByName.has(w.prefix + 'old'));
});
test('offline navigation returns the cached shell even for a nested route', async () => {
  const w = worker(); await w.lifecycle('install');
  const response = await w.request('reports', 'navigate');
  assert.equal(await response?.text(), w.scope + 'index.html');
  assert.equal(w.networkCalls(), 0);
});
test('missing cache and unavailable network produce a response instead of an invalid promise fallback', async () => {
  const w = worker();
  assert.equal((await w.request('reports', 'navigate'))?.status, 503);
  assert.equal((await w.request('missing.js'))?.status, 503);
});
test('worker leaves writes, external URLs and other applications untouched', async () => {
  const w = worker();
  assert.equal(await w.request('save', 'cors', 'POST'), undefined);
  assert.equal(await w.request('https://outside.test/photo.png'), undefined);
  assert.equal(await w.request('https://classroom.test/other/app.js'), undefined);
  assert.equal(w.networkCalls(), 0);
});
