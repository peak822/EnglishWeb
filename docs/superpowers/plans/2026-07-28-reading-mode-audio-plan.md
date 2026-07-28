# Reading Mode Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a button in Reading Mode to speak the vocabulary word using the Web Speech API.

**Architecture:** A simple `playAudio` function triggers `window.speechSynthesis.speak()`. The table in `ReadMode.jsx` is expanded by one column to hold the `Volume2` icon button.

**Tech Stack:** React, Lucide-React, Web Speech API.

## Global Constraints
- Do not introduce any external dependencies for TTS.
- Use `window.speechSynthesis`.

---

### Task 1: Add Audio Button to ReadMode

**Files:**
- Modify: `src/pages/ReadMode.jsx`

**Interfaces:**
- Consumes: `Volume2` from `lucide-react`.

- [ ] **Step 1: Write minimal implementation**

Update `src/pages/ReadMode.jsx` to include the `playAudio` function and update the table headers and rows.

```jsx
// 1. Add Volume2 to the lucide-react imports:
import { Search, ChevronLeft, ChevronRight, FileText, Volume2 } from 'lucide-react';

// 2. Add playAudio function inside the ReadMode component:
  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

// 3. Add an empty <th> at the end of the table header:
                  <th>Level</th>
                  <th></th>

// 4. Add the button <td> at the end of the table row:
                      <td><span className={`td-level level-${levelClass}`}>{word.level}</span></td>
                      <td className="text-center">
                        <button 
                          onClick={() => playAudio(word.word)}
                          className="p-2 text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 size={20} />
                        </button>
                      </td>
```

- [ ] **Step 2: Run test to verify it passes**

Since this is purely visual/browser-api driven, manual verification is required:
Run: Open `http://localhost:5173` (or the dev server port), navigate to Reading Mode.
Expected: The table should have an extra column on the right with a speaker icon. Clicking it should read the word out loud.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ReadMode.jsx
git commit -m "feat: add audio pronunciation button to reading mode"
```
