const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = ['dist/index.html', 'dist/ticket-guide.html', 'dist/styles.css'];
const referencedAssets = new Set();
const missing = [];
for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const refs = file.endsWith('.css')
    ? [...source.matchAll(/url\(["']?(\.\/[^"')]+)["']?\)/g)]
    : [...source.matchAll(/(?:src|href)="(\.\/[^"#?]+)(?:[?#][^"]*)?"/g)];
  for (const match of refs) {
    const target = path.resolve(root, path.dirname(file), match[1]);
    if (!fs.existsSync(target)) missing.push(path.relative(root, target));
    if (target.startsWith(path.join(root, 'dist', 'assets') + path.sep)) referencedAssets.add(path.basename(target));
  }
}
const unused = fs.readdirSync(path.join(root, 'dist', 'assets')).filter(name => !referencedAssets.has(name));
console.log('Missing local references:', missing);
console.log('Unused public assets:', unused);
if (missing.length || unused.length) process.exitCode = 1;
