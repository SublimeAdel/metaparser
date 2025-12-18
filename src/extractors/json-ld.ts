import * as cheerio from 'cheerio';
import { MetadataResult } from '../types';
import { MetadataExtractor } from './base';

export class JsonLDExtractor implements MetadataExtractor {
    extract($: cheerio.CheerioAPI, result: MetadataResult): void {
        const scripts = $('script[type="application/ld+json"]');

        if (scripts.length === 0) {
            return;
        }

        const jsonItems: any[] = [];

        scripts.each((_, el) => {
            try {
                const content = $(el).html();
                if (content) {
                    const json = JSON.parse(content);
                    jsonItems.push(json);
                }
            } catch (e) {
                // Ignore malformed JSON-LD
            }
        });

        if (jsonItems.length > 0) {
            // If we already have some (unlikely starting fresh), append or set
            result.jsonld = (result.jsonld || []).concat(jsonItems);
        }
    }
}
