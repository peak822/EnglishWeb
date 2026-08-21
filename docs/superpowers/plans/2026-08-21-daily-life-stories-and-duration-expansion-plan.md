# Daily Life Stories and Duration Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand English Study Web's reading library by 17 new high-utility daily life stories (reaching 16 stories per level, total 64 stories) and update reading durations across all levels by +4 minutes (A1: 7 mins, A2: 8 mins, B1: 9 mins, B2: 10 mins).

**Architecture:** Extend `src/data/stories.json` with bilingual story records structured with natural dialogues, paragraphs, and high-frequency vocabulary. Validate against Oxford 5000 lookup, TTS narration, and UI rendering.

**Tech Stack:** React, JSON, Node.js validation scripts, Web Speech API / Google TTS integration.

## Global Constraints
- Target 16 stories per CEFR level (A1: 16, A2: 16, B1: 16, B2: 16, total 64).
- Reading durations: A1 = `7 mins`, A2 = `8 mins`, B1 = `9 mins`, B2 = `10 mins`.
- Genre: `"Daily Life"`.
- Every story must contain accurate English `content` and natural paragraph-aligned Thai translation `contentThai`.
- No broken JSON syntax or missing keys.

---

### Task 1: Update Reading Durations for Existing Stories

**Files:**
- Modify: `src/data/stories.json`
- Test: `scripts/validate_stories.cjs`

**Interfaces:**
- Consumes: Existing 47 stories in `src/data/stories.json`
- Produces: Updated `readTime` values for all existing A1, A2, B1, B2 stories

- [ ] **Step 1: Write the validation test script `scripts/validate_stories.cjs`**

```javascript
const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf8'));

console.log(`Loaded ${stories.length} stories.`);

const expectedDurations = {
  A1: '7 mins',
  A2: '8 mins',
  B1: '9 mins',
  B2: '10 mins'
};

let errors = [];
stories.forEach((story, idx) => {
  if (!story.id || !story.title || !story.titleThai || !story.content || !story.contentThai) {
    errors.push(`Story #${idx} (${story.id || 'NO_ID'}) is missing required fields.`);
  }
  const levelPrefix = story.level.substring(0, 2);
  const expectedTime = expectedDurations[levelPrefix];
  if (expectedTime && story.readTime !== expectedTime) {
    errors.push(`Story ${story.id} (${story.level}) has readTime "${story.readTime}", expected "${expectedTime}".`);
  }
});

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} errors:\n` + errors.slice(0, 10).join('\n'));
  process.exit(1);
} else {
  console.log('All stories passed duration and structure validation!');
  process.exit(0);
}
```

- [ ] **Step 2: Run validation script to verify it catches old durations**

Run: `node scripts/validate_stories.cjs`
Expected: FAIL with errors stating readTime is 3/4/5/6 mins instead of 7/8/9/10 mins.

- [ ] **Step 3: Update `readTime` for all existing stories in `src/data/stories.json`**

Update:
- A1 stories (1-12) to `"readTime": "7 mins"`
- A2 stories (1-12) to `"readTime": "8 mins"`
- B1 stories (1-12) to `"readTime": "9 mins"`
- B2 stories (1-11) to `"readTime": "10 mins"`

- [ ] **Step 4: Run validation script to verify it passes**

Run: `node scripts/validate_stories.cjs`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/data/stories.json scripts/validate_stories.cjs
git commit -m "feat: update reading durations across all CEFR levels"
```

---

### Task 2: Add 4 New Level A1 Daily Life Stories

**Files:**
- Modify: `src/data/stories.json`
- Test: `scripts/validate_stories.cjs`

**Interfaces:**
- Consumes: `story-a1-13` to `story-a1-16` content data
- Produces: 16 total A1 stories in `src/data/stories.json`

- [ ] **Step 1: Draft the 4 new A1 stories with rich daily life dialogues and Thai translations**

Stories:
1. `story-a1-13`: **Ordering at a Local Café** (การสั่งเครื่องดื่มและขนมที่คาเฟ่)
2. `story-a1-14`: **Going to the Pharmacy** (การไปซื้อยาที่ร้านขายยา)
3. `story-a1-15`: **Taking the Subway and Bus** (การเดินทางด้วยรถไฟฟ้าและรถเมล์)
4. `story-a1-16`: **Asking for Directions in Town** (การถามทางในตัวเมือง)

- [ ] **Step 2: Append the 4 A1 stories to `src/data/stories.json`**
- [ ] **Step 3: Run validation script to verify A1 count and syntax**

Run: `node -e "const s = require('./src/data/stories.json'); console.log('A1 Count:', s.filter(x=>x.level==='A1').length);"`
Expected: `A1 Count: 16`

Run: `node scripts/validate_stories.cjs`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 4 new A1 daily life stories"
```

---

### Task 3: Add 4 New Level A2 Daily Life Stories

**Files:**
- Modify: `src/data/stories.json`
- Test: `scripts/validate_stories.cjs`

**Interfaces:**
- Consumes: `story-a2-13` to `story-a2-16` content data
- Produces: 16 total A2 stories in `src/data/stories.json`

- [ ] **Step 1: Draft the 4 new A2 stories with connected conversational scenarios and Thai translations**

