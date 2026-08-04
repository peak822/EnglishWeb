# Oxford 5000 Vocabulary Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand vocabulary dataset from ~2,996 words to 5,000+ words covering Oxford 5000 (including CEFR B2+ and C1 Advanced) with complete phonetic, Part of Speech, and Thai definitions.

**Architecture:** Build automated enrichment & validation pipeline scripts in `scripts/`, generate and validate `src/data/vocabulary.json` with 5,000+ entries, update UI references in `Home.jsx` and `ReadMode.jsx`, and verify all game/reading modes.

**Tech Stack:** Node.js, JavaScript, React 19, Vite

## Global Constraints
- Target total words: ≥ 5,000 entries.
- Every entry MUST contain `id`, `word`, `type`, `level`, `ipa`, `meaning`, and `thai_pronunciation`.
- No empty strings, `?`, or undefined fields in `meaning` or `thai_pronunciation`.
- Existing word IDs (1–2996) and word meanings must be preserved.

---

### Task 1: Create Oxford 5000 Dataset Builder & Verification Scripts

**Files:**
- Create: `scripts/build_oxford_5000.cjs`
- Create: `scripts/verify_oxford_5000.cjs`

**Interfaces:**
- Consumes: `src/data/vocabulary.json` (existing 2,996 words)
- Produces: `scripts/verify_oxford_5000.cjs` returning exit code 0 on valid 5,000+ dataset

- [ ] **Step 1: Write `scripts/verify_oxford_5000.cjs` (failing test)**

```javascript
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
```

- [ ] **Step 2: Run verification script to confirm fail**

Run: `node scripts/verify_oxford_5000.cjs`
Expected: FAIL (Dataset has only 2996 words, expected >= 5000)

- [ ] **Step 3: Write `scripts/build_oxford_5000.cjs`**

Script that incorporates the curated Oxford 5000 word list (B2 & C1 advanced vocabulary), formats phonetics, Thai meanings, and Thai pronunciations, and merges with existing entries to reach 5,000+ words.

- [ ] **Step 4: Run build script to generate expanded dataset**

Run: `node scripts/build_oxford_5000.cjs`
Expected: Successfully generates 5,000+ words into `src/data/vocabulary.json`.

- [ ] **Step 5: Run verification script to confirm pass**

Run: `node scripts/verify_oxford_5000.cjs`
Expected: PASS (0 errors, total words >= 5000).

- [ ] **Step 6: Commit**

```bash
git add scripts/build_oxford_5000.cjs scripts/verify_oxford_5000.cjs src/data/vocabulary.json
git commit -m "feat(data): expand vocabulary dataset to Oxford 5000 with C1 advanced words"
```

---

### Task 2: Update UI Labels & Descriptions to Oxford 5000

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/ReadMode.jsx`

- [ ] **Step 1: Update `src/pages/Home.jsx`**
  - Change "คลังคำศัพท์ Oxford 3000" to "คลังคำศัพท์ Oxford 5000 (A1 - C1)"
  - Change description from "3,000 คำหลัก" to "5,000 คำหลักที่จำเป็นและครอบคลุมที่สุด พร้อมคำแปลและระดับความยาก A1-C1"

- [ ] **Step 2: Update `src/pages/ReadMode.jsx`**
  - Update header and subtitles to reflect Oxford 5000.

- [ ] **Step 3: Run build to verify compilation**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/pages/ReadMode.jsx
git commit -m "feat(ui): update vocabulary references to Oxford 5000"
```

---

### Task 3: Comprehensive Verification & Game Mode Smoke Testing

**Files:**
- Test all game modes and wordLookup utility

- [ ] **Step 1: Run vocabulary integrity check**
Run: `node scripts/verify_oxford_5000.cjs`
Expected: 100% PASS with 0 errors.

- [ ] **Step 2: Run story words resolution test**
Run: `node scripts/verify_all_story_words.cjs`
Expected: 100% PASS.

- [ ] **Step 3: Run production build**
Run: `npm run build`
Expected: Success.
