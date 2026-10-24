// Builds search-index.json for Orama by scanning the built HTML in dist/.
// Runs automatically after `npm run build` via the "postbuild" script in package.json.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const OUT = 'search-index.json';
const MAX_CHARS = 20000; // per-page safety cap

if (!existsSync(DIST)) {
  console.error('dist/ not found — run "npm run build" first.');
  process.exit(1);
}

// 1. Find every HTML file in dist/
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
	const full = join(dir, entry.name);
	if (entry.isDirectory()) walk(full);
	else if (entry.name.endsWith('.html')) files.push(full);
  }
})(DIST);

// Chunks of markup we never want to search (site nav, footer, scripts…)
const SCRUB = /<(script|style|nav|header|footer|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi;

function decodeEntities(s) {
  return s
	.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
	.replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
}

function textOf(html) {
  return decodeEntities(
	html.replace(SCRUB, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}

// Raw inner match (un-decoded) of the first capture group
function raw(html, re) {
  const m = html.match(re);
  return m ? m[1] : '';
}

const docs = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file).split('/').join('/'); // e.g. blog/my-post/index.html
  const name = rel.split('/').pop();

  if (name === '404.html') continue;                    // skip error page
  if (/name=["']robots["'][^>]*noindex/i.test(html)) continue; // skip noindex pages
  if (/data-no-search/i.test(html)) continue;           // skip pages you mark as no-search

  const url = name === 'index.html'
	? '/' + rel.slice(0, -'index.html'.length)          // "blog/my-post/" (or "/" for home)
	: '/' + rel.replace(/\.html$/, '');                 // "about.html" → "/about"

  const title = textOf(raw(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
	|| raw(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));

  const description = decodeEntities(
	raw(html, /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i)
	|| raw(html, /<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i)
  ).replace(/\s+/g, ' ').trim();

  const mainHtml = raw(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i)
	|| raw(html, /<article\b[^>]*>([\s\S]*?)<\/article>/i)
	|| html;

  docs.push({ title, description, content: textOf(mainHtml).slice(0, MAX_CHARS), url });
}

docs.sort((a, b) => a.url.localeCompare(b.url));

writeFileSync(join(DIST, OUT), JSON.stringify(docs));
mkdirSync('public', { recursive: true });
copyFileSync(join(DIST, OUT), join('public', OUT)); // so `astro dev` can serve it too

const kb = (JSON.stringify(docs).length / 1024).toFixed(1);
console.log(`✔ ${OUT}: ${docs.length} pages, ${kb} KB`);
for (const d of docs) console.log(`   ${d.url} — ${d.title}`);
