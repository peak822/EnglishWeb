# POS Learning Mode — Design Spec

## Overview
A dedicated learning page that teaches users about the 7 main Parts of Speech in English, with explanations in Thai and real example words pulled from the Oxford 3000 vocabulary dataset.

## UI Structure

### Header
- Title: "Part of Speech Guide"
- Subtitle: "เรียนรู้ชนิดของคำในภาษาอังกฤษ พร้อมตัวอย่างจากคลัง Oxford 3000"

### Tab Selector
- Horizontal tab bar with 7 buttons: Noun | Verb | Adjective | Adverb | Preposition | Pronoun | Conjunction
- Active tab has neon glow highlight matching theme
- On mobile: horizontally scrollable with `overflow-x: auto`

### Lesson Content (changes per selected tab)
Each POS tab displays a card with:

1. **POS Name** — e.g. "Noun (คำนาม)"
2. **Definition** — Thai explanation, e.g. "คำที่ใช้เรียกชื่อคน สัตว์ สิ่งของ สถานที่ หรือแนวคิด"
3. **Recognition Tip** — Quick memorization trick, e.g. "ถ้าใส่ a/an/the ข้างหน้าได้ มักจะเป็น Noun"
4. **Example Sentence** — English sentence with the POS word highlighted
5. **Example Words Table** — ~10 words from `vocabulary.json` matching this POS, showing: word, meaning, level, audio button
6. **Total Count** — e.g. "มีคำศัพท์ที่เป็น Noun ทั้งหมด 1,245 คำในคลัง Oxford 3000"

## Data Architecture

### Static Lesson Data (`src/data/posLessons.js`)
Contains per-POS:
- `name`: English name (e.g. "Noun")
- `thaiName`: Thai name (e.g. "คำนาม")
- `abbreviation`: The tag used in vocabulary.json (e.g. "n.")
- `definition`: Thai definition
- `tip`: Thai recognition tip
- `exampleSentence`: English sentence
- `highlightWord`: The word to highlight in the sentence

### Dynamic Data
- Example words are filtered from `vocabulary.json` at runtime using `extractPrimaryPOS()` from `posUtils.js`
- Total count per POS is computed dynamically

## Language
- Headings, POS names, vocabulary words: English
- Definitions, tips, descriptions: Thai

## Navigation
- Route: `/pos-guide`
- Home page card placed in Starter section, next to the existing POS game mode card
- Card title: "เรียนรู้ Part of Speech"

## Styling
- Uses existing project CSS classes (Card component, ui-btn, etc.)
- Inline styles for layout (no Tailwind — project does not use it)
- Tab bar styled with existing theme variables
