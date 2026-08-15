const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));
const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/stories.json'), 'utf8'));
const sentences = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/sentences.json'), 'utf8'));
const wordLookupCode = fs.readFileSync(path.join(__dirname, '../src/utils/wordLookup.js'), 'utf8');

const findings = {
  englishOrIpaInThaiPronunciation: [],
  shortOrNonsenseThaiPronunciation: [],
  ipaIssues: [],
  meaningAnomalies: [],
  wordLookupIssues: [],
  storyTranslations: [],
  sentencesAccuracy: []
};

// 1. Check all vocabulary
vocab.forEach((v) => {
  const w = (v.word || '').trim();
  const lower = w.toLowerCase();
  const thai = (v.thai_pronunciation || '').trim();
  const ipa = (v.ipa || '').trim();
  const m = (v.meaning || '').trim();

  // (A) English or IPA special characters in thai_pronunciation
  if (/[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]/.test(thai)) {
    findings.englishOrIpaInThaiPronunciation.push({
      id: v.id,
      word: w,
      type: v.type,
      level: v.level,
      ipa: ipa,
      thai_pronunciation: thai,
      meaning: m
    });
  }

  // (B) Nonsense / truncated Thai pronunciation (like "แอก" for "crack", "drag", "track" or length < 2)
  if (thai.length < 2 || thai === 'แอก' || thai === 'แอ' || (thai === 'อะ' && !['a', 'uh', 'ah'].includes(lower))) {
    findings.shortOrNonsenseThaiPronunciation.push({
      id: v.id,
      word: w,
      type: v.type,
      level: v.level,
      ipa: ipa,
      thai_pronunciation: thai,
      meaning: m,
      reason: 'truncated_or_mismatched'
    });
  }

  // (C) IPA issues
  if (ipa === 'null' || ipa === 'undefined' || !ipa || (ipa === w && !['a', 'i'].includes(lower)) || ipa.length <= 1) {
    findings.ipaIssues.push({
      id: v.id,
      word: w,
      type: v.type,
      level: v.level,
      ipa: ipa,
      thai_pronunciation: thai,
      meaning: m
    });
  }

  // (D) Meaning anomalies
  if (m.includes('undefined') || m.includes('null') || /[\uFFFD\u0000-\u001F]/.test(m) || m.length <= 1) {
    findings.meaningAnomalies.push({
      id: v.id,
      word: w,
      meaning: m,
      reason: 'corrupted_or_empty'
    });
  }
});

// 2. Check wordLookup static maps
const entryRegex = /['"]([^'"]+)['"]\s*:\s*\{\s*word:\s*['"]([^'"]+)['"],\s*type:\s*['"]([^'"]*)['"],\s*(?:level:\s*['"]([^'"]*)['"],\s*)?meaning:\s*['"]([^'"]+)['"],\s*thai_pronunciation:\s*['"]([^'"]+)['"],\s*ipa:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = entryRegex.exec(wordLookupCode)) !== null) {
  const [_, key, word, type, level, meaning, thai, ipa] = match;
  if (/[a-zA-Zŋɫɔəæɛɪʊθðʃʒʧʤʌːˈˌ]/.test(thai)) {
    findings.wordLookupIssues.push({ key, word, thai, ipa, issue: 'english_or_ipa_in_thai' });
  }
}

// 3. Output summary report
console.log('=== SUMMARY OF FINDINGS ===');
console.log(`1. English/IPA characters leaked into Thai pronunciation: ${findings.englishOrIpaInThaiPronunciation.length}`);
console.log(`2. Short/nonsense/truncated Thai pronunciations: ${findings.shortOrNonsenseThaiPronunciation.length}`);
console.log(`3. Suspicious / Null / Missing IPAs: ${findings.ipaIssues.length}`);
console.log(`4. Corrupted / Missing Meanings: ${findings.meaningAnomalies.length}`);
console.log(`5. Issues in wordLookup: ${findings.wordLookupIssues.length}`);

fs.writeFileSync(path.join(__dirname, 'audit_report.json'), JSON.stringify(findings, null, 2), 'utf8');
console.log('\nWrote full findings to scripts/audit_report.json');
