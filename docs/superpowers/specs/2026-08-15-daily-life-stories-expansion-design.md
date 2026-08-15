# Daily Life Stories Expansion Design Specification

**Author:** Antigravity AI  
**Date:** 2026-08-15  
**Scope:** Addition of 16 new high-utility Daily Life stories (4 per level for A1, A2, B1, B2) with extended reading durations (+2 minutes per level) and 100% interactive word lookup compatibility in the English Study Web application.

---

## 1. Overview & Objectives

Expand the interactive reading library from 31 stories to 47 stories by adding 16 new, realistic daily life stories spanning CEFR levels A1 to B2. Each story is tailored to practical real-world situations (cooking, banking, doctor appointments, transit, apartment hunting, workplace negotiations) with extended reading lengths and durations.

---

## 2. Story Specifications & Reading Durations

### 2.1 Reading Duration & Word Count Targets
- **A1 Beginner:** `3 mins` (originally `1 min`, +2 mins added) | Target word count: ~180–230 words. Simple present/past, high-frequency daily vocabulary.
- **A2 Elementary:** `4 mins` (originally `2 mins`, +2 mins added) | Target word count: ~260–330 words. Connected sentences, routine dialogues, common phrasal verbs.
- **B1 Intermediate:** `5 mins` (originally `3 mins`, +2 mins added) | Target word count: ~350–430 words. Multi-paragraph structure, problem solving, workplace & budget situations.
- **B2 Upper Intermediate:** `6 mins` (originally `4 mins`, +2 mins added) | Target word count: ~440–530 words. Analytical, professional negotiation, nuanced descriptive language.

---

## 3. Detailed Story Catalog (16 New Stories)

### Level A1 (4 Stories — 3 mins each)
1. **`story-a1-9`: Cooking Dinner at Home** (หนึ่งมื้อค่ำทำเองที่บ้าน)
   - *Synopsis:* Step-by-step preparation of a warm homemade pasta dish with fresh tomatoes, garlic, and cheese, followed by cleaning the kitchen.
2. **`story-a1-10`: A Visit to the Doctor** (ไปพบแพทย์ที่คลินิก)
   - *Synopsis:* Visiting a neighborhood clinic for a cold and headache, describing symptoms to the doctor, and getting medication with instructions.
3. **`story-a1-11`: Doing the Laundry and Weekend Chores** (ซักผ้าและทำงานบ้านวันหยุด)
   - *Synopsis:* Sorting white and colored clothes, running the washing machine, hanging laundry in the sun, and tidying up the bedroom.
4. **`story-a1-12`: Weekend Market Shopping** (เดินช้อปปิ้งตลาดนัดวันหยุด)
   - *Synopsis:* Strolling through a bustling weekend market, buying fresh fruit, bakery bread, and ordering iced lemon tea.

### Level A2 (4 Stories — 4 mins each)
5. **`story-a2-9`: Renting a New Apartment** (การเช่าอพาร์ตเมนต์ห้องใหม่)
   - *Synopsis:* Meeting the real estate agent to tour a modern one-bedroom flat, checking amenities, asking about utility bills, and signing the lease.
6. **`story-a2-10`: Planning a Weekend Road Trip** (วางแผนขับรถเที่ยวต่างจังหวัด)
   - *Synopsis:* Preparing a car road trip with friends to the mountains, checking tire pressure, packing essentials, and booking a cozy countryside cabin.
7. **`story-a2-11`: Dining at a Busy Italian Restaurant** (รับประทานอาหารที่ร้านอิตาเลียนยอดนิยม)
   - *Synopsis:* Arriving at a lively bistro, asking the waiter for menu recommendations, ordering handmade pizza and salad, and splitting the bill.
8. **`story-a2-12`: Returning an Item at the Department Store** (เปลี่ยนคืนสินค้าที่ห้างสรรพสินค้า)
   - *Synopsis:* Visiting customer service with a receipt to exchange a sweater that was the wrong size, speaking politely with the store staff.

### Level B1 (4 Stories — 5 mins each)
9. **`story-b1-9`: Managing a Monthly Budget and Savings** (การวางแผนการเงินและงบประมาณรายเดือน)
   - *Synopsis:* Reviewing personal bank statements, categorizing essential expenses versus discretionary spending, and setting up an automated emergency savings fund.
10. **`story-b1-10`: Resolving a Customer Support Dispute** (การแก้ปัญหาการบริการและติดตามพัสดุ)
    - *Synopsis:* Calling an e-commerce support hotline about a damaged delivery, explaining the issue calmly, providing proof, and securing a replacement shipment.
11. **`story-b1-11`: Preparing for an Important Job Interview** (การเตรียมตัวสัมภาษณ์งานตำแหน่งสำคัญ)
    - *Synopsis:* Researching company background, rehearsing behavioral interview questions using the STAR method, choosing professional attire, and calming nervous energy.
12. **`story-b1-12`: Building a Balanced Daily Routine** (การสร้างกิจวัตรเพื่อสุขภาพและสมดุลชีวิต)
    - *Synopsis:* Overcoming burnout by establishing regular sleep patterns, meal planning, morning exercise, and setting clear boundaries between work and personal life.

### Level B2 (4 Stories — 6 mins each)
13. **`story-b2-8`: Negotiating a Flexible Remote Work Agreement** (การเจรจาต่อรองสัญญาทำงานแบบ Remote)
    - *Synopsis:* Presenting productivity data and communication protocols to department managers to transition a role into a permanent hybrid/remote arrangement.
14. **`story-b2-9`: Navigating Urban Transit Modernization** (การปรับตัวกับระบบคมนาคมและขนส่งสาธารณะยุคใหม่)
    - *Synopsis:* Adapting to newly launched digital transit ticketing systems and bus rapid transit networks during city-wide infrastructure overhauls.
15. **`story-b2-10`: Embracing a Sustainable Zero-Waste Lifestyle** (วิถีชีวิตเพื่อความยั่งยืนและการลดขยะในครัวเรือน)
    - *Synopsis:* Practical transition towards minimizing single-use plastics, composting food scraps, supporting local circular economies, and reducing carbon footprints.
16. **`story-b2-11`: Handling Airline Disruptions and Compensation** (การรับมือเที่ยวบินล่าช้าและการเรียกร้องสิทธิประโยชน์)
    - *Synopsis:* Managing an unexpected flight cancellation during an international transfer, knowing passenger rights, securing hotel vouchers, and filing official compensation claims.

---

## 4. Technical Integration & Verification
- Stories will be formatted in `src/data/stories.json` with strict schema validation: `{ id, title, titleThai, genre, level, readTime, content, contentThai }`.
- Vocabulary alignment: Every word in the story contents will be verified against `wordLookup.js` and `vocabulary.json` to ensure 100% interactive popover lookup support.
- Production build: Validated with `npm run build` and `scripts/deep_audit.cjs`.
