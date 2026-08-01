# Home Dashboard & Command Center Design Spec

## 1. Overview & Objective
Redesign the **Home Page (`Home.jsx`)** into an ultra-premium **Cyberpunk Command Center** that combines rich glassmorphism aesthetics, gamified player statistics, spotlight quick-launch cards, and intuitive skill-based categorization.

---

## 2. Key Components & Architecture

### 2.1 Hero Command Dashboard (Top Section)
The top section replaces the plain hero text with a glassmorphic command deck:
1. **Player Status & Rank Hub:**
   - **Level & Rank Badge:** Visual rank titles based on level (e.g. `Lv.1 Code Initiate`, `Lv.3 Cyber Scholar`, `Lv.5 Vocab Master`, `Lv.10 Cyber Overlord`).
   - **EXP Progress Bar:** Glowing cyan progress bar with current vs next level EXP counter.
   - **Daily Streak 🔥:** Dynamic flame indicator with active days counter stored in `localStorage`.
   - **Badges Preview:** Quick showcase of unlocked badges with popover tooltips.
2. **Spotlight Quick Action (Daily Recommendation):**
   - A featured glass card recommending a quick practice (e.g., *⚡ Quick Drill: Rapid Fire POS* or *📖 Short Story of the Day*).
   - "Quick Start" button with glowing neon border.

### 2.2 Skill-Based Mode Categorization (4 Core Domains)
Group all 12 learning modes into 4 clear, skill-based sections with dedicated neon accent badges:

1. 📖 **Reading & Comprehension (ทักษะการอ่านและการทำความเข้าใจ)**
   - `story-mode`: อ่านบทความสั้น (Interactive Short Stories with word lookup)
   - `read`: คลังคำศัพท์ Oxford 3000 (Vocabulary Browser & Flashcards)

2. 🎧 **Listening & Pronunciation (ทักษะการฟังและการออกเสียง)**
   - `listen`: ทายคำจากการฟัง (Listening & Spelling Practice)

3. ⚡ **Vocabulary & Reflexes (คลังคำศัพท์และความจำ)**
   - `match`: เกมจับคู่ (3D Flip Memory Match)
   - `swipe`: โหมดปัดการ์ดความไวสูง (Speed Swipe Reflex)
   - `guess`: ทายคำศัพท์ (Hint-Based Word Guessing)
   - `typing`: พิมพ์คำศัพท์ (Speed Typing & Memory)
   - `assemble`: ประกอบคำศัพท์ (Anagram Letter Assembly)

4. 🧩 **Grammar & Structure (ไวยากรณ์และโครงสร้างประโยค)**
   - `pos`: แยกแยะชนิดของคำ (Rapid Fire POS)
   - `pos-guide`: คู่มือ Part of Speech 7 ชนิด (Comprehensive POS Guide)
   - `syntax`: เรียงประโยคภาษาอังกฤษ (Syntax & Sentence Ordering)
   - `context`: เติมคำในช่องว่าง (Contextual Sentence Completion)

### 2.3 Glassmorphic Mode Card Design System
Each mode card will feature:
- **Glassmorphic Container:** `rgba(10, 16, 32, 0.85)`, `backdrop-filter: blur(16px)`, `border-radius: 18px`.
- **Top Accent Line:** Subtle neon gradient line matching the category color theme.
- **3D Parallax Tilt:** Enhanced with glare effects using `react-parallax-tilt`.
- **Level/Type Tag:** Pill badge indicating difficulty or type (e.g., `⚡ Speed`, `📖 Reading`, `🧠 Logic`).
- **Interactive Action Bar:** "เข้าสู่โหมดฝึก" with animated hover arrow and custom glow on hover.

---

## 3. Styling & CSS Specifications
Add reusable, high-performance CSS classes in `src/index.css`:
- `.home-dashboard-grid`: Responsive 2-column header on desktop (Player Stats + Spotlight Card), single column on mobile.
- `.home-stat-badge`: Capsule status chip with subtle glass background and neon text.
- `.home-category-header`: Category title with glowing icon, Thai subtitle, and mode counter tag.
- `.home-mode-grid`: Responsive auto-fill grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`) with 1rem gap.
- `.home-glass-card`: Premium glass card with spring hover transition and rounded corners.

---

## 4. Verification & Testing
1. Verify responsive design on mobile (360px - 480px), tablet (768px), and desktop (1024px+).
2. Verify all 12 navigation links route to their respective pages correctly.
3. Test EXP progress bar calculation and dynamic rank title changes.
4. Run `npm run build` to ensure zero compilation errors.
