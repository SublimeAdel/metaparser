# Metaparser

A lightweight, robust, and framework-agnostic HTML metadata parser for Node.js and the browser. Designed to extract Open Graph, Twitter Cards, and standard metadata with strict validation support.

## Features

- 🚀 **Lightweight & Fast**: Built on top of `cheerio` for robust parsing.
- 🛡️ **Robust**: Handles malformed HTML, unclosed tags, and garbage input gracefully.
- 🔍 **Validation**: Identifies and reports missing required tags (no silent fallbacks).
- 📦 **Typed**: Written in TypeScript with full type definitions.
- 🌐 **Universal**: Works in Node.js, Next.js, backend scripts, and browser extensions.
- 🔌 **Extensible**: Easy to add new extractors.

> [!NOTE]
> **Compatibility**: This package is fully compatible with both Node.js (CommonJS/ESM) and Browser environments (bundlers like Webpack/Vite). It uses `cheerio` which runs anywhere JavaScript runs.

## Installation

```bash
npm install metaparser
# or
yarn add metaparser
# or
pnpm add metaparser
```

## Usage

### Basic Usage

Fetch and parse a URL directly:

```typescript
import { parseUrl } from 'metaparser';

async function main() {
  const result = await parseUrl('https://example.com');
  
  console.log(result.title);
  console.log(result.description);
  console.log(result.og); // { title: '...', image: '...', ... }
}
```

### Parsing HTML String

If you already have the HTML content (e.g., from a headless browser or file):

```typescript
import { parseHtml } from 'metaparser';

const html = `
  <html>
    <head>
      <meta property="og:title" content="My Page">
    </head>
  </html>
`;

const result = parseHtml(html);
console.log(result.og.title); // "My Page"
```

### Validation & Missing Tags

One of the key features of `metaparser` is strict validation. You can specify which tags are required, and the parser will tell you exactly what's missing.

```typescript
const result = await parseUrl('https://example.com', {
  requiredTags: [
    'og:title',
    'og:description',
    'og:image',
    'twitter:card'
  ]
});

if (result.missing.length > 0) {
  console.warn('Missing required tags:', result.missing);
  // Output: Missing required tags: ['twitter:card']
}
```

## API

### `parseUrl(url: string, options?: ParserOptions): Promise<MetadataResult>`

Fetches the HTML from the given URL and parses it.

### `parseHtml(html: string, options?: ParserOptions): MetadataResult`

Parses a raw HTML string.

### `ParserOptions`

| Option | Type | Description |
| matches | --- | --- |
| `requiredTags` | `string[]` | List of tags to validate presence for (e.g. `['og:title']`). |
| `fetchFavicon` | `boolean` | (Planned) Attempt to fetch favicon if not found. |

### `MetadataResult`

```typescript
interface MetadataResult {
  title?: string;
  description?: string;
  favicon?: string;
  url?: string;
  
  og: Record<string, string>;      // Open Graph tags (without 'og:' prefix)
  twitter: Record<string, string>; // Twitter tags (without 'twitter:' prefix)
  
  tags: Metatag[];                 // All raw extracted tags
  missing: string[];               // List of required tags that were not found
}

interface Metatag {
  tag: string;                     // The tag name (e.g., 'og:title', 'description')
  value: string;                   // The content/value of the tag
  attributes?: Record<string, string>; // All attributes found on the element
}
```

## License

MIT
