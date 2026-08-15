const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const thaiMap = {};
vocab.forEach(v => {
  const th = v.thai_pronunciation || '';
  if (!thaiMap[th]) thaiMap[th] = [];
  thaiMap[th].push(v);
});

console.log('=== FREQUENT THAI PRONUNCIATIONS (> 5 words sharing exact same pronunciation) ===');
for (const [th, list] of Object.entries(thaiMap)) {
  if (list.length > 5) {
    console.log(`\nThai: "${th}" (${list.length} words):`);
    console.log(list.map(x => `${x.word} (IPA: ${x.ipa})`).join(', '));
  }
}
