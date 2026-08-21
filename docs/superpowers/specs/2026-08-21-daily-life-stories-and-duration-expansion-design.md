# Daily Life Stories & Duration Expansion Design Specification

**Author:** Antigravity AI  
**Date:** 2026-08-21  
**Scope:** Addition of 17 new high-utility Daily Life stories (4 new stories for A1, A2, B1; 5 new stories for B2 to reach 16 stories per level, total 64 stories) with updated reading durations (+4 minutes per level) and full interactive word lookup & TTS compatibility.

---

## 1. Overview & Objectives

Expand the interactive reading library in English Study Web from 47 stories to 64 stories (16 stories per level across A1, A2, B1, B2). Each new story focuses on authentic daily life situations, dialogues, and practical vocabulary.

In addition, the estimated reading durations across the application are expanded by +4 minutes per level to reflect deeper, more immersive reading passages:
- **Level A1:** `7 mins` (previously `3 mins`)
- **Level A2:** `8 mins` (previously `4 mins`)
- **Level B1:** `9 mins` (previously `5 mins`)
- **Level B2:** `10 mins` (previously `6 mins`)

---

## 2. Reading Durations & Content Specifications

### 2.1 Target Durations and Word Counts
- **A1 Beginner (`7 mins`):** Target word count: ~280–350 words. Focus on foundational vocabulary, clear sentence structures, simple present/past tenses, and practical everyday phrases.
- **A2 Elementary (`8 mins`):** Target word count: ~380–480 words. Focus on connected daily routines, conversational exchanges, phrasal verbs, and multi-step scenarios.
- **B1 Intermediate (`9 mins`):** Target word count: ~500–620 words. Focus on problem-solving, workplace communication, scheduling, and descriptive narrative paragraphs.
- **B2 Upper Intermediate (`10 mins`):** Target word count: ~620–780 words. Focus on formal negotiation, consumer rights, analytical viewpoints, and nuanced professional/social discourse.

### 2.2 Story Data Structure
Each story entry in `src/data/stories.json` maintains the established schema:
```json
{
  "id": "story-a1-13",
  "title": "Ordering at a Local Café",
  "titleThai": "การสั่งเครื่องดื่มและขนมที่คาเฟ่",
  "genre": "Daily Life",
  "level": "A1",
  "readTime": "7 mins",
  "content": "English reading text with paragraphs and dialogue...",
  "contentThai": "คำแปลภาษาไทยที่สละสลวยและตรงตามย่อหน้า..."
}
```

---

## 3. Detailed Catalog of New Stories (17 Stories)

### Level A1 (4 New Stories: `story-a1-13` to `story-a1-16`, 7 mins each)
1. **`story-a1-13`: Ordering at a Local Café** (การสั่งเครื่องดื่มและขนมที่คาเฟ่)
   - *Synopsis:* Visiting a neighborhood coffee shop, ordering drinks (hot latte, iced tea), choosing milk and sweetness options, ordering a warm croissant, paying by card, and waiting for the order.
2. **`story-a1-14`: Going to the Pharmacy** (การไปซื้อยาที่ร้านขายยา)
   - *Synopsis:* Explaining symptoms (mild fever, sore throat, headache) to the pharmacist, asking about medicine instructions (take after meals, drink lots of water), and buying cough lozenges.
3. **`story-a1-15`: Taking the Subway and Bus** (การเดินทางด้วยรถไฟฟ้าและรถเมล์)
   - *Synopsis:* Buying a transit card at the ticket machine, tapping through the fare gates, reading route maps, transferring from train to city bus, and ringing the stop bell.
