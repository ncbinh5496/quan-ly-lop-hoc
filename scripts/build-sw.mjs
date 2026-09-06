import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root=path.resolve('dist');
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; media-src 'self' blob: data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-src 'none'";
const index=await readFile(path.join(root,'index.html'),'utf8');
await writeFile(path.join(root,'index.html'),index.replace('<head>',`<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">`));
async function walk(dir) {
  const entries=await readdir(dir,{withFileTypes:true});
  return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();
}
const files=(await walk(root)).filter(f=>!f.endsWith('/sw.js')).sort();
const hash=createHash('sha256');
for (const f of files) {hash.update(path.relative(root,f));hash.update(await readFile(f));}
const template=await readFile('public/sw.js','utf8');
hash.update(template);
const buildId=hash.digest('hex').slice(0,16);
const assets=files.map(f=>path.relative(root,f).split(path.sep).join('/'));
await writeFile(path.join(root,'sw.js'),template.replace('__BUILD_ID__',buildId).replace('/*__PRECACHE__*/[]',JSON.stringify(assets)));
console.log(`Offline shell: ${assets.length} files, build ${buildId}`);
