import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/index';

describe('Title Extraction Issues', () => {
    it('should handle multiple title tags by picking the first one', () => {
        const html = `
        <html>
            <head>
                <title>First Title</title>
                <title>Second Title</title>
            </head>
        </html>
        `;
        const result = parseHtml(html);
        // Current behavior (bug): "First TitleSecond Title"
        // Desired behavior: "First Title"
        expect(result.title).toBe('First Title');
    });

    it('should ignore children tags inside title', () => {
        const html = `
        <html>
            <head>
                <title>My Title <div style="display:none">Hidden</div></title>
            </head>
        </html>
        `;
        const result = parseHtml(html);
        // Sometimes dirty HTML has tags inside title.
        // Spec says title contains text only, but browsers might parse it.
        // Cheerio parsers title content as text usually if it's strict, but let's see.
        expect(result.title).toBe('My Title <div style="display:none">Hidden</div>');
    });

    it('should ignore SVG titles', () => {
        const html = `
        <html>
            <head>
                <title>Real Title</title>
            </head>
            <body>
                <svg>
                    <title>SVG Title</title>
                </svg>
            </body>
        </html>
        `;
        const result = parseHtml(html);
        expect(result.title).toBe('Real Title');
    });
});
