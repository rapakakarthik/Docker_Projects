const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://qa.myverkoper.com/'; // Replace with your website's base URL
const outputPath = path.join(__dirname, 'dist', 'sitemap.xml'); // Path to the sitemap output file

const generator = SitemapGenerator(baseUrl, {
  stripQuerystring: true, // Remove query parameters from URLs
});

generator.on('add', (url) => {
  console.log(`Added ${url}`);
});

generator.on('done', () => {
  console.log('Sitemap generation done!');
});

generator.start();