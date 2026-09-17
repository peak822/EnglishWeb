# Comprehensive System Remediation & Educational Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical quiz logic bugs (multi-POS validation, synonym false negatives, lemmatizer false derivations), repair dataset corruption in 6,510 vocabulary entries (CEFR inflation, unparsed POS strings, missing number types), expand sentence datasets with natural Thai translations and POS metadata, and eliminate SPA-breaking navigations.

**Architecture:** 
- Game and quiz validation engines (`posUtils.js`, `SwipeMode.jsx`, `wordLookup.js`, `ContextMode.jsx`) will be refactored to support multi-class matching, semantic collision prevention, and exception-guarded lemmatization.
- Automated data migration scripts will sanitize `src/data/vocabulary.json` and `src/data/stories.json`.
- `src/data/sentences.json` will be overhauled and expanded to 200+ items with rich grammatical metadata (`targetPOS`, `translationThai`, `level`).
- React Router `useNavigate` will replace legacy hard page reloads across all modes.

**Tech Stack:** React 18, Vite, React Router 6, Web Audio API, Web Speech API, Vanilla CSS.

---

## Phase 1: Critical Game Logic & Educational Repair

### Task 1: Multi-POS Acceptance & Scoring Repair in `POSMode`
**Files:**
- Modify: `src/utils/posUtils.js`
- Modify: `src/pages/POSMode.jsx`

- [ ] **Step 1: Update `posUtils.js` to extract all valid POS tags for a word**
  - Implement `extractAllPOS(rawType)` returning an array of valid mapped POS names (e.g., `["Noun", "Verb"]` for `"n., v."`).
  - Update `generateQuestion(vocabList)` so the question payload includes `validPOSList: string[]` containing all acceptable POS for the word.
  - Ensure distractor options do not duplicate any valid POS in `validPOSList`.

- [ ] **Step 2: Update `POSMode.jsx` validation logic**
  - Change answer check from `selectedPOS === currentQuestion.correctPOS` to `currentQuestion.validPOSList.includes(selectedPOS)`.
  - When correct, display feedback indicating the selected POS is valid (and optionally note if the word can function as multiple parts of speech).

- [ ] **Step 3: Verification Test**
  - Run node verification script testing words like `dance`, `work`, `play`, `run`, `book`, `light` to confirm both `Noun` and `Verb` are accepted as valid answers.

---

### Task 2: Semantic Synonym Collision Prevention in `SwipeMode`
**Files:**
- Modify: `src/pages/SwipeMode.jsx`

- [ ] **Step 1: Fix false-card generator in `SwipeMode.jsx`**
  - In `generateNextCard`, update the false-card selection loop so that `randomWord` is selected ensuring `randomWord.id !== targetWord.id` AND `randomWord.meaning.trim() !== targetWord.meaning.trim()`.
  - Add fallback guard limiting attempts to 25 to prevent infinite loops on edge-case subsets.

- [ ] **Step 2: Verification Test**
  - Run automated card generator simulation over 1,000 iterations to verify that no false card ever displays a definition identical or near-identical to the target word's definition.

---

### Task 3: Lemmatizer `-ly` Guard & Suffix Derivation Fix in `wordLookup.js`
**Files:**
- Modify: `src/utils/wordLookup.js`

- [ ] **Step 1: Add non-derived `-ly` guard in `wordLookup.js`**
  - Define `NON_DERIVED_LY` set containing words like `early`, `only`, `apply`, `reply`, `supply`, `rely`, `daily`, `ugly`, `silly`, `lonely`, `lovely`, `friendly`, `elderly`, `costly`, `orderly`, `lively`, `holy`, `jelly`, `belly`, `alley`, `rally`, `bully`.
  - Prevent rule-based `-ly` stripping from running on any word in `NON_DERIVED_LY` or on words that already exist directly in `vocabMap` or `supplementalDict`.

- [ ] **Step 2: Verification Test**
  - Test lookups for `early`, `only`, `friendly`, `daily`, `lonely`, `costly` to confirm `early` returns "เช้าตรู่ / แต่เช้า" instead of "อย่าง ใบหู".

---

## Phase 2: Vocabulary & Data Integrity Normalization

### Task 4: CEFR Level Restoration & POS String Sanitization
**Files:**
- Modify: `src/data/vocabulary.json`
- Script: `scripts/sanitize_vocabulary_pos_and_cefr.cjs`

- [ ] **Step 1: Create and execute vocabulary sanitation script**
  - Parse all 250 corrupted entries containing CEFR markers in `type` (`/[A-C][1-2]/`).
  - Extract the base CEFR level (e.g., A1 for `book`, `chair`, `address`, `cook`, `bill`, `age`, `close`, `climb`).
  - Clean POS strings to standardized format (`n., v.`, `adj., adv.`, `det., pron., adv.`).
  - Standardize all 144 POS variants across the 6,510 dataset.

- [ ] **Step 2: Verification Test**
  - Verify zero remaining entries matching `/[A-C][1-2]/` in `type` field.
  - Verify `book` is A1, `chair` is A1, `address` is A1.

---

### Task 5: POS Classification for Numbers & Ordinals
**Files:**
- Modify: `src/data/vocabulary.json`

- [ ] **Step 1: Update the 32 `type: "unknown"` number entries**
  - Set cardinal numbers (`zero`, `one` ... `hundred`, `million`) to `type: "number, det., n."`.
  - Set ordinal numbers (`first`, `second`, `fourth`, `fifth`) to `type: "number, adj., adv."`.

- [ ] **Step 2: Verification Test**
  - Confirm `vocab.filter(v => v.type === 'unknown').length === 0`.

