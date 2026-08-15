# Daily Life Stories Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 16 new high-quality, practical daily life interactive stories (4 each for A1, A2, B1, and B2) to `src/data/stories.json` with extended reading durations (+2 mins per level) and 100% interactive word lookup compatibility.

**Architecture:** Structured JSON dataset (`src/data/stories.json`) integrating with `StoryReader.jsx`, `StorySelection.jsx`, `wordLookup.js`, and Web Speech API narrator.

---

## Story Specifications & Schema

Each story must strictly implement the schema:
```json
{
  "id": "story-<level>-<number>",
  "title": "English Title",
  "titleThai": "ชื่อเรื่องภาษาไทย",
  "genre": "Daily Life",
  "level": "A1" | "A2" | "B1" | "B2",
  "readTime": "3 mins" | "4 mins" | "5 mins" | "6 mins",
  "content": "English text...",
  "contentThai": "เนื้อเรื่องแปลภาษาไทย..."
}
```

---

## Task Breakdown

### Task 1: Generate & Append 16 New Daily Life Stories
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Draft Level A1 Stories (4 stories, 3 mins duration, ~180-230 words each)**
  1. `story-a1-9`: Cooking Dinner at Home (หนึ่งมื้อค่ำทำเองที่บ้าน)
  2. `story-a1-10`: A Visit to the Doctor (ไปพบแพทย์ที่คลินิก)
  3. `story-a1-11`: Doing the Laundry and Weekend Chores (ซักผ้าและทำงานบ้านวันหยุด)
  4. `story-a1-12`: Weekend Market Shopping (เดินช้อปปิ้งตลาดนัดวันหยุด)

- [ ] **Step 2: Draft Level A2 Stories (4 stories, 4 mins duration, ~260-330 words each)**
  5. `story-a2-9`: Renting a New Apartment (การเช่าอพาร์ตเมนต์ห้องใหม่)
  6. `story-a2-10`: Planning a Weekend Road Trip (วางแผนขับรถเที่ยวต่างจังหวัด)
  7. `story-a2-11`: Dining at a Busy Italian Restaurant (รับประทานอาหารที่ร้านอิตาเลียนยอดนิยม)
  8. `story-a2-12`: Returning an Item at the Department Store (เปลี่ยนคืนสินค้าที่ห้างสรรพสินค้า)

- [ ] **Step 3: Draft Level B1 Stories (4 stories, 5 mins duration, ~350-430 words each)**
  9. `story-b1-9`: Managing a Monthly Budget and Savings (การวางแผนการเงินและงบประมาณรายเดือน)
  10. `story-b1-10`: Resolving a Customer Support Dispute (การแก้ปัญหาการบริการและติดตามพัสดุ)
  11. `story-b1-11`: Preparing for an Important Job Interview (การเตรียมตัวสัมภาษณ์งานตำแหน่งสำคัญ)
  12. `story-b1-12`: Building a Balanced Daily Routine (การสร้างกิจวัตรเพื่อสุขภาพและสมดุลชีวิต)

- [ ] **Step 4: Draft Level B2 Stories (4 stories, 6 mins duration, ~440-530 words each)**
  13. `story-b2-8`: Negotiating a Flexible Remote Work Agreement (การเจรจาต่อรองสัญญาทำงานแบบ Remote)
  14. `story-b2-9`: Navigating Urban Transit Modernization (การปรับตัวกับระบบคมนาคมและขนส่งสาธารณะยุคใหม่)
  15. `story-b2-10`: Embracing a Sustainable Zero-Waste Lifestyle (วิถีชีวิตเพื่อความยั่งยืนและการลดขยะในครัวเรือน)
  16. `story-b2-11`: Handling Airline Disruptions and Compensation (การรับมือเที่ยวบินล่าช้าและการเรียกร้องสิทธิประโยชน์)

### Task 2: Vocabulary Verification & Word Lookup Validation
**Files:**
- Test/Verify: `scripts/verify_stories_thai.cjs`
- Test/Verify: `scripts/deep_audit.cjs`

- [ ] **Step 1: Run story verification script to validate all 47 stories have matching schema and complete Thai translations**
- [ ] **Step 2: Verify all story words against `wordLookup.js` for seamless word clicking in StoryReader**

### Task 3: Build Verification & Quality Assurance
**Files:**
- Build: `npm run build`

- [ ] **Step 1: Run `npm run build` to confirm Vite production bundle compiles cleanly**
- [ ] **Step 2: Create walkthrough artifact**
