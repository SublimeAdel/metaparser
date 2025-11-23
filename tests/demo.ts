import { parseHtml } from '../src/index';

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
  <meta name="description" content="This is a test description">
  <meta property="og:title" content="Open Graph Title">
  <meta property="og:image" content="https://example.com/image.jpg">
  <link rel="icon" href="/favicon.ico">
</head>
<body>
</body>
</html>
`;

console.log('--- Parsing Sample HTML ---');
const result = parseHtml(html, {
    requiredTags: ['og:title', 'og:description', 'twitter:card']
});

console.log('Title:', result.title);
console.log('Description:', result.description);
console.log('Favicon:', result.favicon);
console.log('OG Data:', result.og);
console.log('Missing Tags:', result.missing);

if (result.title === 'Test Page' &&
    result.og.title === 'Open Graph Title' &&
    result.missing.includes('og:description') &&
    result.missing.includes('twitter:card')) {
    console.log('\n✅ Verification Passed!');
} else {
    console.error('\n❌ Verification Failed!');
    process.exit(1);
}
