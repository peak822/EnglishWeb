const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));
const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const sentences = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/sentences.json'), 'utf8'));

console.log('=== DATASET OVERVIEW ===');
console.log(`Vocabulary entries: ${vocab.length}`);
console.log(`Stories: ${stories.length}`);
console.log(`Sentences: ${sentences.length}`);

// 1. Check vocabulary
let emptyThai = [];
let emptyIpa = [];
let emptyMeaning = [];
let invalidLevels = [];
let invalidTypes = [];
let englishInThai = [];
let thaiPronunciationAnomalies = [];
let suspiciousMeanings = [];
let suspiciousIPAs = [];
let duplicateWords = {};

const validLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1']);

vocab.forEach((v, idx) => {
  const word = (v.word || '').trim();
  const lower = word.toLowerCase();
  const thai = (v.thai_pronunciation || '').trim();
  const ipa = (v.ipa || '').trim();
  const meaning = (v.meaning || '').trim();
  const type = (v.type || '').trim();
  const level = (v.level || '').trim();

  // Track duplicates
  if (!duplicateWords[lower]) duplicateWords[lower] = [];
  duplicateWords[lower].push({ id: v.id, type, level, meaning, thai });

  if (!thai) emptyThai.push({ id: v.id, word });
  if (!ipa) emptyIpa.push({ id: v.id, word });
  if (!meaning) emptyMeaning.push({ id: v.id, word });
  if (!validLevels.has(level)) invalidLevels.push({ id: v.id, word, level });
  if (!type) invalidTypes.push({ id: v.id, word });

  if (/[a-zA-Z]/.test(thai)) {
    englishInThai.push({ id: v.id, word, thai });
  }

  // IPA checks
  if (ipa.length <= 1 || ipa === 'null' || ipa === 'undefined' || ipa === word) {
    suspiciousIPAs.push({ id: v.id, word, ipa });
  }

  // Suspicious meaning checks
  if (meaning === word || meaning.length <= 1 || /^\[.*\]$/.test(meaning) || meaning.includes('undefined') || meaning.includes('null')) {
    suspiciousMeanings.push({ id: v.id, word, meaning, reason: 'trivial_or_null' });
  } else {
    // Check if meaning is predominantly English (e.g. untranslated)
    const thaiChars = (meaning.match(/[\u0E00-\u0E7F]/g) || []).length;
    const engChars = (meaning.match(/[a-zA-Z]/g) || []).length;
    if (thaiChars === 0 && engChars > 2) {
      suspiciousMeanings.push({ id: v.id, word, meaning, reason: 'pure_english' });
    }
  }

  // Thai pronunciation quality checks
  // Check for broken vowels / tone marks / hyphen issues
  if (thai.startsWith('-') || thai.endsWith('-') || thai.includes('--') || thai.includes(' -') || thai.includes('- ')) {
    thaiPronunciationAnomalies.push({ id: v.id, word, thai, reason: 'hyphen_format' });
  }

  // Check consonant mismatches
  const firstLetter = lower[0];
  if (!['a','e','i','o','u','y'].includes(firstLetter) && !['hour','honest','honour','heir','herb'].includes(lower)) {
    // If English starts with consonant (b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, z)
    // but Thai starts with 'อ' without a leading vowel that begins with a consonant sound
    // Note: Thai 'เอ-', 'แอ-', 'โอ-', 'ใ-', 'ไ-' have vowels preceding initial consonant!
    // But if it is 'อ' as initial consonant (e.g. 'อะ', 'อา', 'อิ', 'อี', 'อุ', 'อู', 'เออะ', 'แอก', 'แอน')
    if (thai.startsWith('อะ') || thai.startsWith('อา') || thai.startsWith('อิ') || thai.startsWith('อี') || 
        thai.startsWith('อุ') || thai.startsWith('อู') || thai.startsWith('เออะ') || thai.startsWith('แอก') ||
        thai.startsWith('ออย') || thai.startsWith('เอา') || thai.startsWith('อั') || thai.startsWith('อ็')) {
      thaiPronunciationAnomalies.push({ id: v.id, word, thai, ipa, reason: 'consonant_word_starts_with_vowel_sound' });
    }
  }
});

console.log('\n=== VOCABULARY AUDIT RESULTS ===');
console.log(`Empty Thai: ${emptyThai.length}`);
console.log(`Empty IPA: ${emptyIpa.length}`);
console.log(`Empty Meaning: ${emptyMeaning.length}`);
console.log(`Invalid Level: ${invalidLevels.length}`);
console.log(`Invalid Type: ${invalidTypes.length}`);
console.log(`English letters in Thai: ${englishInThai.length}`);
console.log(`Suspicious IPAs: ${suspiciousIPAs.length}`);
console.log(`Suspicious Meanings: ${suspiciousMeanings.length}`);
console.log(`Thai Pronunciation Format/Vowel Anomalies: ${thaiPronunciationAnomalies.length}`);

// Sample anomalies
if (englishInThai.length > 0) {
  console.log('\nSample English in Thai:', englishInThai.slice(0, 10));
}
if (suspiciousIPAs.length > 0) {
  console.log('\nSample Suspicious IPAs:', suspiciousIPAs.slice(0, 10));
}
if (suspiciousMeanings.length > 0) {
  console.log('\nSample Suspicious Meanings:', suspiciousMeanings.slice(0, 15));
}
if (thaiPronunciationAnomalies.length > 0) {
  console.log('\nSample Thai Pronunciation Anomalies:', thaiPronunciationAnomalies.slice(0, 20));
}

// 2. Check duplicate words with identical vs distinct definitions
let exactDuplicates = 0;
let homographs = 0;
for (const [w, entries] of Object.entries(duplicateWords)) {
  if (entries.length > 1) {
    // Check if types are different or identical
    const types = new Set(entries.map(e => e.type));
    if (types.size < entries.length) {
      exactDuplicates++;
    } else {
      homographs++;
    }
  }
}
console.log(`\nDuplicate words: exact duplicate POS=${exactDuplicates}, distinct POS (homographs)=${homographs}`);

// 3. Check stories
console.log('\n=== STORIES AUDIT ===');
let storyIssues = [];
stories.forEach((st, i) => {
  if (!st.title || !st.titleThai) storyIssues.push(`Story ${st.id}: missing title/titleThai`);
  if (!st.content || !st.contentThai) storyIssues.push(`Story ${st.id}: missing content/contentThai`);
  if (!st.level) storyIssues.push(`Story ${st.id}: missing level`);
});
console.log(`Story issues found: ${storyIssues.length}`);
if (storyIssues.length > 0) console.log(storyIssues);

// 4. Check sentences
console.log('\n=== SENTENCES AUDIT ===');
let sentenceIssues = [];
sentences.forEach((sn, i) => {
  if (!sn.word || !sn.sentence) {
    sentenceIssues.push(`Sentence index ${i}: missing word or sentence`);
  }
  if (sn.sentence && !sn.sentence.includes('_____')) {
    sentenceIssues.push(`Sentence index ${i} (${sn.word}): no blank placeholder '_____'`);
  }
});
console.log(`Sentence issues found: ${sentenceIssues.length}`);
if (sentenceIssues.length > 0) console.log(sentenceIssues.slice(0, 10));