4. **`story-a1-16`: Asking for Directions in Town** (การถามทางในตัวเมือง)
   - *Synopsis:* Asking a friendly local for directions to the central library, understanding directions (turn left at the traffic light, walk past the supermarket, it's on the right), and thanking them.

### Level A2 (4 New Stories: `story-a2-13` to `story-a2-16`, 8 mins each)
5. **`story-a2-13`: Opening a Bank Account** (การเปิดบัญชีธนาคารและทำบัตรเดบิต)
   - *Synopsis:* Visiting a local bank branch, speaking with the teller to open a savings account, presenting ID documents, choosing a debit card, and downloading/setting up the mobile banking app.
6. **`story-a2-14`: Booking a Hotel Room and Check-in** (การจองห้องพักและเช็คอินโรงแรม)
   - *Synopsis:* Calling or checking into a boutique hotel, confirming reservation details, requesting a non-smoking high-floor room, asking about complimentary breakfast hours and Wi-Fi password.
7. **`story-a2-15`: Visiting a Dentist for a Check-up** (การไปตรวจฟันตามนัดหมาย)
   - *Synopsis:* Going to a dental clinic for a routine cleaning and mild tooth sensitivity check, receiving brushing tips from the dentist, and scheduling the next six-month checkup.
8. **`story-a2-16`: Cooking Dinner with a Friend** (การทำอาหารร่วมกับเพื่อน)
   - *Synopsis:* Shopping for fresh ingredients, prepping vegetables and seasoning chicken together in a home kitchen, cooking pasta, setting the dining table, and enjoying a relaxed evening meal.

### Level B1 (4 New Stories: `story-b1-13` to `story-b1-16`, 9 mins each)
9. **`story-b1-13`: Handling an Apartment Maintenance Issue** (การแจ้งซ่อมและประสานงานกับนิติ)
   - *Synopsis:* Noticing a water leak beneath the kitchen sink, contacting building management politely but firmly, scheduling a technician visit, inspecting the repair, and signing off on the maintenance report.
10. **`story-b1-14`: Planning a Team Event at Work** (การจัดกิจกรรมกระชับมิตรในที่ทำงาน)
    - *Synopsis:* Coordinating a quarterly team-building dinner, surveying dietary preferences, setting the per-person budget, booking a private dining room, and sending calendar invites.
11. **`story-b1-15`: Reporting Lost Luggage at the Airport** (การแจ้งกระเป๋าหายและติดตามสัมภาระที่สนามบิน)
    - *Synopsis:* Arriving at the destination only to find luggage missing from the carousel, approaching the airline baggage desk, filing a Property Irregularity Report (PIR), giving hotel delivery details, and tracking online.
12. **`story-b1-16`: Dealing with a Car Breakdown and Roadside Assistance** (การรับมือเมื่อรถเสียและติดต่อหน่วยช่วยเหลือฉุกเฉิน)
    - *Synopsis:* Experiencing a sudden flat tire and warning light on the expressway, safely pulling over to the shoulder, setting up hazard triangles, calling 24/7 roadside assistance, and towing the vehicle to a repair center.

### Level B2 (5 New Stories: `story-b2-12` to `story-b2-16`, 10 mins each)
13. **`story-b2-12`: Renewing a Rental Lease and Negotiating Rent** (การเจรจาต่อสัญญาเช่าคอนโดและขอปรับค่าเช่า)
    - *Synopsis:* Reviewing an upcoming lease renewal offer, researching comparable neighbourhood rents, drafting a persuasive counter-proposal highlighting on-time payment history and minor self-funded repairs, and reaching an agreement.
14. **`story-b2-13`: Resolving an E-Commerce Delivery and Refund Dispute** (การระงับข้อพิพาทการคืนเงินและเคลมสินค้าออนไลน์)
    - *Synopsis:* Receiving a defective electronics item from an online merchant, dealing with an unresponsive seller, escalating the dispute through payment protection and consumer support channels, and securing a full refund.
15. **`story-b2-14`: Managing Workplace Burnout and Work-Life Integration** (การรับมือกับภาวะหมดไฟและการจัดสมดุลชีวิต)
    - *Synopsis:* Recognizing symptoms of chronic workplace fatigue, establishing firm digital boundaries after hours, holding an honest workload alignment meeting with management, and building restorative daily habits.
16. **`story-b2-15`: Adopting Sustainable Home Habits and Energy Efficiency** (การปรับปรุงบ้านเพื่อประหยัดพลังงานและความยั่งยืน)
    - *Synopsis:* Conducting a household energy audit, upgrading to high-efficiency appliances and smart thermostats, implementing composting and greywater recycling, and tracking utility bill reductions.
17. **`story-b2-16`: Organizing a Neighborhood Community Project** (การริเริ่มโครงการพัฒนาชุมชนร่วมกับเพื่อนบ้าน)
    - *Synopsis:* Mobilizing local residents to convert a neglected public lot into a shared green garden, coordinating municipal permits, organizing volunteer shifts, and fostering neighborhood cohesion.

---

## 4. System Updates & Impact Analysis

1. **`src/data/stories.json`**:
   - Update all existing A1 stories to `"readTime": "7 mins"`
   - Update all existing A2 stories to `"readTime": "8 mins"`
   - Update all existing B1 stories to `"readTime": "9 mins"`
   - Update all existing B2 stories to `"readTime": "10 mins"`
   - Append the 17 new stories with complete English text, natural Thai translations, and formatted metadata.
2. **`src/pages/StorySelection.jsx`**:
   - Level card story count dynamically reflects 16 stories per level (Total 64 stories).
3. **`src/pages/StoryReader.jsx`**:
   - Word clicking (`lookupWord`), Oxford 5000 definitions, full story TTS (`speakStory`), sentence audio, and gamification EXP rewards continue to work seamlessly.

---

## 5. Verification Plan

1. **JSON Syntax & Integrity Verification**:
   - Run Node.js validation script to ensure all 64 stories have unique IDs, valid levels (`A1`, `A2`, `B1`, `B2`), correct `readTime` strings (`7 mins`, `8 mins`, `9 mins`, `10 mins`), non-empty `content` and `contentThai`.
2. **Story Reader Interaction**:
   - Verify reading view loads correctly for new stories across each level.
   - Verify TTS narration and word click popups work without errors.
3. **Build & Lint Verification**:
   - Run `npm run build` or Vite build check to ensure zero build regressions.
