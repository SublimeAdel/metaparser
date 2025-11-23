import { CheerioAPI } from 'cheerio';
import { MetadataExtractor } from './base';
import { MetadataResult } from '../types';

export class OpenGraphExtractor extends MetadataExtractor {
    extract($: CheerioAPI, result: MetadataResult): void {
        $('meta[property^="og:"]').each((_, element) => {
            const property = $(element).attr('property');
            const content = $(element).attr('content');

            if (property && content) {
                // Strip 'og:' prefix for cleaner result object keys
                const key = property.replace(/^og:/, '');
                result.og[key] = content;

                // Also add to raw tags
                result.tags.push({
                    tag: property,
                    value: content,
                    attributes: { property, content }
                });
            }
        });
    }
}
