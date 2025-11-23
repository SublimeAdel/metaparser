import { Metaparser } from './parser';
import { fetchHtml } from './utils/fetcher';
import { ParserOptions, MetadataResult } from './types';

export * from './types';
export * from './parser';
export * from './extractors/base';

// Convenience function
export async function parseUrl(url: string, options: ParserOptions = {}): Promise<MetadataResult> {
    const html = await fetchHtml(url);
    const parser = new Metaparser();
    const result = parser.parse(html, options);
    result.url = url;

    // Favicon fetching fallback
    if (options.fetchFavicon && !result.favicon) {
        try {
            const faviconUrl = new URL('/favicon.ico', url).toString();
            const response = await fetch(faviconUrl, { method: 'HEAD' });
            if (response.ok) {
                result.favicon = faviconUrl;
            }
        } catch (e) {
            // Ignore error, just don't set favicon
        }
    }

    return result;
}

export function parseHtml(html: string, options: ParserOptions = {}): MetadataResult {
    const parser = new Metaparser();
    return parser.parse(html, options);
}
