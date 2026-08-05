const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

console.log(`Checking vocabulary dataset: ${vocab.length} words...`);

let errors = [];
const wordSet = new Set();
const levels = {};

vocab.forEach((item, index) => {
  if (!item.id) errors.push(`Missing id at index ${index}`);
  if (!item.word || typeof item.word !== 'string') errors.push(`Invalid word at index ${index}`);
  if (!item.level) errors.push(`Missing level for word '${item.word}'`);
  if (!item.type) errors.push(`Missing type for word '${item.word}'`);
  if (!item.meaning || item.meaning.trim() === '' || item.meaning.includes('?')) {
    errors.push(`Invalid/missing meaning for word '${item.word}' (ID: ${item.id})`);
  }
  if (!item.thai_pronunciation || item.thai_pronunciation.trim() === '') {
    errors.push(`Missing thai_pronunciation for word '${item.word}' (ID: ${item.id})`);
  }
  
  levels[item.level || 'Unknown'] = (levels[item.level || 'Unknown'] || 0) + 1;
  wordSet.add(item.word.toLowerCase());
});

console.log('Level breakdown:', levels);
console.log(`Total unique words: ${wordSet.size}`);

if (vocab.length < 5000) {
  errors.push(`Dataset has only ${vocab.length} words, expected >= 5000`);
}

if (errors.length > 0) {
  console.error(`❌ Verification failed with ${errors.length} errors.`);
  console.error('Sample errors:', errors.slice(0, 10));
  process.exit(1);
} else {
  console.log('✅ Verification passed! Oxford 5000 dataset is 100% valid.');
  process.exit(0);
}
