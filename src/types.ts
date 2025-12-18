export interface Metatag {
    tag: string;
    value: string;
    attributes?: Record<string, string>;
}

export interface MetadataResult {
    title?: string;
    description?: string;
    favicon?: string;
    url?: string;

    og: Record<string, string>;
    twitter: Record<string, string>;
    jsonld?: any[];

    // All raw tags found
    tags: Metatag[];

    // List of expected tags that were not found
    missing: string[];
}

export interface FetchOptions extends RequestInit {
    timeout?: number;
    userAgent?: string;
}

export interface ParserOptions {
    // List of tags that must be present, otherwise they appear in 'missing'
    requiredTags?: string[];

    // If true, will try to fetch favicon if not explicitly defined in meta
    fetchFavicon?: boolean;
    requestOptions?: FetchOptions;
}
