# Rapid Fire POS (Part of Speech) Mode Design

## Overview
A new game mode focused on quickly identifying the Part of Speech (POS) of English vocabulary words. Positioned in the "Starter" difficulty tier, it is designed to build muscle memory for grammatical categories without overwhelming the user. The mode will sit next to "Guess Mode" on the Home page.

## Core Features & Gameplay Loop
- **Time-Attack Format:** The game starts with a fixed timer (e.g., 60 seconds).
- **Core Display:** Shows an English word and its Thai translation prominently.
- **Choices:** Displays 4 large buttons, each representing a POS category (Noun, Verb, Adjective, Adverb, Pronoun, Preposition, etc.). One is correct; three are randomly selected incorrect options.
- **Scoring System:**
  - **Correct Answer:** +10 points, +1 to streak multiplier, +1 second to timer.
  - **Wrong Answer:** Streak resets to 0, -2 seconds from timer. The incorrect button flashes red.
- **End State:** When the timer hits 0, the game ends, showing the final score, total correct answers, and granting EXP through the Gamification hook.

## Architecture & Components

### 1. Routing & Home Page Update
- **Route:** `/pos`
- **File:** `src/pages/Home.jsx`
- **Action:** Add the POS mode object to the `starterModes` array. 
  - `id`: 'pos'
  - `title`: 'หมวดหมู่คำ (POS)'
  - `description`: 'ฝึกแยกแยะชนิดของคำ (Noun, Verb, Adj, etc.) อย่างรวดเร็วเพื่อสร้างความจำอัตโนมัติ'
  - `icon`: Tag or Zap icon.

### 2. POS Mode Page (`src/pages/POSMode.jsx`)
- **State Management:**
  - `timeLeft` (integer)
  - `score` (integer)
  - `streak` (integer)
  - `currentWord` (object from vocabulary)
  - `options` (array of strings)
  - `gameState` ('idle', 'playing', 'gameover')
- **Hooks Used:**
  - `useGamification`: To award EXP at the end of the game.
- **Components Needed:**
  - Timer bar (progress bar decreasing).
  - Word display card (shows `word` and `meaning`).
  - 4 x Option buttons.
  - Game Over modal/overlay.

### 3. Data Processing Logic
- The `vocabulary.json` file contains a `type` string which can have multiple forms like `"n."`, `"adj. B1 n."`.
- **Parsing Logic:** 
  - Extract the primary POS (the first valid token like `n.`, `v.`, `adj.`, `adv.`).
  - Normalize them to readable labels: `n.` -> `Noun`, `v.` -> `Verb`, `adj.` -> `Adjective`, `adv.` -> `Adverb`, `prep.` -> `Preposition`, `pron.` -> `Pronoun`, `conj.` -> `Conjunction`.
  - Filter out words with "unknown" or highly complex types if necessary.

## Edge Cases & Handling
- **Words with multiple POS:** e.g., `"adj. B1 n."`. The parser should extract the first one ("adj.") as the primary correct answer to avoid confusion in a Starter mode, or display all valid options if a user clicks any of them (simpler to just pick the primary one).
- **Timer running out during animation:** Clear intervals and timeouts gracefully using React `useEffect` cleanup.

## Future Expansion
- Add difficulty levels (e.g., hide the Thai translation in Advanced mode).
- Introduce a "Grammar Detective" mode as a follow-up.
