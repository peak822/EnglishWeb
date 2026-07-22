const fs = require('fs');

async function translateText(text) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=th&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) return null;
        const json = await response.json();
        return json[0][0][0];
    } catch (e) {
        return null;
    }
}

async function run() {
    const file = '../src/data/vocabulary.json';
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    const missing = data.filter(d => !d.meaning);
    console.log(`Missing translations: ${missing.length}`);

    let count = 0;
    for (const item of missing) {
        let translation = null;
        for (let attempt = 0; attempt < 3; attempt++) {
            translation = await translateText(item.word);
            if (translation) break;
            await new Promise(r => setTimeout(r, 1000));
        }
        
        if (translation) {
            item.meaning = translation;
            count++;
            if (count % 50 === 0) {
                console.log(`Translated ${count}/${missing.length}`);
                fs.writeFileSync(file, JSON.stringify(data, null, 2));
            }
        }
        
        // Small delay to prevent rate limit
        await new Promise(r => setTimeout(r, 100));
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Finished translating ${count} items.`);
}

run();
