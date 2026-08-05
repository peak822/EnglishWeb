# Story Thai Translation Enhancement Design Spec

## Overview
This specification details the retranslation and natural Thai phrasing for all 31 reading stories in `src/data/stories.json`. The goal is to elevate the translations from literal/rigid sentences to fluent, engaging, contextual, and natural Thai storytelling while preserving the exact meaning and CEFR difficulty alignment of the original English text.

## Scope
- Target File: `src/data/stories.json`
- Total Items: 31 stories across levels A1, A2, B1, B2.
- Fields Updated: `titleThai` (where improvements can be made) and `contentThai` (all stories retranslated with high polish).

## Translation Guidelines & Quality Criteria
1. **Flow & Natural Phrasing (ภาษาเป็นธรรมชาติและสละสลวย):**
   - Eliminate awkward word-for-word structures (e.g. avoiding overuse of "มัน", "พวกเรา", "ได้รับการ", passive forms where active is natural in Thai).
   - Use evocative and authentic vocabulary (e.g., "หอมกรุ่น", "ลืมตาตื่น", "ทัศนียภาพเบื้องหน้า", "เปิดอกคุย").
2. **Contextual & Expressive Tone (สอดคล้องกับธีมและระดับของเรื่อง):**
   - **A1 Stories:** Simple, clear, warm, conversational everyday tone.
   - **A2 Stories:** Engaging, smooth chronological flow for everyday activities and short adventures.
   - **B1 Stories:** Rich narrative style with vivid verbs and emotional depth.
   - **B2 Stories:** Polished, professional, and mature expressions for workplace, personal finance, conflict resolution, and negotiation topics.
3. **Data Integrity & Consistency:**
   - Keep all other JSON keys (`id`, `title`, `genre`, `level`, `readTime`, `content`) completely unchanged.
   - Ensure valid JSON formatting with proper escaping.
   - Retain user's custom edit on `story-b1-1` (The First Colony) which serves as our benchmark standard.

## Story Inventory (31 Stories)
1. `story-a1-1` A Day at the Park (Daily Life / A1)
2. `story-a2-1` The Secret Map (Adventure / A2)
3. `story-b1-1` The First Colony (Sci-Fi / B1 - Benchmark)
4. `story-a1-2` Morning Coffee (Daily Life / A1)
5. `story-a2-2` The Supermarket Trip (Daily Life / A2)
6. `story-b1-2` A Busy Day at the Office (Daily Life / B1)
7. `story-b2-1` Weekend Chores and Relaxation (Daily Life / B2)
8. `story-a1-3` My Pet Cat (Daily Life / A1)
9. `story-a1-4` Cooking Dinner (Daily Life / A1)
10. `story-a1-5` Going to School (Daily Life / A1)
11. `story-a2-3` A Visit to the Dentist (Daily Life / A2)
12. `story-a2-4` Cleaning the House (Daily Life / A2)
13. `story-a2-5` Buying New Shoes (Daily Life / A2)
14. `story-b1-3` Planning a Birthday Party (Daily Life / B1)
15. `story-b1-4` A Fitness Routine (Daily Life / B1)
16. `story-b1-5` Car Trouble (Daily Life / B1)
17. `story-b2-2` Managing Personal Finances (Daily Life / B2)
18. `story-b2-3` A Difficult Conversation (Daily Life / B2)
19. `story-b2-4` Adapting to a New Neighborhood (Daily Life / B2)
20. `story-a1-6` Ordering at a Cafe (Daily Life / A1)
21. `story-a1-7` Asking for Directions (Daily Life / A1)
22. `story-a1-8` At the Pharmacy (Daily Life / A1)
23. `story-a2-6` Checking In at a Hotel (Daily Life / A2)
24. `story-a2-7` Returning a Store Item (Daily Life / A2)
25. `story-a2-8` Booking a Doctor's Appointment (Daily Life / A2)
26. `story-b1-6` Dealing with Customer Service (Daily Life / B1)
27. `story-b1-7` A Job Interview Experience (Daily Life / B1)
28. `story-b1-8` Finding and Renting an Apartment (Daily Life / B1)
29. `story-b2-5` Negotiating a Project Deadline (Daily Life / B2)
30. `story-b2-6` Resolving a Roommate Dispute (Daily Life / B2)
31. `story-b2-7` Handling Flight Delays & Airline Compensation (Daily Life / B2)

## Verification
- Verify JSON validity by parsing `src/data/stories.json`.
- Verify full coverage of all 31 stories.
- Verify web app rendering in `StoryReader` mode.
