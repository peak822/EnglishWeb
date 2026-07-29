# Listening Mode Design Specification

## Overview
A new "Listening Mode" (ทายคำจากการฟัง) will be added to the English Study Web application. This mode tests the user's ability to recognize English words by ear. The user listens to a spoken word and selects the correct English spelling from 4 options.

## Architecture & Components
1. **New Component:** `src/pages/ListeningMode.jsx`
   - Will follow the established pattern of game modes in the app (e.g., `GuessMode.jsx`, `SwipeMode.jsx`).
   - Hooks used: `useGamification` for EXP, `useCategories` for word filtering.
2. **Routing:** Add route `/listen` in `App.jsx` pointing to `ListeningMode`.
3. **Home Page Entry:** Add an entry for Listening Mode in the `starterModes` array in `src/pages/Home.jsx`.

## Data Flow & State
- **State variables:** `gameState` (idle, playing, gameover), `timeLeft`, `score`, `streak`, `currentIndex`, `words` (pool of words), `options` (current choices).
- **Options Generation:** Uses the same robust filtering logic built for GuessMode to ensure distractors do NOT have the exact same Thai meaning as the correct answer.
- **Audio Playback:** Uses `window.speechSynthesis`. A large, prominent speaker button in the center of the UI will trigger the playback.

## User Interface Details
- **Idle State:** Displays the mode title and a "Start Game" button.
- **Playing State:**
  - **HUD:** Back button, Score, Streak (multiplier), Timer progress bar.
  - **Center Area:** A large interactive speaker icon with a CSS pulse/ripple effect to indicate it should be clicked.
  - **Options Grid:** 4 buttons displaying English words.
- **Interactions:**
  - **Correct Answer:** The selected button turns green. The central area updates to show the English word, IPA, and Thai meaning. A delay of 2.5 seconds allows the user to read the meaning before auto-advancing. EXP is awarded.
  - **Incorrect Answer:** The selected button shakes and turns red. Time penalty is applied. The user can guess again.
- **Game Over State:** Shows final score, correct count, EXP gained, and restart/home buttons.

## Error Handling
- **Speech Synthesis Unavailable:** If `window.speechSynthesis` is missing, the game should still function, perhaps showing a fallback text or gracefully handling the error, though all modern browsers support it.
- **Missing Audio Voices:** Uses the default OS voice for English (`en-US` preferred).

## Testing Strategy
- Manual verification of routing from Home -> Listening Mode.
- Verify `window.speechSynthesis` correctly triggers when clicking the speaker button.
- Ensure correct visual feedback (green/red) and auto-advance on correct answers.
- Verify options don't contain ambiguous duplicates.
