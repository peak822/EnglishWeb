# Daily Life Stories Expansion (A1–B2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 12 high-quality, practical everyday life stories (3 each for A1, A2, B1, and B2) to `src/data/stories.json`, complete with accurate English content, CEFR-aligned vocabulary, and natural Thai translations.

**Architecture:** Extend the JSON dataset in `src/data/stories.json` with 12 new items following the standard story schema. Validate structure, level distributions, and syntax using a dedicated verification script `scripts/verify_stories.cjs`, followed by standard Vite application build checks.

**Tech Stack:** JavaScript, JSON, Node.js, Vite

## Global Constraints
- Every story MUST have: `id`, `title`, `titleThai`, `genre: "Daily Life"`, `level` (`A1`|`A2`|`B1`|`B2`), `readTime`, `content`, and `contentThai`.
- JSON must be strictly valid.
- No broken punctuation or missing fields.

---

### Task 1: Create Story Validation Script

**Files:**
- Create: `scripts/verify_stories.cjs`

**Interfaces:**
- Produces: `verify_stories.cjs` CLI script that exits with code 0 on success, code 1 on errors.

- [ ] **Step 1: Write `scripts/verify_stories.cjs`**

```javascript
const fs = require('fs');
const path = require('path');

const storiesPath = path.join(__dirname, '../src/data/stories.json');
const rawData = fs.readFileSync(storiesPath, 'utf8');
let stories;

try {
  stories = JSON.parse(rawData);
} catch (err) {
  console.error('❌ JSON Parsing Error:', err.message);
  process.exit(1);
}

console.log(`=== Stories Verification Report ===`);
console.log(`Total stories: ${stories.length}`);

const requiredFields = ['id', 'title', 'titleThai', 'genre', 'level', 'readTime', 'content', 'contentThai'];
const levels = { A1: 0, A2: 0, B1: 0, B2: 0 };
let errors = 0;
const ids = new Set();

stories.forEach((story, idx) => {
  for (const field of requiredFields) {
    if (!story[field] || typeof story[field] !== 'string' || story[field].trim() === '') {
      console.error(`❌ Story #${idx + 1} (${story.id || 'NO_ID'}) missing or empty field: ${field}`);
      errors++;
    }
  }
  if (ids.has(story.id)) {
    console.error(`❌ Duplicate ID: ${story.id}`);
    errors++;
  }
  ids.add(story.id);

  if (levels[story.level] !== undefined) {
    levels[story.level]++;
  } else {
    console.error(`❌ Unknown level "${story.level}" in story ${story.id}`);
    errors++;
  }
});

console.log('Distribution by Level:', levels);

if (errors > 0) {
  console.error(`❌ Verification failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`🎉 All ${stories.length} stories are valid and well-formed!`);
  process.exit(0);
}
```

- [ ] **Step 2: Run script to verify existing baseline**

Run: `node scripts/verify_stories.cjs`
Expected: Output showing existing 19 stories pass validation.

- [ ] **Step 3: Commit Task 1**

```bash
git add scripts/verify_stories.cjs
git commit -m "test: add story dataset verification script"
```

---

### Task 2: Add 3 Everyday Life Stories for Level A1

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Appends: `story-a1-6`, `story-a1-7`, `story-a1-8`

- [ ] **Step 1: Append A1 stories to `src/data/stories.json`**
Add:
- `story-a1-6` ("Ordering at a Cafe" / "สั่งอาหารที่คาเฟ่")
- `story-a1-7` ("Asking for Directions" / "การถามทาง")
- `story-a1-8` ("At the Pharmacy" / "ที่ร้านขายยา")

- [ ] **Step 2: Verify with script**

Run: `node scripts/verify_stories.cjs`
Expected: A1 count increases by 3 (from 5 to 8). Total 22 stories.

- [ ] **Step 3: Commit Task 2**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 3 everyday life stories for Level A1"
```

---

### Task 3: Add 3 Everyday Life Stories for Level A2

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Appends: `story-a2-6`, `story-a2-7`, `story-a2-8`

- [ ] **Step 1: Append A2 stories to `src/data/stories.json`**
Add:
- `story-a2-6` ("Checking In at a Hotel" / "เช็คอินที่โรงแรม")
- `story-a2-7` ("Returning a Store Item" / "คืนสินค้าที่ร้านค้า")
- `story-a2-8` ("Booking a Doctor's Appointment" / "นัดหมายแพทย์")

- [ ] **Step 2: Verify with script**

Run: `node scripts/verify_stories.cjs`
Expected: A2 count increases by 3 (from 5 to 8). Total 25 stories.

- [ ] **Step 3: Commit Task 3**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 3 everyday life stories for Level A2"
```

---

### Task 4: Add 3 Everyday Life Stories for Level B1

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Appends: `story-b1-6`, `story-b1-7`, `story-b1-8`

- [ ] **Step 1: Append B1 stories to `src/data/stories.json`**
Add:
- `story-b1-6` ("Dealing with Customer Service" / "การติดต่อฝ่ายบริการลูกค้า")
- `story-b1-7` ("A Job Interview Experience" / "ประสบการณ์การสัมภาษณ์งาน")
- `story-b1-8` ("Finding and Renting an Apartment" / "การหาและเช่าอพาร์ตเมนต์")

- [ ] **Step 2: Verify with script**

Run: `node scripts/verify_stories.cjs`
Expected: B1 count increases by 3 (from 5 to 8). Total 28 stories.

- [ ] **Step 3: Commit Task 4**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 3 everyday life stories for Level B1"
```

---

### Task 5: Add 3 Everyday Life Stories for Level B2

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Appends: `story-b2-5`, `story-b2-6`, `story-b2-7`

- [ ] **Step 1: Append B2 stories to `src/data/stories.json`**
Add:
- `story-b2-5` ("Negotiating a Project Deadline" / "การเจรจาต่อรองกำหนดส่งงาน")
- `story-b2-6` ("Resolving a Roommate Dispute" / "การปรับความเข้าใจและการอยู่ร่วมกัน")
- `story-b2-7` ("Handling Flight Delays & Airline Compensation" / "การรับมือเที่ยวบินล่าช้าและการเรียกร้องค่าชดเชย")

- [ ] **Step 2: Verify with script**

Run: `node scripts/verify_stories.cjs`
Expected: B2 count increases by 3 (from 4 to 7). Total 31 stories.

- [ ] **Step 3: Commit Task 5**

```bash
git add src/data/stories.json
git commit -m "feat(stories): add 3 everyday life stories for Level B2"
```

---

### Task 6: Full Validation & Walkthrough

**Files:**
- Test: `scripts/verify_stories.cjs`
- Output: `walkthrough.md`

- [ ] **Step 1: Run complete verification suite**

Run: `node scripts/verify_stories.cjs`
Expected: 31 stories total (A1: 8, A2: 8, B1: 8, B2: 7), 0 errors.

- [ ] **Step 2: Run application build**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 3: Update `walkthrough.md`**
Summarize new stories added, distribution by level, and validation outputs.
