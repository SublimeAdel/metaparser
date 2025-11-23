import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/index';

describe('Metaparser', () => {
  describe('Basic Extraction', () => {
    it('should extract title, description, and favicon', () => {
      const html = `
        <html>
          <head>
            <title>My Page</title>
            <meta name="description" content="A cool page">
            <link rel="icon" href="/icon.png">
          </head>
        </html>
      `;
      const result = parseHtml(html);
      expect(result.title).toBe('My Page');
      expect(result.description).toBe('A cool page');
      expect(result.favicon).toBe('/icon.png');
    });

    it('should extract Open Graph tags', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="OG Title">
            <meta property="og:image" content="http://example.com/img.jpg">
          </head>
        </html>
      `;
      const result = parseHtml(html);
      expect(result.og.title).toBe('OG Title');
      expect(result.og.image).toBe('http://example.com/img.jpg');
    });

    it('should extract Twitter tags', () => {
      const html = `
        <html>
          <head>
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:site" content="@site">
          </head>
        </html>
      `;
      const result = parseHtml(html);
      expect(result.twitter.card).toBe('summary_large_image');
      expect(result.twitter.site).toBe('@site');
    });
  });

  describe('Missing Tags Validation', () => {
    it('should report missing required tags', () => {
      const html = `
        <html>
          <head>
            <title>Just Title</title>
          </head>
        </html>
      `;
      const result = parseHtml(html, {
        requiredTags: ['og:title', 'og:description', 'twitter:card']
      });

      expect(result.missing).toContain('og:title');
      expect(result.missing).toContain('og:description');
      expect(result.missing).toContain('twitter:card');
    });

    it('should not report present tags as missing', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="Present">
          </head>
        </html>
      `;
      const result = parseHtml(html, {
        requiredTags: ['og:title']
      });

      expect(result.missing).not.toContain('og:title');
    });
  });

  describe('Robustness & Malformed HTML', () => {
    it('should handle empty string', () => {
      const result = parseHtml('');
      expect(result.tags).toEqual([]);
      expect(result.og).toEqual({});
    });

    it('should handle unclosed tags', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="Unclosed"
            <meta name="description" content="Still works">
          </head>
      `;
      const result = parseHtml(html);
      // Cheerio is very forgiving, it might catch the first one or skip it depending on how bad it is.
      // Usually it handles unclosed attributes well if they are just missing the closing quote or bracket.
      // Let's see what it does with a missing closing bracket.

      // If cheerio parses it, great. If not, it shouldn't crash.
      expect(result).toBeDefined();
    });

    it('should handle garbage input', () => {
      const html = '<<<>>> foo bar baz <meta>';
      const result = parseHtml(html);
      expect(result).toBeDefined();
    });

    it('should handle duplicate tags (last one wins for specific buckets)', () => {
      const html = `
            <meta property="og:title" content="First">
            <meta property="og:title" content="Second">
        `;
      const result = parseHtml(html);
      expect(result.og.title).toBe('Second');
      expect(result.tags.filter(t => t.tag === 'og:title')).toHaveLength(2);
    });

    it('should ensure tags contain normalized entries', () => {
      const html = `
        <meta property="og:title" content="  Normalized  ">
      `;


      const result = parseHtml(html);
      const tag = result.tags.find(t => t.tag === 'og:title');
      expect(tag).toBeDefined();
      expect(tag).toHaveProperty('tag', 'og:title');
      expect(tag).toHaveProperty('value', '  Normalized  '); // We preserve whitespace currently
      expect(tag).toHaveProperty('attributes');
    });

    it('should respect extraction order in tags array (Basic -> OG -> Twitter)', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="OG">
            <meta name="twitter:title" content="Twitter">
            <title>Basic</title>
          </head>
        </html>
      `;
      const result = parseHtml(html);

      // Basic runs first
      expect(result.tags[0].tag).toBe('title');

      // OG runs second
      expect(result.tags[1].tag).toBe('og:title');

      // Twitter runs third
      expect(result.tags[2].tag).toBe('twitter:title');

      // Verify no cross-contamination
      expect(result.title).toBe('Basic');
      expect(result.og.title).toBe('OG');
      expect(result.twitter.title).toBe('Twitter');
    });
  });
});
