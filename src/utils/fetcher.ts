import { FetchOptions } from '../types';

export async function fetchHtml(url: string, options: FetchOptions = {}): Promise<string> {
    const { timeout = 5000, userAgent = 'metaparser-bot/1.0', headers = {}, ...rest } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': userAgent,
                ...headers
            },
            signal: controller.signal,
            ...rest
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }

        return await response.text();
    } finally {
        clearTimeout(id);
    }
}
