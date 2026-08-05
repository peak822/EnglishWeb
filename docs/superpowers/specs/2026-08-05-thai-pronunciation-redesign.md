# Thai Pronunciation System Redesign & Dataset Enhancement

**Date:** 2026-08-05  
**Topic:** Rebuilding Thai phonetic pronunciation for English Study Web dataset (6,510 words)

---

## 1. Context & Motivation

The `English Study Web` application contains 6,510 vocabulary entries in `src/data/vocabulary.json` and lookup helpers in `src/utils/wordLookup.js`. 

Analysis of the current `thai_pronunciation` field revealed:
- **3,393 words** contain Latin/English letters (e.g. `abolish` -> `abolish`, `abortion` -> `aborชัน`, `absence` -> `absเอินส์`).
- **1,270+ words** contain unreadable character-by-character transliterations with invalid vowel sequencing (e.g. `abandon` -> `เออะบแอนดเออะน`, `ability` -> `เออะบอิลเออะทอี`, `able` -> `เอยบเออะล`).
- Inconsistent spacing and punctuation (e.g. `about` -> `เออะ บ๊าว ถึ`, `above` -> `เออะ บ๊ะ ฝึ`).

The goal is to rebuild and replace all `thai_pronunciation` entries with natural, easy-to-read, hyphen-separated Thai phonetic transcriptions (`อะ-แบน-เดิน`, `เอ-เบิล`, `แอค-เคอะ-เดม-มิก`).

---

## 2. Technical Architecture & Phonetic Rules

### 2.1 Processing Pipeline
1. **Curated Exception Lexicon**: Exact matches for irregular words, loan words, silent letters, and specialized terms (e.g. `recipe` -> `เรส-เซอะ-พี`, `colonel` -> `เคอร์-เนิล`, `subtle` -> `ซัท-เทิล`).
2. **IPA / Syllable G2P Engine**:
   - Parses the English word and standard IPA into phoneme syllables.
   - Converts English onset, nucleus, and coda into natural Thai graphemes.
   - Applies Thai syllable joining rules (e.g. initial `ə-` -> `อะ-`, suffix `-tion` -> `-ชัน`, suffix `-ble` -> `-เบิล`, suffix `-ment` -> `-เมินท์`).
   - Inserts syllable delimiters (`-`) between distinct syllables.
3. **Punctuation & Diacritic Normalization**:
   - Uses Thai tone/cancellation diacritics appropriately (e.g. `การันต์` for end-coda consonants like `-ส์`, `-ท์`, `-ด์`).
4. **Validation & Quality Assurance Filter**:
   - Rejects any output containing Latin characters `[a-zA-Z]`.
   - Checks for valid Thai vowel placements.
   - Verifies 100% completion across all 6,510 vocabulary entries.

---

## 3. Scope of File Modifications

1. `scripts/generate_thai_pronunciations.cjs` [NEW]:
   - Standalone processing script containing the full phonetic transcription engine, exception dictionary, and batch runner.
2. `src/data/vocabulary.json` [MODIFY]:
   - Update `thai_pronunciation` field across all 6,510 entries.
3. `src/utils/wordLookup.js` [MODIFY]:
   - Update custom lookup dictionary entries to match the unified hyphenated phonetic convention.

---

## 4. Verification Plan

### Automated Verification
- Script validation run on `src/data/vocabulary.json`:
  - English letters count: **0**
  - Empty pronunciations: **0**
  - Proper hyphenation format verified across random slices.
- `npm run test` or data integrity check script to ensure zero JSON parsing errors.

### Manual Verification
- Verify display in UI:
  - **Read Mode** (`src/pages/ReadMode.jsx`)
  - **Story Reader Mode** (`src/pages/StoryReader.jsx`)
  - **Typing Mode** (`src/pages/TypingMode.jsx`)
  - **Guess Mode** (`src/pages/GuessMode.jsx`)
