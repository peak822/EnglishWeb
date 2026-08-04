# Article Translation and Comprehension Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive Thai translation display, full-story read aloud narration, and gamification EXP rewards to the Short Story Reading module.

**Architecture:** Extend story data schema in `src/data/stories.json` with `titleThai` and `contentThai`, update `src/pages/StoryReader.jsx` with an action bar, collapsible Thai translation card, audio narration manager, and EXP completion handler.

**Tech Stack:** React 18, Tailwind CSS / Vanilla CSS design tokens, Lucide React icons, Web Speech Synthesis API, Canvas Confetti.

## Global Constraints
- React 18 single-page application built with Vite.
- Responsive design for both desktop and mobile screens.
- Keep individual word lookup modal functionality fully operational without z-index or event conflicts.

---

### Task 1: Update `stories.json` with Complete Thai Translations

**Files:**
- Modify: `src/data/stories.json`
- Create: `scripts/verify_stories_thai.cjs`

**Interfaces:**
- Consumes: Existing 15 story objects in `stories.json`
- Produces: Story objects containing `id`, `title`, `titleThai`, `genre`, `level`, `readTime`, `content`, `contentThai`

- [ ] **Step 1: Write verification script `scripts/verify_stories_thai.cjs`**

```javascript
const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

console.log(`Checking ${stories.length} stories...`);

let hasError = false;
stories.forEach((story, idx) => {
  if (!story.titleThai || typeof story.titleThai !== 'string' || story.titleThai.trim() === '') {
    console.error(`Error: Story #${idx + 1} (${story.id}) missing titleThai`);
    hasError = true;
  }
  if (!story.contentThai || typeof story.contentThai !== 'string' || story.contentThai.trim() === '') {
    console.error(`Error: Story #${idx + 1} (${story.id}) missing contentThai`);
    hasError = true;
  }
});

if (hasError) {
  console.error('❌ Validation failed.');
  process.exit(1);
} else {
  console.log('✅ All stories have valid titleThai and contentThai translations.');
}
```

- [ ] **Step 2: Run verification script to verify it fails on missing fields**

Run: `node scripts/verify_stories_thai.cjs`
Expected: FAIL with missing titleThai/contentThai.

- [ ] **Step 3: Update `src/data/stories.json` with all 15 Thai translations**

Provide complete, fluent, natural Thai translations for:
1. `story-a1-1` (A Day at the Park -> หนึ่งวันที่สวนสาธารณะ)
2. `story-a2-1` (The Secret Map -> แผนที่ลับ)
3. `story-b1-1` (The First Colony -> อาณานิคมแห่งแรก)
4. `story-a1-2` (Morning Coffee -> กาแฟยามเช้า)
5. `story-a2-2` (The Supermarket Trip -> ไปซื้อของที่ซูเปอร์มาร์เก็ต)
6. `story-b1-2` (A Busy Day at the Office -> วันที่แสนวุ่นวายในออฟฟิศ)
7. `story-b2-1` (Weekend Chores and Relaxation -> งานบ้านวันหยุดและการพักผ่อน)
8. `story-a1-3` (My Pet Cat -> แมวสัตว์เลี้ยงของฉัน)
9. `story-a1-4` (Cooking Dinner -> ทำอาหารเย็น)
10. `story-a1-5` (Going to School -> ไปโรงเรียน)
11. `story-a2-3` (A Visit to the Dentist -> ไปพบทันตแพทย์)
12. `story-a2-4` (Cleaning the House -> ทำความสะอาดบ้าน)
13. `story-a2-5` (Buying New Shoes -> ซื้อรองเท้าคู่ใหม่)
14. `story-b1-3` (Planning a Birthday Party -> วางแผนงานเลี้ยงวันเกิด)
15. `story-b1-4` (A Fitness Routine -> กิจวัตรการออกกำลังกาย)
16. `story-b1-5` (Car Trouble -> ปัญหารถเสีย)
17. `story-b2-2` (Managing Personal Finances -> การจัดการการเงินส่วนบุคคล)
18. `story-b2-3` (A Difficult Conversation -> การพูดคุยที่ยากลำบาก)
19. `story-b2-4` (Adapting to a New Neighborhood -> การปรับตัวเข้ากับย่านใหม่)

- [ ] **Step 4: Run verification script to verify it passes**

Run: `node scripts/verify_stories_thai.cjs`
Expected: PASS with "✅ All stories have valid titleThai and contentThai translations."

- [ ] **Step 5: Commit**

```bash
git add src/data/stories.json scripts/verify_stories_thai.cjs
git commit -m "feat(data): add complete Thai translations for all reading stories"
```

---

### Task 2: Implement UI & Audio & EXP Controls in `StoryReader.jsx`

**Files:**
- Modify: `src/pages/StoryReader.jsx`

**Interfaces:**
- Consumes: `useGamification` hook (`addExp`), `stories.json` (`titleThai`, `contentThai`), `SpeechSynthesisUtterance`
- Produces: StoryReader component with read-aloud playback, bottom translation toggle drawer, and finish reading EXP reward.

- [ ] **Step 1: Implement full-story audio player and state in `StoryReader.jsx`**
  - Add state: `isPlayingFullStory`, `showTranslation`, `isFinished`.
  - Add `toggleFullStoryAudio()` with Web Speech Synthesis API handling (play, pause, cancel).
  - Stop narration when component unmounts or when navigating away.

- [ ] **Step 2: Add header Read Aloud button**
  - Place a button in the header card with speaker icon `Volume2` / `Square` (Stop), displaying "🔊 ฟังเสียงทั้งบทความ (Read Aloud)" / "⏹️ หยุดฟังเสียง".

- [ ] **Step 3: Add Bottom Action Bar & Expandable Thai Translation Card**
  - Add action buttons below the English text card:
    - "🇹🇭 แปลบทความ (Show Translation)" / "ซ่อนคำแปล (Hide Translation)"
    - "✅ อ่านจบแล้ว (+20 EXP)" with animated completion state.
  - Add glassmorphic translation card with smooth animation, displaying `story.titleThai` and `story.contentThai`.

- [ ] **Step 4: Verify build and test component**

Run: `npm run build`
Expected: PASS without errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/StoryReader.jsx
git commit -m "feat(story): implement Thai translation toggle, read aloud narration, and EXP completion"
```
