import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'boceto-b');
const output = path.join(root, 'dist');
const files = ['index.html', 'escritorio.html', 'datos.js', 'admin.js', 'admin.css', 'logo-miqui.svg', 'monograma.svg', 'img', '_headers', '404.html'];

// Validar sintaxis y recursos antes de generar la versión que se publica.
for (const name of ['datos.js', 'admin.js']) {
  new vm.Script(await readFile(path.join(source, name), 'utf8'), { filename: name });
}
for (const name of ['index.html', 'escritorio.html']) {
  const html = await readFile(path.join(source, name), 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/.test(match[1])) new vm.Script(match[2], { filename: name });
  }
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#|\$\{)/i.test(ref) || ref.includes('${')) continue;
    const resolved = path.resolve(source, ref.split(/[?#]/)[0]);
    if (!resolved.startsWith(source + path.sep) || !(await stat(resolved)).isFile()) {
      throw new Error(`Recurso local inválido en ${name}: ${ref}`);
    }
  }
}
async function checkSize(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await checkSize(file);
    else if ((await stat(file)).size > 25 * 1024 * 1024) throw new Error(`Archivo demasiado grande para Pages: ${file}`);
  }
}
await checkSize(source);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(path.join(source, file), path.join(output, file), { recursive: true });
console.log('Versión B validada y lista en dist/ (celular y escritorio).');
