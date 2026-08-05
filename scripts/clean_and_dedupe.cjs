const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const raw = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

const seen = new Set();
const clean = [];

for (const item of raw) {
  const normWord = item.word.toLowerCase().trim();
  if (!seen.has(normWord)) {
    seen.add(normWord);
    clean.push({
      ...item,
      word: normWord,
      meaning: item.meaning.trim(),
      thai_pronunciation: (item.thai_pronunciation || '').trim(),
      ipa: (item.ipa || '').trim(),
      level: item.level || 'B2',
      type: item.type || 'n.'
    });
  }
}

clean.sort((a, b) => a.word.localeCompare(b.word));

clean.forEach((item, index) => {
  item.id = index + 1;
});

fs.writeFileSync(vocabPath, JSON.stringify(clean, null, 2), 'utf8');
console.log(`Deduplication complete. Final count: ${clean.length} unique words.`);
