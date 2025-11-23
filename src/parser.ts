import * as cheerio from 'cheerio';
import { MetadataResult, ParserOptions } from './types';
import { MetadataExtractor } from './extractors/base';
import { OpenGraphExtractor } from './extractors/og';
import { BasicMetadataExtractor } from './extractors/basic';

import { TwitterExtractor } from './extractors/twitter';

export class Metaparser {
    private extractors: MetadataExtractor[];

    constructor() {
        this.extractors = [
            new BasicMetadataExtractor(),
            new OpenGraphExtractor(),
            new TwitterExtractor(),
            // Add more extractors here
        ];
    }

    parse(html: string, options: ParserOptions = {}): MetadataResult {
        const $ = cheerio.load(html);

        const result: MetadataResult = {
            og: {},
            twitter: {},
            tags: [],
            missing: []
        };

        // Run all extractors
        for (const extractor of this.extractors) {
            extractor.extract($, result);
        }

        // Validation
        if (options.requiredTags) {
            this.validate(result, options.requiredTags);
        }

        return result;
    }

    private validate(result: MetadataResult, requiredTags: string[]): void {
        for (const tag of requiredTags) {
            let found = false;

            // Check if it's a known property in our result object
            if (tag.startsWith('og:')) {
                const key = tag.replace(/^og:/, '');
                if (result.og[key]) found = true;
            } else if (tag.startsWith('twitter:')) {
                const key = tag.replace(/^twitter:/, '');
                if (result.twitter[key]) found = true;
            } else if (tag === 'title') {
                if (result.title) found = true;
            } else if (tag === 'description') {
                if (result.description) found = true;
            } else {
                // Fallback to checking raw tags list
                if (result.tags.some(t => t.tag === tag)) found = true;
            }

            if (!found) {
                result.missing.push(tag);
            }
        }
    }
}
