const fs = require('fs');
const path = require('path');
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const auArtifacts = vocab.filter(v => (v.thai_pronunciation || '').includes('า-อู'));
const aiArtifacts = vocab.filter(v => (v.thai_pronunciation || '').includes('า-อี'));
const brokenConsonantClusters = vocab.filter(v => /-[ก-ฮ][ก-ฮ]/.test(v.thai_pronunciation || ''));

console.log(`Words with 'า-อู' (/aʊ/ artifact): ${auArtifacts.length}`);
console.log(`Words with 'า-อี' (/aɪ/ artifact): ${aiArtifacts.length}`);
console.log(`Words with broken hyphen consonant clusters: ${brokenConsonantClusters.length}`);

console.log('\n--- SAMPLE OF า-อู WORDS ---');
auArtifacts.slice(0, 30).forEach(x => {
  console.log(`[ID ${String(x.id).padStart(4)}] ${x.word.padEnd(16)} | Thai: ${x.thai_pronunciation.padEnd(24)} | IPA: ${x.ipa}`);
});
