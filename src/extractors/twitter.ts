import { CheerioAPI } from 'cheerio';
import { MetadataExtractor } from './base';
import { MetadataResult } from '../types';

export class TwitterExtractor extends MetadataExtractor {
    extract($: CheerioAPI, result: MetadataResult): void {
        $('meta[name^="twitter:"]').each((_, element) => {
            const name = $(element).attr('name');
            const content = $(element).attr('content');

            if (name && content) {
                // Strip 'twitter:' prefix for cleaner result object keys
                const key = name.replace(/^twitter:/, '');
                result.twitter[key] = content;

                // Also add to raw tags
                result.tags.push({
                    tag: name,
                    value: content,
                    attributes: { name, content }
                });
            }
        });
    }
}
