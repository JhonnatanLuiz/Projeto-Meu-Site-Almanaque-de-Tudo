const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function rfc1123(d) {
  return new Date(d).toUTCString();
}
function isoDate(d) {
  return new Date(d).toISOString().slice(0,10);
}

const root = process.cwd();
const files = fs.readdirSync(root).filter(f => f.endsWith('.html') && !['404.html'].includes(f));
if (!files.length) {
  console.error('No HTML files found in', root);
  process.exit(1);
}

const items = files.map(file => {
  const filePath = path.join(root, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  const title = ($('head title').text() || $('h1').first().text() || path.basename(file)).trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || $('main p').first().text() || $('p').first().text() || '').trim();
  const stat = fs.statSync(filePath);
  const pubDate = rfc1123(stat.mtime);
  const lastmod = isoDate(stat.mtime);
  return { file, title, description: metaDesc, pubDate, lastmod };
});

// Generate feed.xml
const feedItems = items.map(it => {
  return `    <item>\n      <title>${escapeXml(it.title)}</title>\n      <link>./${it.file}</link>\n      <description><![CDATA[${it.description}]]></description>\n      <pubDate>${it.pubDate}</pubDate>\n      <guid>./${it.file}</guid>\n    </item>`;
}).join('\n\n');

const feed = `<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Almanaque de Tudo</title>\n    <link>./index.html</link>\n    <description>Artigos e curiosidades de ciência, história, tecnologia, natureza e cultura pop.</description>\n    <language>pt-BR</language>\n    <lastBuildDate>${rfc1123(new Date())}</lastBuildDate>\n\n${feedItems}\n\n  </channel>\n</rss>\n`;

fs.writeFileSync(path.join(root, 'feed.xml'), feed, 'utf8');
console.log('Wrote feed.xml with', items.length, 'items');

// Generate sitemap.xml
function heuristicsPriority(file) {
  if (file === 'index.html') return '1.0';
  if (file.includes('curiosidades')) return '0.8';
  if (file.includes('sobre')) return '0.6';
  if (file.includes('contato')) return '0.3';
  return '0.5';
}

const urlEntries = items.map(it => {
  return `  <url>\n    <loc>./${it.file}</loc>\n    <lastmod>${it.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${heuristicsPriority(it.file)}</priority>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
console.log('Wrote sitemap.xml with', items.length, 'urls');

function escapeXml(s) {
  return s.replace(/[<>&"']/g, function(c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}
