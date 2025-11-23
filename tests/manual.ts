import { parseUrl } from '../src/index';

async function run() {
    const url = process.argv[2];

    if (!url) {
        console.error('Please provide a URL to test.');
        console.error('Usage: npx tsx tests/manual.ts <url>');
        process.exit(1);
    }

    console.log(`\n🔍 Fetching and parsing: ${url} ...\n`);

    try {
        const result = await parseUrl(url, {
            fetchFavicon: true,
            requiredTags: ['og:title', 'og:description', 'og:image']
        });

        console.log('--- 📊 Metadata Result ---');
        console.log(JSON.stringify(result, null, 2));
        console.log('\n--------------------------');

        if (result.missing.length > 0) {
            console.log('⚠️  Missing Tags:', result.missing);
        } else {
            console.log('✅ All required tags found!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

run();
