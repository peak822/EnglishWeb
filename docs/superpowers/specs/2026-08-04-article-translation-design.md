# Design Specification: Article Translation and Comprehension Feature (ฟีเจอร์แปลบทความภาษาไทย)

## 1. Overview
This feature adds an interactive Thai translation mechanism and full-story audio narration to the Short Story Reading module (`/story-mode/:id`), enhancing English reading comprehension, self-checking, and learner motivation.

## 2. Core Requirements & User Flow
1. **Interactive Reading**: Learners read English stories with word-by-word tap lookup (existing functionality).
2. **Full Audio Narration (Read Aloud)**:
   - Learners can click "ฟังเสียงทั้งบทความ (Read Aloud)" to listen to the entire passage with play/stop controls.
3. **Bottom Action Bar**:
   - Placed directly under the English story card.
   - **Translate Button ("🇹🇭 แปลบทความ / ดูคำแปลภาษาไทย")**: Smoothly toggles an expandable Thai translation card.
   - **Finish Reading Button ("✅ อ่านจบแล้ว (+20 EXP)")**: Gives +20 EXP reward with celebratory confetti and marks reading session complete.
4. **Expandable Thai Translation Card**:
   - Shows the Thai title (`titleThai`) and fluent Thai translation (`contentThai`).
   - Styled with cyberpunk/neon glassmorphism matching the design system.

## 3. Data Schema Changes (`src/data/stories.json`)
Each story in `stories.json` will be extended with:
- `titleThai` (string): Natural Thai translation of the title.
- `contentThai` (string): Natural, fluent Thai translation of the whole passage.

All 15 existing stories across CEFR levels A1, A2, B1, and B2 will be populated with accurate, high-quality Thai translations.

## 4. UI/UX & Component Architecture (`src/pages/StoryReader.jsx`)
- **Header Section**:
  - Add Full Story Audio Play/Stop Button with animated speaker icon and timer/status.
- **English Passage Card**:
  - Unchanged interactive token-level word click lookup.
- **Reading Controls Container**:
  - Glassmorphic card containing action buttons with vibrant gradient hover states.
- **Thai Translation Card**:
  - Smooth collapse/expand transition (`opacity`, `max-height`, or conditionally animated container).
  - High-contrast typography with relaxed leading for Thai reading comfort.

## 5. Gamification Integration (`src/hooks/useGamification.js`)
- Reuses `addExp(20)` from `useGamification`.
- State to track if current story has been marked completed in this session to prevent repeated instant EXP farming (disables or shows completed state).

## 6. Testing & Verification Plan
- Verify that every story in `stories.json` has `titleThai` and `contentThai`.
- Verify toggle button smoothly reveals and hides the Thai translation.
- Verify Read Aloud audio plays and cancels properly without conflicting with individual word audio.
- Verify EXP is awarded correctly when clicking "อ่านจบแล้ว".
- Verify responsiveness on mobile, tablet, and desktop views.
