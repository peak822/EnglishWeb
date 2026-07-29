# Home Page Categorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Home page to separate learning modes into a "Library" section and re-categorize game modes by progression.

**Architecture:** Modify the existing state/arrays in `src/pages/Home.jsx` to group modes according to the new specification and render an additional section for the Library.

**Tech Stack:** React, React Router

## Global Constraints
- Follow existing component patterns (`Card`, `Tilt`, `lucide-react` icons).
- Maintain existing Tailwind/inline CSS structures.

---

### Task 1: Refactor Mode Arrays and JSX in Home.jsx

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: None (internal refactor)
- Produces: Updated UI on `/` route

- [ ] **Step 1: Update the data arrays**

Modify the existing arrays in `Home.jsx`:
1. Create `libraryModes` containing `read` and `pos-guide`.
2. Update `starterModes` to contain `guess`, `pos`, and `match`.
3. Update `intermediateModes` to contain `assemble`, `context`, and `swipe`.
4. Leave `advancedModes` with `typing` and `syntax`.

```jsx
  const libraryModes = [
    {
      id: 'read',
      title: 'อ่านคำศัพท์',
      description: 'Browse, search, and study the entire Oxford 3000 vocabulary list.',
      icon: <BookOpen size={32} />,
      path: '/read',
      color: 'var(--color-surface)'
    },
    {
      id: 'pos-guide',
      title: 'เรียนรู้ Part of Speech',
      description: 'บทเรียนอธิบายชนิดของคำทั้ง 7 ประเภท พร้อมตัวอย่างจาก Oxford 3000',
      icon: <BookOpen size={32} />,
      path: '/pos-guide',
      color: '#3B82F6' // blue
    }
  ];

  const starterModes = [
    {
      id: 'guess',
      title: 'ทายคำศัพท์',
      description: 'Guess the word based on hints like part of speech and length.',
      icon: <HelpCircle size={32} />,
      path: '/guess',
      color: '#F59E0B'
    },
    {
      id: 'match',
      title: 'เกมจับคู่ (Match)',
      description: 'Test your memory! Match English words with their Thai meanings.',
      icon: <Grid size={32} />,
      path: '/match',
      color: '#00E1FF' // Bright Cyan
    },
    {
      id: 'pos',
      title: 'หมวดหมู่คำ (POS)',
      description: 'ฝึกแยกแยะชนิดของคำ (Noun, Verb, Adj, etc.) อย่างรวดเร็วเพื่อสร้างความจำอัตโนมัติ',
      icon: <Zap size={32} />,
      path: '/pos',
      color: '#8B5CF6' // violet
    }
  ];

  const intermediateModes = [
    {
      id: 'assemble',
      title: 'ประกอบคำศัพท์',
      description: 'Assemble scrambled letters to form the correct word.',
      icon: <Puzzle size={32} />,
      path: '/assemble',
      color: 'var(--color-accent)'
    },
    {
      id: 'context',
      title: 'โหมดเติมคำ (Context)',
      description: 'Fill in the blanks in real-world sentences to understand context.',
      icon: <Type size={32} />,
      path: '/context',
      color: '#8B5CF6' // violet
    },
    {
      id: 'swipe',
      title: 'โหมดปัดซ้ายขวา',
      description: 'Test your reflexes! Swipe right if the meaning matches, left if it is wrong.',
      icon: <Zap size={32} />,
      path: '/swipe',
      color: '#F59E0B' // amber
    }
  ];
```

- [ ] **Step 2: Add The Library section to the JSX**

Render the `libraryModes` array right above the Starter section in the return block.

```jsx
        <div className="difficulty-section">
          <div className="section-header flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-secondary)' }}>
              📖 The Library
            </h3>
            <span className="text-sm font-medium text-[var(--color-neutral)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">คลังความรู้</span>
          </div>
          {renderModeGrid(libraryModes)}
        </div>
```

- [ ] **Step 3: Verify the UI visually**

Run the local server and verify the new sections render correctly on the home page.
Ensure no modes are duplicated or missing.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: refactor home page categorization to Library + Progression"
```
