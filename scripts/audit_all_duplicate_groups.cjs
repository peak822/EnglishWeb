const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const thaiMap = {};
vocab.forEach(v => {
  const th = v.thai_pronunciation || '';
  if (!thaiMap[th]) thaiMap[th] = [];
  thaiMap[th].push(v);
});

let problematicGroups = [];
for (const [th, list] of Object.entries(thaiMap)) {
  if (list.length >= 3) {
    // Check if the words are truly homophones (e.g., right/write/rite, bear/bare, meat/meet, see/sea, to/too/two, by/buy/bye)
    // or if they are totally different words that got corrupted (e.g. drive/five/life/like all being "ไอ")
    const words = list.map(x => x.word.toLowerCase());
    const ipas = new Set(list.map(x => x.ipa));
    if (ipas.size > 1 || list.length > 4) {
      problematicGroups.push({ th, count: list.length, words: list.map(x => `${x.word} (ID: ${x.id})`) });
    }
  }
}

console.log(`Found ${problematicGroups.length} suspicious duplicate pronunciation groups:`);
problematicGroups.sort((a, b) => b.count - a.count);
problematicGroups.forEach(g => {
  console.log(`\n- Thai: "${g.th}" (${g.count} words):`);
  console.log('  ' + g.words.slice(0, 15).join(', ') + (g.words.length > 15 ? '...' : ''));
});
