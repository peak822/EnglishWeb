const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const aiArtifacts = vocab.filter(v => (v.thai_pronunciation || '').includes('า-อี'));
console.log('Total a-ee artifacts:', aiArtifacts.length);
aiArtifacts.slice(0, 30).forEach(x => {
  console.log(`[${String(x.id).padStart(4)}] ${x.word.padEnd(16)} | Thai: ${x.thai_pronunciation.padEnd(24)} | IPA: ${x.ipa}`);
});
