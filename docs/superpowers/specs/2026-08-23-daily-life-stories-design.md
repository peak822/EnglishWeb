# Daily Life Extended Stories Expansion Design Spec

**Date:** 2026-08-23  
**Status:** Approved  
**Topic:** Expansion of Long-Form Daily Life Articles Across All CEFR Levels (A1, A2, B1, B2, C1)  

---

## 1. Overview
Expand the reading library of **English Study Web** by introducing **25 new comprehensive, long-form Daily Life articles** (5 articles per CEFR level: A1, A2, B1, B2, C1). Each article is designed with realistic scenarios, authentic collocations, practical vocabulary, and high-fidelity Thai translations. Additionally, update the story selection catalog (`StorySelection.jsx`) to feature the **C1 Advanced** tier.

---

## 2. Article Requirements & Distribution

### 2.1 Story Structure & Attributes
Each story item in `src/data/stories.json` adheres to the following schema:
```json
{
  "id": "story-<level>-<number>",
  "title": "English Title",
  "titleThai": "ชื่อเรื่องภาษาไทย",
  "genre": "Daily Life",
  "level": "A1 | A2 | B1 | B2 | C1",
  "readTime": "<N> mins",
  "content": "Full English story text...",
  "contentThai": "คำแปลภาษาไทยเต็มเรื่อง..."
}
```

### 2.2 Content Breakdown by Level

#### Level A1 (Beginner) — ~180-250 Words per Story
1. **`story-a1-17`:** *The Morning Commute to Work* (การเดินทางไปทำงานตอนเช้า)
2. **`story-a1-18`:** *Weekend Supermarket Haul* (ช้อปปิ้งของสดเข้าบ้านวันหยุด)
3. **`story-a1-19`:** *Ordering at a Busy Coffee Shop* (สั่งเครื่องดื่มที่คาเฟ่)
4. **`story-a1-20`:** *Saturday House Cleaning* (ทำความสะอาดบ้านวันหยุด)
5. **`story-a1-21`:** *Cooking a Simple Dinner Together* (ทำมื้อค่ำทานเองที่บ้าน)

#### Level A2 (Elementary) — ~250-320 Words per Story
1. **`story-a2-17`:** *A Visit to the Dentist* (ไปหาหมอฟันตามนัดหมาย)
2. **`story-a2-18`:** *Returning a Damaged Package* (เปลี่ยนและส่งคืนสินค้าที่ชำรุด)
3. **`story-a2-19`:** *Joining a Local Fitness Center* (สมัครฟิตเนสและเข้าคลาสออกกำลังกาย)
4. **`story-a2-20`:** *Planning a Weekend Road Trip* (วางแผนขับรถเที่ยวต่างจังหวัดกับเพื่อน)
5. **`story-a2-21`:** *Hosting a Cozy Housewarming Party* (จัดปาร์ตี้เลี้ยงต้อนรับขึ้นบ้านใหม่)

#### Level B1 (Intermediate) — ~320-400 Words per Story
1. **`story-b1-17`:** *Moving into a New Apartment* (ย้ายเข้าคอนโดใหม่และตรวจเช็คสัญญาเช่า)
2. **`story-b1-18`:** *Managing Monthly Expenses & Savings* (วางแผนการเงินและคุมงบรายเดือน)
3. **`story-b1-19`:** *Handling a Flight Delay at the Airport* (รับมือเที่ยวบินดีเลย์ที่สนามบิน)
4. **`story-b1-20`:** *Unexpected Car Breakdown on the Highway* (รถเสียกะทันหันบนทางด่วน)
5. **`story-b1-21`:** *Adopting and Caring for a Rescue Puppy* (รับเลี้ยงสุนัขจรจัดและฝึกพฤติกรรม)

#### Level B2 (Upper-Intermediate) — ~400-500 Words per Story
1. **`story-b2-17`:** *Navigating Remote Work & Digital Fatigue* (บาลานซ์ชีวิตและการทำงานเมื่อ Work from Home)
2. **`story-b2-18`:** *De-escalating a Difficult Customer Dispute* (ศิลปะการเจรจากับลูกค้าที่กำลังโมโห)
3. **`story-b2-19`:** *Home Renovation & Eco-Friendly Living* (รีโนเวทบ้านเพื่อความยั่งยืนและประหยัดพลังงาน)
4. **`story-b2-20`:** *Navigating Health Insurance Claims* (การเคลมประกันสุขภาพและการพบแพทย์เฉพาะทาง)
5. **`story-b2-21`:** *Maintaining Lifelong Friendships as Adults* (การรักษามิตรภาพและจัดสรรเวลาในวัยผู้ใหญ่)

#### Level C1 (Advanced) — ~450-550 Words per Story
1. **`story-c1-1`:** *The Philosophy of Intentional Minimalism* (ปรัชญาการใช้ชีวิตแบบมินิมอลที่มีเป้าหมาย)
2. **`story-c1-2`:** *Navigating Nuanced Social Etiquette at Formal Dinners* (มารยาทสังคมและการสนทนาในงานเลี้ยงนานาชาติ)
3. **`story-c1-3`:** *Overcoming Chronic Procrastination & Cognitive Biases* (เจาะลึกจิตวิทยาการเอาชนะการผลัดวันประกันพรุ่ง)
4. **`story-c1-4`:** *Urban Living vs. Rural Relocation Trade-offs* (ชั่งน้ำหนักข้อดีข้อเสียระหว่างชีวิตคนเมืองกับชนบท)
5. **`story-c1-5`:** *The Subtle Art of Everyday Negotiation* (จิตวิทยาการเจรจาต่อรองในชีวิตประจำวันแบบ Win-Win)

---

## 3. UI & Catalog Updates (`StorySelection.jsx`)
* Add **C1 Advanced** tier to the `categories` array in `StorySelection.jsx`:
  * `id: 'C1'`
  * `title: 'C1 Advanced'`
  * `titleThai: 'ระดับสูง (Advanced)'`
  * `description: 'บทความวิเคราะห์เชิงลึก ปรัชญา การเจรจาขั้นสูง และโครงสร้างภาษาที่สละสลวย'`
  * `color: '#f43f5e'`
  * `icon: ShieldCheck / Award`

---

## 4. Verification & Validation Strategy
1. **JSON Schema Integrity:** Validate that `src/data/stories.json` parses with 0 errors and all 89 stories (64 existing + 25 new) have non-empty `id`, `title`, `titleThai`, `genre`, `level`, `content`, and `contentThai`.
2. **Readability & Sentence Matching:** Ensure every sentence in the English version matches accurately with the Thai translation for smooth dual-language reading.
3. **Catalog Filtering:** Confirm that clicking A1, A2, B1, B2, and C1 in `StorySelection.jsx` filters and displays the exact story cards cleanly.
4. **Vite Build Verification:** Run `npm run build` and `npm run lint`.
