# Conversational & Natural Daily Life Story Translations Design Specification

**Author:** Antigravity AI  
**Date:** 2026-08-15  
**Scope:** Comprehensive translation refinement across all 47 interactive stories in `src/data/stories.json`, transforming translations into natural, fluent, conversational Thai suitable for real-world daily speaking and reading comprehension.

---

## 1. Vision & Translation Philosophy

The goal is to provide Thai translations that read as if written and spoken naturally by a native speaker in everyday life, rather than mechanical word-for-word translations.

### Core Translation Principles
1. **Conversational Fluency (ภาษาพูดที่ใช้จริง):**
   - Translate idioms, phrasal verbs, and daily expressions into real-life conversational Thai (e.g. *"jumped straight into"* → *"รีบลุยทันที"*, *"grabbed a bite"* → *"แวะหาอะไรทานรองท้อง"*, *"split the bill"* → *"แยกจ่าย/หารกัน"*).
   - Eliminate stiff literal translations (avoid awkward passive voice like *"ถูกกระทำโดย..."* or repetitive *"มันคือ..."*).
2. **Context-Appropriate Tone (น้ำเสียงเข้ากับบริบท):**
   - **A1-A2 (Casual Daily Life & Warm Stories):** Friendly, warm, relaxed storytelling tone that feels like chatting with a friend.
   - **B1-B2 (Workplace, Finance, Tech & Urban Living):** Professional yet lively conversational tone suitable for modern office communication, negotiations, and lifestyle discussions.
3. **1:1 Structural Alignment:**
   - Align paragraph breaks (`\n\n`) and sentence sequencing cleanly with the English source text for smooth side-by-side reading in `StoryReader.jsx`.
4. **Unique Content Topics:**
   - Differentiate `story-b2-11` into **"Managing a Cross-Cultural Remote Project"** to avoid duplication with `story-b2-7` and introduce practical international workplace vocabulary.

---

## 2. Translation Tone Guidelines by Level

### Level A1 (Beginner — 12 Stories)
- **Focus:** Daily routines, casual chats, food, hobbies, shopping, home chores.
- **Thai Style:** Simple, clear, vibrant, and natural spoken Thai that flows easily.

### Level A2 (Elementary — 12 Stories)
- **Focus:** Travel, renting apartments, dining out, weekend road trips, returns.
- **Thai Style:** Everyday narrative style with natural conversational connectors (*"พอไปถึง...", "เลยตัดสินใจ...", "รู้สึกประทับใจมาก"*).

### Level B1 (Intermediate — 12 Stories)
- **Focus:** Office workplace, monthly budgets, resolving complaints, job interviews, work-life balance.
- **Thai Style:** Modern professional conversational Thai (*"บริหารงบประมาณ", "เตรียมความพร้อม", "รับฟังอย่างตั้งใจ"*).

### Level B2 (Upper Intermediate — 11 Stories)
- **Focus:** Remote work negotiation, smart urban transit, zero-waste living, cross-cultural project management, deep science/adventure.
- **Thai Style:** Sophisticated, expressive, and persuasive conversational Thai suitable for leadership, negotiations, and discussions.

---

## 3. Verification & Quality Assurance
- Automated verification: `scripts/verify_stories_thai.cjs` to confirm 100% schema integrity and non-empty Thai fields.
- Deep audit: `scripts/deep_audit.cjs` and `scripts/verify_story_lookups.py`.
- Build verification: `npm run build` to confirm 0 build errors.
