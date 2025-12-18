import { CheerioAPI } from 'cheerio';
import { MetadataExtractor } from './base';
import { MetadataResult } from '../types';

export class BasicMetadataExtractor extends MetadataExtractor {
    extract($: CheerioAPI, result: MetadataResult): void {
        // Title
        const title = $('head > title').first().text() || $('title').first().text() || $('meta[name="title"]').attr('content');
        if (title) {
            result.title = title;
            result.tags.push({ tag: 'title', value: title });
        }

        // Description
        const description = $('meta[name="description"]').attr('content');
        if (description) {
            result.description = description;
            result.tags.push({ tag: 'description', value: description, attributes: { name: 'description', content: description } });
        }

        // Favicon
        // Check for link rel="icon" or "shortcut icon"
        const favicon = $('link[rel="icon"]').attr('href') ||
            $('link[rel="shortcut icon"]').attr('href') ||
            $('link[rel="apple-touch-icon"]').attr('href');

        if (favicon) {
            result.favicon = favicon;
            // We don't strictly add link tags to 'tags' array usually, but we can if needed. 
            // For now, let's just extract the value.
        }
    }
}