Stories:
1. `story-a2-13`: **Opening a Bank Account** (การเปิดบัญชีธนาคารและทำบัตรเดบิต)
2. `story-a2-14`: **Booking a Hotel Room and Check-in** (การจองห้องพักและเช็คอินโรงแรม)
3. `story-a2-15`: **Visiting a Dentist for a Check-up** (การไปตรวจฟันตามนัดหมาย)
4. `story-a2-16`: **Cooking Dinner with a Friend** (การทำอาหารร่วมกับเพื่อน)

- [ ] **Step 2: Append the 4 A2 stories to `src/data/stories.json`**
- [ ] **Step 3: Run validation script to verify A2 count and syntax**

Run: `node -e "const s = require('./src/data/stories.json'); console.log('A2 Count:', s.filter(x=>x.level==='A2').length);"`
Expected: `A2 Count: 16`

Run: `node scripts/validate_stories.cjs`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 4 new A2 daily life stories"
```

---

### Task 4: Add 4 New Level B1 Daily Life Stories

**Files:**
- Modify: `src/data/stories.json`
- Test: `scripts/validate_stories.cjs`

**Interfaces:**
- Consumes: `story-b1-13` to `story-b1-16` content data
- Produces: 16 total B1 stories in `src/data/stories.json`

- [ ] **Step 1: Draft the 4 new B1 stories with problem-solving/workplace scenarios and Thai translations**

Stories:
1. `story-b1-13`: **Handling an Apartment Maintenance Issue** (การแจ้งซ่อมและประสานงานกับนิติ)
2. `story-b1-14`: **Planning a Team Event at Work** (การจัดกิจกรรมกระชับมิตรในที่ทำงาน)
3. `story-b1-15`: **Reporting Lost Luggage at the Airport** (การแจ้งกระเป๋าหายและติดตามสัมภาระที่สนามบิน)
4. `story-b1-16`: **Dealing with a Car Breakdown and Roadside Assistance** (การรับมือเมื่อรถเสียและติดต่อหน่วยช่วยเหลือฉุกเฉิน)

- [ ] **Step 2: Append the 4 B1 stories to `src/data/stories.json`**
- [ ] **Step 3: Run validation script to verify B1 count and syntax**

Run: `node -e "const s = require('./src/data/stories.json'); console.log('B1 Count:', s.filter(x=>x.level==='B1').length);"`
Expected: `B1 Count: 16`

Run: `node scripts/validate_stories.cjs`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 4 new B1 daily life stories"
```

---

### Task 5: Add 5 New Level B2 Daily Life Stories

**Files:**
- Modify: `src/data/stories.json`
- Test: `scripts/validate_stories.cjs`

**Interfaces:**
- Consumes: `story-b2-12` to `story-b2-16` content data
- Produces: 16 total B2 stories in `src/data/stories.json`

- [ ] **Step 1: Draft the 5 new B2 stories with nuanced negotiation/analytical scenarios and Thai translations**

Stories:
1. `story-b2-12`: **Renewing a Rental Lease and Negotiating Rent** (การเจรจาต่อสัญญาเช่าคอนโดและขอปรับค่าเช่า)
2. `story-b2-13`: **Resolving an E-Commerce Delivery and Refund Dispute** (การระงับข้อพิพาทการคืนเงินและเคลมสินค้าออนไลน์)
3. `story-b2-14`: **Managing Workplace Burnout and Work-Life Integration** (การรับมือกับภาวะหมดไฟและการจัดสมดุลชีวิต)
4. `story-b2-15`: **Adopting Sustainable Home Habits and Energy Efficiency** (การปรับปรุงบ้านเพื่อประหยัดพลังงานและความยั่งยืน)
5. `story-b2-16`: **Organizing a Neighborhood Community Project** (การริเริ่มโครงการพัฒนาชุมชนร่วมกับเพื่อนบ้าน)

- [ ] **Step 2: Append the 5 B2 stories to `src/data/stories.json`**
- [ ] **Step 3: Run validation script to verify B2 count and syntax**

Run: `node -e "const s = require('./src/data/stories.json'); console.log('B2 Count:', s.filter(x=>x.level==='B2').length);"`
Expected: `B2 Count: 16`

Run: `node scripts/validate_stories.cjs`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 5 new B2 daily life stories to complete 16 stories per level"
```

---

### Task 6: Comprehensive Verification & Production Build

**Files:**
- Modify: None
- Test: `scripts/validate_stories.cjs`, `npm run build`

**Interfaces:**
- Consumes: Complete 64-story dataset in `src/data/stories.json`
- Produces: Verified build and runtime readiness

- [ ] **Step 1: Run comprehensive story dataset validator**

Run: `node -e "const s = require('./src/data/stories.json'); console.log('Total:', s.length); const c = {}; s.forEach(x => c[x.level]=(c[x.level]||0)+1); console.log('Distribution:', c);"`
Expected: `Total: 64`, `Distribution: { A1: 16, A2: 16, B1: 16, B2: 16 }`

- [ ] **Step 2: Execute Vite build check**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 3: Commit any remaining artifacts or scripts**

```bash
git add docs/superpowers/plans/2026-08-21-daily-life-stories-and-duration-expansion-plan.md
git commit -m "docs: add implementation plan for daily life stories expansion"
```
