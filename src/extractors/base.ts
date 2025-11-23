import { CheerioAPI } from 'cheerio';
import { MetadataResult } from '../types';

export abstract class MetadataExtractor {
    abstract extract($: CheerioAPI, result: MetadataResult): void;
}
