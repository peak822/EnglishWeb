# Home Page Categorization Refactor

## Overview
The Home page currently mixes learning modes and game modes within the "Difficulty" sections (Starter, Intermediate, Advanced). As we introduce more non-game learning materials (like Read Mode and POS Guide), this creates a confusing user experience.

This design refactors the Home page layout into a "Library + Progression" model. Pure learning modes are separated into a dedicated "Library" section at the top, while the gamified practice modes remain categorized by difficulty progression below it.

## Categories & Layout

### 1. 📖 The Library (คลังความรู้)
*Description: แหล่งเรียนรู้และค้นคว้าข้อมูลก่อนเริ่มเล่นเกม*
This section sits immediately below the Hero header. It uses a distinct styling (perhaps a slightly different border color or ambient glow) to separate it from the games.
**Modes Included:**
- `read`: "อ่านคำศัพท์"
- `pos-guide`: "เรียนรู้ Part of Speech"

### 2. 🌱 Starter Games (เกมระดับเริ่มต้น)
*Description: เรียนรู้และจดจำ*
**Modes Included:**
- `guess`: "ทายคำศัพท์"
- `match`: "เกมจับคู่"
- `pos`: "หมวดหมู่คำ (Rapid Fire POS)"

### 3. 🚀 Intermediate Games (เกมระดับกลาง)
*Description: ทบทวนและทำความเข้าใจ*
**Modes Included:**
- `assemble`: "ประกอบคำศัพท์"
- `swipe`: "โหมดปัดซ้ายขวา"
- `context`: "โหมดเติมคำ"

### 4. 🔥 Advanced Games (เกมระดับท้าทาย)
*Description: ท้าทายความแม่นยำ*
**Modes Included:**
- `typing`: "พิมพ์คำศัพท์"
- `syntax`: "เรียงประโยค"

## Implementation Details
**Target File:** `src/pages/Home.jsx`
1. Re-organize the data arrays into `libraryModes`, `starterModes`, `intermediateModes`, and `advancedModes`.
2. Update the `renderModeGrid` implementation if necessary to handle any specific library styling, though reusing the existing grid is preferred for consistency.
3. Add a new section block in the JSX for `The Library` right above `Starter Games`, using a book icon 📖 for the section header.

## Impact
No new pages are created, and no routing changes are required. The changes are strictly structural within `Home.jsx`.
