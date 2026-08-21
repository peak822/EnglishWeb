const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

console.log(`Loaded ${vocab.length} vocabulary entries.`);

const allIssues = [];

vocab.forEach((v, idx) => {
  const w = (v.word || '').toLowerCase().trim();
  const th = (v.thai_pronunciation || '').trim();
  const ipa = (v.ipa || '').trim();
  const flags = [];

  // 1. Missing or empty
  if (!th) {
    flags.push('Missing pronunciation');
  }

  // 2. Garbled syllable artifacts
  if (/งิ|โอ-ไอ|ไอ-อุ|โอ-เรอะ|เซ็ด|แรส์|พอยพนท์|แวส์|แทท|แมก-งิ|บินด์-งิ|คัท-งิ|แอก-เอาคนท์/.test(th)) {
    flags.push('Garbled syllable artifact');
  }

  // 3. Inverted initial vowels on vowels
  if (w.startsWith('a') && /^(เนย์|เดย์|เมย์|เจย์|เลย์|ลั-|เก็-|เแด-)/.test(th)) {
    flags.push('Inverted A- prefix');
  }
  if (w.startsWith('e') && /^(เนย์|เดย์|เมย์|เจย์|เลย์|เก็-|เแด-|เบ็ด|เพ็รส์)/.test(th)) {
    flags.push('Inverted E- prefix');
  }
  if (w.startsWith('i') && /^(เนย์|เดย์|เมย์|เจย์|เลย์|เก็-|เแด-)/.test(th)) {
    flags.push('Inverted I- prefix');
  }
  if (w.startsWith('o') && /^(เนย์|เดย์|เมย์|เจย์|เลย์|เก็-)/.test(th)) {
    flags.push('Inverted O- prefix');
  }
  if (w.startsWith('u') && /^(เนย์|เดย์|เมย์|เจย์|เลย์|เก็-)/.test(th)) {
    flags.push('Inverted U- prefix');
  }

  // 4. Suspiciously short Thai transcription for long word
  if (w.length >= 6 && th.length <= 4) {
    flags.push('Suspiciously short Thai');
  }

  // 5. English -ing ending words having corrupted Thai
  if (w.endsWith('ing') && (th.endsWith('งิ') || th.endsWith('งิส์') || !th.includes('ง'))) {
    flags.push('Corrupted -ing pronunciation');
  }

  if (flags.length > 0) {
    allIssues.push({
      idx,
      id: v.id,
      word: v.word,
      ipa: v.ipa,
      th: v.thai_pronunciation,
      meaning: v.meaning,
      flags
    });
  }
});

console.log(`Total flagged entries: ${allIssues.length}`);
const categoriesCount = {};
allIssues.forEach(x => {
  x.flags.forEach(f => {
    categoriesCount[f] = (categoriesCount[f] || 0) + 1;
  });
});
console.log('Breakdown:', categoriesCount);

console.log('\nTop 50 Sample Issues:');
allIssues.slice(0, 50).forEach((x, i) => {
  console.log(`${i + 1}. "${x.word}" [${x.ipa}] -> "${x.th}" (${x.meaning}) => [${x.flags.join(', ')}]`);
});

fs.writeFileSync(path.join(__dirname, 'anomalies.json'), JSON.stringify(allIssues, null, 2), 'utf8');
console.log(`Wrote detailed anomalies to scripts/anomalies.json`);
