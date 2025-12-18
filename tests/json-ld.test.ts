import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/index';

describe('JSON-LD Extraction', () => {
    it('should extract simple JSON-LD', () => {
        const html = `
        <html>
            <head>
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "Recipe",
                    "name": "Grandma's Pie"
                }
                </script>
            </head>
        </html>
        `;
        const result = parseHtml(html);
        expect(result.jsonld).toBeDefined();
        expect(result.jsonld).toHaveLength(1);
        expect(result.jsonld![0].name).toBe("Grandma's Pie");
    });

    it('should extract multiple JSON-LD scripts', () => {
        const html = `
        <html>
            <head>
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "Recipe",
                    "name": "Pie"
                }
                </script>
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "Review",
                    "reviewBody": "Great!"
                }
                </script>
            </head>
        </html>
        `;
        const result = parseHtml(html);
        expect(result.jsonld).toHaveLength(2);
        expect(result.jsonld![1].reviewBody).toBe('Great!');
    });

    it('should ignore malformed JSON-LD', () => {
        const html = `
        <html>
            <head>
                <script type="application/ld+json">
                {
                    "name": "Bad JSON"
                </script>
            </head>
        </html>
        `;
        const result = parseHtml(html);
        expect(result.jsonld).toBeUndefined(); // Or empty, depending on implementation detail. logic says undefined if nothing added initially? 
        // Logic: result.jsonld = (result.jsonld || []).concat(jsonItems); but jsonItems will be empty.
        // Wait, if jsonItems is empty, it doesn't touch result.jsonld.
        // So undefined is correct as per types.
    });
});
