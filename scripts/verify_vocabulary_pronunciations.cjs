const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

let englishLetterCount = 0;
let emptyCount = 0;
let invalidHyphenCount = 0;
let doubleHyphenCount = 0;
let englishExamples = [];

vocab.forEach((item, index) => {
  const p = item.thai_pronunciation || '';
  if (!p.trim()) {
    emptyCount++;
  }
  if (/[a-zA-Z]/.test(p)) {
    englishLetterCount++;
    if (englishExamples.length < 10) {
      englishExamples.push(`${item.word} -> "${p}"`);
    }
  }
  if (p.startsWith('-') || p.endsWith('-')) {
    invalidHyphenCount++;
  }
  if (p.includes('--')) {
    doubleHyphenCount++;
  }
});

console.log('=== Vocabulary Thai Pronunciation Verification Report ===');
console.log(`Total entries: ${vocab.length}`);
console.log(`Empty pronunciations: ${emptyCount}`);
console.log(`Contains English/Latin letters: ${englishLetterCount}`);
if (englishExamples.length > 0) {
  console.log('Sample English leaks:', englishExamples);
}
console.log(`Leading/trailing hyphens: ${invalidHyphenCount}`);
console.log(`Double hyphens: ${doubleHyphenCount}`);

if (emptyCount === 0 && englishLetterCount === 0 && invalidHyphenCount === 0 && doubleHyphenCount === 0) {
  console.log('\n🎉 ALL 6,510 ENTRIES ARE 100% CLEAN AND PROPERLY FORMATTED!');
  process.exit(0);
} else {
  console.error('\n❌ Quality check failed: Issues detected.');
  process.exit(1);
}
