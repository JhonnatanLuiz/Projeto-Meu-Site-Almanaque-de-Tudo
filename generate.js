#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load the database
const databasePath = path.join(__dirname, 'js', 'database.js');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extract the database object by executing the code
// Remove the const database = and the trailing semicolon, then parse as JSON
const dbMatch = databaseContent.match(/const database = ({[\s\S]+});/);
if (!dbMatch) {
    console.error('Could not parse database.js');
    process.exit(1);
}

// Safely evaluate the database object
const database = eval('(' + dbMatch[1] + ')');

// Get all articles
const allArticles = [];
const siteUrl = 'https://jhonnatanluiz.github.io/Projeto-Meu-Site-Almanaque-de-Tudo';

database.categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
        subcategory.articles.forEach(article => {
            allArticles.push({
                ...article,
                category: category.name,
                subcategory: subcategory.name
            });
        });
    });
});

// Generate RSS Feed
function generateRSS() {
    const now = new Date().toUTCString();
    
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Almanaque Digital</title>
    <link>${siteUrl}</link>
    <description>Um almanaque digital com curiosidades e fatos interessantes</description>
    <language>pt-BR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
`;

    allArticles.forEach(article => {
        const articleUrl = `${siteUrl}/#${article.file}`;
        rss += `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <description>${escapeXml(article.summary)}</description>
      <category>${escapeXml(article.category)} - ${escapeXml(article.subcategory)}</category>
      <guid>${articleUrl}</guid>
    </item>
`;
    });

    rss += `  </channel>
</rss>`;

    return rss;
}

// Generate Sitemap
function generateSitemap() {
    const now = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

    allArticles.forEach(article => {
        const articleUrl = `${siteUrl}/#${article.file}`;
        sitemap += `  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    return sitemap;
}

// Helper function to escape XML special characters
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Write files
try {
    const feedXml = generateRSS();
    const sitemapXml = generateSitemap();
    
    fs.writeFileSync(path.join(__dirname, 'feed.xml'), feedXml, 'utf8');
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
    
    console.log('✓ Generated feed.xml');
    console.log('✓ Generated sitemap.xml');
    console.log(`✓ Processed ${allArticles.length} articles`);
} catch (error) {
    console.error('Error generating files:', error);
    process.exit(1);
}
