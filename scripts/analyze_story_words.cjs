const fs = require('fs');
const path = require('path');

const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const vocabSet = new Map();
vocab.forEach(v => {
  if (v.word) vocabSet.set(v.word.toLowerCase().trim(), v);
});

console.log(`Total vocab entries: ${vocabSet.size}`);

const allTokens = new Map(); // word -> count

stories.forEach(story => {
  const words = story.content.split(/\s+/);
  words.forEach(rawWord => {
    const cleanWord = rawWord.replace(/[.,!?;:'"“”‘’()\[\]]/g, '').toLowerCase().trim();
    if (cleanWord) {
      allTokens.set(cleanWord, (allTokens.get(cleanWord) || 0) + 1);
    }
  });
});

console.log(`Total unique words across all stories: ${allTokens.size}`);

const missing = [];
const found = [];

allTokens.forEach((count, word) => {
  if (vocabSet.has(word)) {
    found.push({ word, count });
  } else {
    missing.push({ word, count });
  }
});

console.log(`Found in vocab: ${found.length}`);
console.log(`Missing in vocab: ${missing.length}`);
console.log('\n--- Missing words list ---');
missing.sort((a, b) => b.count - a.count);
missing.forEach(m => console.log(`${m.word} (${m.count}x)`));
