# Story & Level Selection UI Redesign Spec

## 1. Goal & Background
Improve the visual aesthetics, readability, and user experience of the **Level Selection** and **Story Selection** screens in `StorySelection.jsx`. The current UI features oversized, single-column block cards with heavy fonts and missing Thai translations on story cards. The redesign transforms both views into a premium Cyber-Glass Grid layout with responsive columns, level-specific color accents, dual-language typography, and quick level switcher navigation.

---

## 2. UI/UX Specifications

### 2.1 Level Selection View (`!selectedLevel`)
- **Container Layout:** Responsive 2x2 grid on desktop/tablet (`grid grid-cols-1 sm:grid-cols-2 gap-6`), single column on mobile.
- **Card Content & Elements:**
  - Level Icon inside a glowing circular badge:
    - **A1 Beginner:** Icon `Sparkles`, Accent `#4ade80` (Emerald Green)
    - **A2 Elementary:** Icon `BookOpen`, Accent `#2dd4bf` (Teal)
    - **B1 Intermediate:** Icon `Award`, Accent `#38bdf8` (Sky/Neon Blue)
    - **B2 Upper Intermediate:** Icon `Zap`, Accent `#c084fc` (Neon Violet)
  - Level Code & English Title (e.g. `A1 Beginner`, `B1 Intermediate`)
  - Thai Subtitle (e.g. `ระดับเริ่มต้น`, `ระดับต้น`, `ระดับกลาง`, `ระดับกลางสูง`)
  - Brief description of the CEFR tier (e.g. `ประโยคสั้น ศัพท์พื้นฐานในชีวิตประจำวัน`)
  - Story count pill badge (dynamically calculated from `stories.json`, e.g. `8 บทความ`)
  - "เลือกหมวดนี้ • Select Level →" action prompt with subtle hover slide animation.
- **Styling & Effects:**
  - Glassmorphic dark surface (`rgba(10, 15, 30, 0.75)` with `backdrop-filter: blur(12px)`)
  - 1px border with level-specific glow on hover (`box-shadow: 0 0 20px <color>33`)
  - Smooth transform hover lift (`translateY(-4px)`).

---

### 2.2 Story Selection View (`selectedLevel`)
- **Top Control Bar:**
  - **Back Button:** "← กลับไปเลือกระดับ (Back to Levels)" positioned conveniently at the top left.
  - **Quick Level Switcher:** Horizontal pill tabs for `A1`, `A2`, `B1`, `B2` allowing users to jump between levels without returning to the main menu.
  - **Active Level Summary:** Showing current level badge, title, and total story count.
- **Story Cards Grid:**
  - Responsive multi-column layout (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - **Card Header:**
    - Genre badge (`Daily Life`) in neon cyan pill.
    - Level badge (`A1`, `A2`, `B1`, `B2`) with level-matching background.
  - **Card Body (Dual-Language Titles):**
    - English Title (`story.title`): Clean, legible font (`font-semibold text-lg text-white`).
    - Thai Title (`story.titleThai`): Secondary subtitle in soft cyan/purple (`text-sm text-cyan-200/80 mt-1`).
  - **Card Footer:**
    - Read Time icon (`Clock`) + `story.readTime`.
    - Action indicator: "อ่านบทความ • Read →" which brightens and slides on card hover.
- **Empty State:**
  - Informative message if no stories are found for a selected level.

---

## 3. Technical Changes & Architecture

### Files Affected:
1. `src/pages/StorySelection.jsx`
   - Refactor level categories to include Thai descriptions and icons.
   - Implement dynamic story counter per level.
   - Implement top navigation with Quick Level Switcher.
   - Upgrade story card render template with dual-language support (`title` + `titleThai`) and modern responsive grid.
2. `src/index.css` (or inline scoped classes)
   - Add specialized Cyber-Glass styles and level-glow utility classes if needed for seamless responsiveness.

---

## 4. Verification Plan
1. **Visual Testing in Browser:**
   - Verify 2x2 Level Selection grid with glowing cards, Thai descriptions, and story counts.
   - Verify 3-column Story Selection grid showing English + Thai titles, genre, and read times.
   - Test quick level switching pills and back navigation.
2. **Build Verification:**
   - Execute `npm run build` to ensure 0 build errors.
