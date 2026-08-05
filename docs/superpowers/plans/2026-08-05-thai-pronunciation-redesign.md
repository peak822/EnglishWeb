# Thai Pronunciation System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild and clean up the Thai phonetic pronunciation (`thai_pronunciation`) across all 6,510 vocabulary entries in `src/data/vocabulary.json` and sync `src/utils/wordLookup.js` to provide clear, hyphen-separated, natural Thai phonetic reading.

**Architecture:** A standalone hybrid phonetic transcription engine in `scripts/generate_thai_pronunciations.cjs` combining an extensive curated Oxford/CEFR lexicon dictionary, robust IPA syllabifier, and Thai phonetic transliteration rules with hyphens. A verification suite to guarantee zero Latin characters and 100% data coverage.

**Tech Stack:** Node.js (CommonJS), JavaScript, JSON.

## Global Constraints
- Target dataset: `src/data/vocabulary.json` (6,510 entries).
- All Thai pronunciations must use hyphenated syllables (e.g., `อะ-แบน-เดิน`, `เอ-เบิล`, `แอค-เคอะ-เดม-มิก`).
- Zero Latin characters (`[a-zA-Z]`) allowed in `thai_pronunciation`.
- No empty strings allowed in `thai_pronunciation`.
- Preserve existing word IDs, levels, meanings, and English words unchanged.

---

### Task 1: Build the Phonetic Transcription Engine (`scripts/generate_thai_pronunciations.cjs`) with Tests

**Files:**
- Create: `scripts/generate_thai_pronunciations.cjs`
- Create: `scripts/test_thai_pronunciations.cjs`

**Interfaces:**
- Produces: `generateThaiPronunciation(word, ipa)` -> `string`
- Produces: `validatePronunciation(text)` -> `{ valid: boolean, errors: string[] }`

- [ ] **Step 1: Write test cases in `scripts/test_thai_pronunciations.cjs`**

```javascript
const assert = require('assert');
const { generateThaiPronunciation, validatePronunciation } = require('./generate_thai_pronunciations.cjs');

const testCases = [
  { word: 'abandon', expected: 'อะ-แบน-เดิน' },
  { word: 'ability', expected: 'อะ-บิล-ลิ-ที' },
  { word: 'able', expected: 'เอ-เบิล' },
  { word: 'abolish', expected: 'อะ-บอล-ลิช' },
  { word: 'abortion', expected: 'อะ-บอร์-ชัน' },
  { word: 'absence', expected: 'แอ็บ-เซินส์' },
  { word: 'absolute', expected: 'แอ็บ-โซ-ลูท' },
  { word: 'academic', expected: 'แอค-เคอะ-เดม-มิก' },
  { word: 'comfortable', expected: 'คัมฟ์-เทอะ-เบิล' },
  { word: 'recipe', expected: 'เรส-เซอะ-พี' },
  { word: 'subtle', expected: 'ซัท-เทิล' },
  { word: 'Wednesday', expected: 'เวนส์-เดย์' },
  { word: 'about', expected: 'อะ-เบาท์' },
  { word: 'above', expected: 'อะ-บัฟว์' }
];

let failed = 0;
testCases.forEach(({ word, expected }) => {
  const result = generateThaiPronunciation(word);
  const validation = validatePronunciation(result);
  if (result !== expected || !validation.valid) {
    console.error(`FAIL: ${word} -> got "${result}", expected "${expected}"`);
    failed++;
  } else {
    console.log(`PASS: ${word} -> ${result}`);
  }
});

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All phonetic test cases passed successfully!');
}
```

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `node scripts/test_thai_pronunciations.cjs`  
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `scripts/generate_thai_pronunciations.cjs`**

Implement comprehensive lexicon dictionary with 2000+ curated high-frequency/irregular words and algorithmic IPA-to-Thai syllabifier.

- [ ] **Step 4: Run test to verify all cases pass**

Run: `node scripts/test_thai_pronunciations.cjs`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/generate_thai_pronunciations.cjs scripts/test_thai_pronunciations.cjs
git commit -m "feat: add Thai phonetic transcription engine and tests"
```

---

### Task 2: Batch Process `src/data/vocabulary.json` & Automated Validation

**Files:**
- Modify: `src/data/vocabulary.json`
- Create: `scripts/verify_vocabulary_pronunciations.cjs`

- [ ] **Step 1: Write verification script `scripts/verify_vocabulary_pronunciations.cjs`**

```javascript
const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

let englishLetterCount = 0;
let emptyCount = 0;
let invalidFormat = 0;

vocab.forEach(item => {
  const p = item.thai_pronunciation || '';
  if (!p.trim()) emptyCount++;
  if (/[a-zA-Z]/.test(p)) englishLetterCount++;
  if (p.includes('  ') || p.startsWith('-') || p.endsWith('-')) invalidFormat++;
});

console.log('--- Verification Report ---');
console.log('Total entries:', vocab.length);
console.log('Empty pronunciations:', emptyCount);
console.log('Contains English letters:', englishLetterCount);
console.log('Invalid format count:', invalidFormat);

if (emptyCount === 0 && englishLetterCount === 0 && invalidFormat === 0) {
  console.log(' SUCCESS: All vocabulary pronunciations are clean and properly formatted!');
  process.exit(0);
} else {
  console.error(' FAILED: Found quality issues in vocabulary dataset.');
  process.exit(1);
}
```

- [ ] **Step 2: Execute batch generation script across all 6,510 words**

Run: `node scripts/generate_thai_pronunciations.cjs --apply`

- [ ] **Step 3: Run verification script**

Run: `node scripts/verify_vocabulary_pronunciations.cjs`  
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/vocabulary.json scripts/verify_vocabulary_pronunciations.cjs
git commit -m "feat: regenerate and clean Thai pronunciations for all 6,510 vocabulary entries"
```

---

### Task 3: Sync and Update `src/utils/wordLookup.js`

**Files:**
- Modify: `src/utils/wordLookup.js`

- [ ] **Step 1: Update contractions and helper dictionary entries in `src/utils/wordLookup.js` with clean hyphenated Thai phonetics**
- [ ] **Step 2: Run verification to ensure consistency between `vocabulary.json` and `wordLookup.js`**
- [ ] **Step 3: Commit**

```bash
git add src/utils/wordLookup.js
git commit -m "feat: update wordLookup helper pronunciations to unified hyphenated style"
```

---

### Task 4: Full App Verification & Visual Check

**Files:**
- Test: `npm run build`

- [ ] **Step 1: Test production bundle build**

Run: `npm run build`  
Expected: PASS (Zero syntax or build errors)

- [ ] **Step 2: Spot check sample words in UI (ReadMode, StoryReader, TypingMode, GuessMode)**
- [ ] **Step 3: Commit final walkthrough notes**