---

### Task 6: Broad Phonemic IPA Normalization
**Files:**
- Modify: `src/data/vocabulary.json`
- Modify: `src/utils/wordLookup.js`

- [ ] **Step 1: Convert narrow allophonic IPA symbols to broad phonemic standard**
  - Replace velarized dark L `ɫ` with standard `l`.
  - Replace inverted rhotic `ɹ` with standard `r`.
  - Ensure consistent `/.../` formatting in dictionary rendering.

- [ ] **Step 2: Verification Test**
  - Run verification script to confirm zero instances of `ɫ` or `ɹ` remain in `vocabulary.json` and `wordLookup.js`.

---

## Phase 3: Content Expansion & Sentence Quality

### Task 7: Overhaul & Expansion of `sentences.json`
**Files:**
- Modify: `src/data/sentences.json`

- [ ] **Step 1: Expand `sentences.json` from 40 to 200+ curated items**
  - Include full A1–B2 vocabulary coverage across all letters A–Z.
  - Add fields: `translationThai`, `targetPOS`, `level`, `distractors`.
  - Fix awkward sentences:
    - `"Monkeys love to eat a banana."` $\rightarrow$ `"Monkeys love eating sweet _____ in the jungle."` (word: `bananas`)
    - `"This movie is only for an adult."` $\rightarrow$ `"You must be an _____ to watch this film."` (word: `adult`)

- [ ] **Step 2: Verification Test**
  - Validate JSON schema: all entries have `word`, `sentence` (with exactly one `_____`), `translationThai`, `targetPOS`, `level`.

---

### Task 8: POS-Aware Distractor Filtering in `ContextMode`
**Files:**
- Modify: `src/pages/ContextMode.jsx`

- [ ] **Step 1: Update distractor generator in `ContextMode.jsx`**
  - Filter distractor options by matching `targetPOS` (e.g., prepositions for prepositions, verbs for verbs) from the expanded dataset.
  - Display `translationThai` upon answer completion for clear pedagogical feedback.

- [ ] **Step 2: Verification Test**
  - Test 10 consecutive rounds in ContextMode to confirm distractors are grammatically plausible and challenging.

---

### Task 9: Clean Punctuation Handling in `SyntaxMode`
**Files:**
- Modify: `src/pages/SyntaxMode.jsx`

- [ ] **Step 1: Separate punctuation from word tokens in `SyntaxMode.jsx`**
  - Strip trailing period/question mark when generating scrambled word bank tokens.
  - Display the terminal punctuation outside the slot area or auto-append upon full assembly.
  - Show Thai translation hint/translation toggle to aid sentence construction.

- [ ] **Step 2: Verification Test**
  - Confirm scrambled word blocks no longer give away the ending word with attached punctuation.

---

## Phase 4: UX Polish, Navigation & Metadata Alignment

### Task 10: SPA Client-Side Navigation Fix
**Files:**
- Modify: `src/pages/ContextMode.jsx`
- Modify: `src/pages/ListeningMode.jsx`
- Modify: `src/pages/SyntaxMode.jsx`

- [ ] **Step 1: Replace hard reloads with `useNavigate`**
  - Replace `window.location.href = '/'` with `navigate('/')` across `ContextMode.jsx`, `ListeningMode.jsx`, and `SyntaxMode.jsx`.

- [ ] **Step 2: Verification Test**
  - Verify completing a session transitions smoothly to Home without browser reloading or resetting audio/gamification state.

---

### Task 11: Story Read Time Recalibration in `stories.json`
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Recalculate `readTime` for all 89 stories**
  - Calculate realistic reading time based on word count: `Math.max(1, Math.ceil(wordCount / 85)) + " mins"`.
  - 50–90 words $\rightarrow$ `"1 min"`, 150–250 words $\rightarrow$ `"2-3 mins"`, 350+ words $\rightarrow$ `"4-5 mins"`.

- [ ] **Step 2: Verification Test**
  - Verify `story-a1-1` shows `"1 min"` instead of `"7 mins"`.

---

### Task 12: UI Terminology & Grammar Tip Clarifications
**Files:**
- Modify: `src/pages/ReadMode.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/data/posLessons.js`

- [ ] **Step 1: Update UI headers and mode descriptions**
  - Clarify `ReadMode.jsx` header to "Oxford 5000 Vocab Vault / คลังคำศัพท์ Oxford 5000".
  - Update `Home.jsx` Syntax Mode card to reflect "Sentence Assembler / เรียงประโยคตามไวยากรณ์".
  - Refine `posLessons.js` tips to explicitly mention uncountable nouns, `-ly` adjectives (`friendly`, `lovely`), and subordinating conjunctions (`because`, `although`, `if`).

- [ ] **Step 2: Verification Test**
  - Check UI headers in browser and verify POS guide tips.

---

## Verification Plan

### Automated Verification
```bash
# 1. Verify dataset integrity, POS types, and CEFR tags
node -e "
const v = JSON.parse(require('fs').readFileSync('src/data/vocabulary.json', 'utf8'));
const badTypes = v.filter(x => /[A-C][1-2]/.test(x.type) || x.type === 'unknown');
console.log('Bad types remaining:', badTypes.length);
console.assert(badTypes.length === 0, 'Found remaining bad types!');
"

# 2. Verify sentences.json count and schema
node -e "
const s = JSON.parse(require('fs').readFileSync('src/data/sentences.json', 'utf8'));
console.log('Sentences count:', s.length);
console.assert(s.length >= 200, 'Sentences count is less than 200!');
"

# 3. Run build test
npm run build
```
