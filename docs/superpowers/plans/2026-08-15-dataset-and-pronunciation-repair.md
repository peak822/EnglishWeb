# Dataset Pronunciation, IPA, Meaning & Sentence ID Repair Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensive repair of all Thai phonetic pronunciations, IPAs, Part of Speech tags, Thai translations, sentence word ID synchronizations, and US/UK spelling variants across the web application.

**Architecture:** Python and Node.js deterministic batch correction pipelines combining rule-based IPA transliteration engines and curated dictionaries to fix ~600+ affected vocabulary items in `src/data/vocabulary.json`, synchronize `src/data/sentences.json`, and update `src/utils/wordLookup.js`.

**Tech Stack:** JavaScript (ESM & CJS), Python 3, Node.js, Vite / React.

---

## Global Constraints

- Preserve all existing 6,510 word IDs and level classifications (A1-C1).
- Maintain 100% clean Thai orthography with zero English/IPA character leakage in `thai_pronunciation`.
- Retain accurate Oxford 3000 / 5000 definitions while ensuring Part of Speech grammatical concordance.
- All 40 exercise sentence `wordId` values in `sentences.json` must map 1:1 to `vocabulary.json`.
- `npm run build` must succeed without errors or broken imports.

---

## Task Breakdown

### Task 1: Complete Vocabulary Pronunciation & IPA Repair
**Files:**
- Modify: `src/data/vocabulary.json`
- Script: `scripts/repair_master_dataset.py`
- Test: `scripts/verify_vocabulary_pronunciations.cjs`

- [ ] **Step 1: Write repair master script for Thai pronunciations, IPAs, and diphthongs**
- [ ] **Step 2: Execute repair master script and verify zero remaining leaks**
- [ ] **Step 3: Run pronunciation verification test script**

### Task 2: Part of Speech & Meaning Corrections
**Files:**
- Modify: `src/data/vocabulary.json`
- Test: `scripts/audit_translations.cjs`

- [ ] **Step 1: Apply semantic and POS corrections for `pivotal`, `-al` nouns, `entertain`, `expertise`, and adjectives with noun definitions**
- [ ] **Step 2: Run translation audit script to verify 0 POS mismatches**

### Task 3: Sentences Synchronization & US/UK Variant Mapping
**Files:**
- Modify: `src/data/sentences.json`
- Modify: `src/utils/wordLookup.js`
- Test: `scripts/check_common_words.cjs`

- [ ] **Step 1: Synchronize all 40 sentence `wordId` entries with `vocabulary.json`**
- [ ] **Step 2: Add US/UK variant aliases (`color`/`colour`, `favorite`/`favourite`, etc.) to `wordLookup.js`**
- [ ] **Step 3: Test lookups and verify sentence integrity**

### Task 4: Full Quality Assurance and Build Verification
**Files:**
- Test: `scripts/deep_audit.cjs`
- Build: `npm run build`

- [ ] **Step 1: Run comprehensive deep audit on all datasets**
- [ ] **Step 2: Run `npm run build` to verify frontend build passes**
