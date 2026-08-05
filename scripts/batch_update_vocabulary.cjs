const fs = require('fs');
const path = require('path');
const { generateThaiPronunciation, validatePronunciation } = require('./generate_thai_pronunciations.cjs');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

console.log(`Starting batch regeneration for ${vocab.length} vocabulary entries...`);

let updatedCount = 0;
let failedWords = [];

const updatedVocab = vocab.map(item => {
  const generated = generateThaiPronunciation(item.word, item.ipa);
  const validation = validatePronunciation(generated);

  if (!validation.valid) {
    failedWords.push({ word: item.word, generated, errors: validation.errors });
  }

  updatedCount++;
  return {
    ...item,
    thai_pronunciation: generated
  };
});

if (failedWords.length > 0) {
  console.error(`❌ Found ${failedWords.length} words with generation errors:`);
  console.error(failedWords.slice(0, 20));
  process.exit(1);
}

fs.writeFileSync(vocabPath, JSON.stringify(updatedVocab, null, 2), 'utf8');
console.log(`✅ Successfully updated all ${updatedCount} words in ${vocabPath}!`);
