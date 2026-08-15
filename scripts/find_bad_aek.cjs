const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const badAek = vocab.filter(v => {
  const th = v.thai_pronunciation || '';
  const w = v.word.toLowerCase();
  // If Thai contains 'แอก' but English word does not start with vowel sound
  if ((th.includes('แอก') || th.includes('แอกต์') || th === 'แอก' || th === 'แอกต์') && !['a', 'ac', 'act'].some(p => w.startsWith(p))) {
    return true;
  }
  return false;
});

console.log(`Found ${badAek.length} bad แอก words:`);
badAek.forEach(x => console.log(`[ID ${x.id}] ${x.word} -> Thai: "${x.thai_pronunciation}", IPA: "${x.ipa}"`));
