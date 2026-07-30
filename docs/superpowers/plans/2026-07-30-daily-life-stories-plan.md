# Daily Life Short Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new "Daily Life" short stories (levels A1, A2, B1, B2) to the `Short Story Reading` feature.

**Architecture:** Modify the existing static JSON data file used by the `StorySelection` component.

**Tech Stack:** JSON

## Global Constraints

- Must match existing JSON structure precisely: `id`, `title`, `genre`, `level`, `readTime`, `content`.
- All stories must be of genre "Daily Life".

---

### Task 1: Add Stories to Data File

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Consumes: Existing JSON array structure.
- Produces: Updated JSON array with 4 new objects.

- [ ] **Step 1: Write the implementation**

Append these 4 objects to the JSON array in `src/data/stories.json`:

```json
  {
    "id": "story-a1-2",
    "title": "Morning Coffee",
    "genre": "Daily Life",
    "level": "A1",
    "readTime": "1 min",
    "content": "I wake up at seven o'clock. The sun is bright. I walk to the kitchen. I make a cup of hot coffee. The coffee smells good. I look out the window and see birds. I drink my coffee slowly. Then, I take a shower and get dressed. Now, I am ready for work."
  },
  {
    "id": "story-a2-2",
    "title": "The Supermarket Trip",
    "genre": "Daily Life",
    "level": "A2",
    "readTime": "2 mins",
    "content": "On Saturday afternoon, I went to the supermarket. I had a long shopping list. First, I found fresh vegetables and apples in the produce section. Next, I walked to the dairy aisle to get milk and cheese. I could not find the bread, so I asked a friendly worker for help. He pointed me to the bakery. Finally, I waited in line at the checkout, paid with my card, and carried my bags home."
  },
  {
    "id": "story-b1-2",
    "title": "A Busy Day at the Office",
    "genre": "Daily Life",
    "level": "B1",
    "readTime": "3 mins",
    "content": "Tuesday was a very busy day at the office. I arrived at 8:30 AM and immediately started answering urgent emails. At 10:00 AM, my team had a meeting to discuss the new marketing project. My manager assigned me three new tasks to complete by Friday. I was feeling a bit stressed, but at noon, I went out for lunch with my coworkers. We talked about our weekend plans and laughed a lot. After lunch, I felt much more relaxed and managed to finish most of my work before heading home."
  },
  {
    "id": "story-b2-1",
    "title": "Weekend Chores and Relaxation",
    "genre": "Daily Life",
    "level": "B2",
    "readTime": "4 mins",
    "content": "Balancing household responsibilities with personal time is essential for a productive weekend. This morning, I decided to tackle the accumulated chores early. I vacuumed the entire apartment, scrubbed the bathroom tiles, and did two loads of laundry. It was exhausting work, but seeing the sparkling clean environment was incredibly satisfying. By early afternoon, my tasks were complete. I brewed a pot of herbal tea and settled onto the sofa with a novel I had been eager to read. The contrast between the morning's physical exertion and the afternoon's quiet relaxation made the day feel perfectly balanced."
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/data/stories.json
git commit -m "feat: add 4 new daily life stories"
```
