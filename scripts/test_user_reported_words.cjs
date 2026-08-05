const fs = require('fs');
const path = require('path');
const vocabularyData = require('../src/data/vocabulary.json');

const wordLookupCode = fs.readFileSync(path.join(__dirname, '../src/utils/wordLookup.js'), 'utf8');
const cjsCode = wordLookupCode
  .replace(/import vocabularyData from '\.\.\/data\/vocabulary\.json';/, 'const vocabularyData = require("../src/data/vocabulary.json");')
  .replace(/export function lookupWord/, 'function lookupWord')
  + '\nmodule.exports = { lookupWord };';

const tempPath = path.join(__dirname, 'temp_word_lookup_test.cjs');
fs.writeFileSync(tempPath, cjsCode);
const { lookupWord } = require('./temp_word_lookup_test.cjs');

const targetWords = [
  'week', 'weeks', 'weekend', 'manage', 'managed', 'manages', 'managing', 'manager', 'management',
  'laugh', 'laughed', 'laughing', 'laughter',
  'beast', 'bleak', 'bounce', 'damage', 'data', 'database', 'deep', 'door', 'double', 'down', 'download',
  'dream', 'due', 'duty', 'brain', 'bread', 'fresh', 'green', 'nobody', 'rule', 'scream', 'screen'
];

console.log('=== VERIFYING USER REPORTED AND SIMILAR WORDS ===\n');
targetWords.forEach(w => {
  const res = lookupWord(w);
  if (res) {
    console.log(`${w.padEnd(12)} -> Word: ${res.word.padEnd(12)} | IPA: ${(res.ipa || '').padEnd(20)} | Thai: ${(res.thai_pronunciation || '').padEnd(24)} | Meaning: ${res.meaning}`);
  } else {
    console.error(`ERROR: ${w} NOT FOUND`);
  }
});

fs.unlinkSync(tempPath);
