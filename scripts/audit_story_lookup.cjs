const fs = require('fs');
const path = require('path');
const stories = require('../src/data/stories.json');
const vocabularyData = require('../src/data/vocabulary.json');

// Let's create the wordLookup function in cjs directly
const vocabMap = new Map();
vocabularyData.forEach(v => {
  if (v.word) {
    vocabMap.set(v.word.toLowerCase().trim(), v);
  }
});

// Import contractions & supplemental from wordLookup.js
// Let's read wordLookup.js and extract supplementalDict and contractions
const wordLookupCode = fs.readFileSync(path.join(__dirname, '../src/utils/wordLookup.js'), 'utf8');

// We can eval or convert wordLookup.js to cjs
const cjsCode = wordLookupCode
  .replace(/import vocabularyData from '\.\.\/data\/vocabulary\.json';/, 'const vocabularyData = require("../src/data/vocabulary.json");')
  .replace(/export function lookupWord/, 'function lookupWord')
  + '\nmodule.exports = { lookupWord, vocabMap, contractions, irregulars, supplementalDict };';

const tempPath = path.join(__dirname, 'temp_word_lookup_module.cjs');
fs.writeFileSync(tempPath, cjsCode);
const { lookupWord } = require('./temp_word_lookup_module.cjs');

console.log('=== STARTING STORY VOCABULARY AUDIT ===');

const allStoryTokens = [];
stories.forEach(story => {
  const words = story.content.split(/\s+/);
  words.forEach(w => {
    const cleaned = w.trim().replace(/^[.,!?;:'"“”‘’()[\]{}—–\s]+/, '').replace(/[.,!?;:'"“”‘’()[\]{}—–\s]+$/, '');
    if (cleaned) {
      allStoryTokens.push({
        storyId: story.id,
        storyTitle: story.title,
        token: cleaned
      });
    }
  });
});

console.log('Total words in all stories:', allStoryTokens.length);

const uniqueTokens = [...new Set(allStoryTokens.map(t => t.token))];
console.log('Unique word tokens:', uniqueTokens.length);

const notFoundWords = [];
const wordResults = [];

uniqueTokens.forEach(token => {
  const res = lookupWord(token);
  if (!res || res.notFound) {
    notFoundWords.push(token);
  } else {
    wordResults.push({
      token,
      matched: res.word,
      base: res.baseWord || null,
      type: res.type,
      meaning: res.meaning,
      thai_pronunciation: res.thai_pronunciation,
      ipa: res.ipa,
      note: res.note || null
    });
  }
});

console.log('\n--- NOT FOUND WORDS (' + notFoundWords.length + ') ---');
console.log(notFoundWords.join(', '));

// Check words where thai_pronunciation is strange or suspicious
const suspicious = [];
wordResults.forEach(r => {
  if (!r.thai_pronunciation || r.thai_pronunciation.trim() === '') {
    suspicious.push({ token: r.token, issue: 'Missing thai_pronunciation' });
  } else if (!r.ipa || r.ipa.trim() === '' || r.ipa.includes('/')) {
    suspicious.push({ token: r.token, issue: 'Bad IPA: ' + r.ipa });
  } else if (!r.meaning || r.meaning.trim() === '') {
    suspicious.push({ token: r.token, issue: 'Missing meaning' });
  }
});

console.log('\n--- SUSPICIOUS ENTRIES (' + suspicious.length + ') ---');
console.log(suspicious);

// Output sample lookup for first 30 words
console.log('\n--- SAMPLE 30 WORDS FROM STORIES ---');
wordResults.slice(0, 30).forEach(r => {
  console.log(`${r.token} -> ${r.matched} (${r.type}) [/${r.ipa}/] "${r.thai_pronunciation}" : ${r.meaning}`);
});

fs.unlinkSync(tempPath);
