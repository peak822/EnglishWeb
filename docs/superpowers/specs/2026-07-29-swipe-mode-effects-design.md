# Swipe Mode Visual Effects (Arcade Impact)

## 1. Goal
Improve the user feedback in Swipe Mode when answering incorrectly and when losing the game (Game Over). The transition should be dramatic and prevent confusion.

## 2. Approach: Arcade Impact
- **Mistake Feedback**: When the player swipes incorrectly, a red cross (❌) flashes on the card, and the screen shakes violently (`camera-shake`).
- **Game Over Transition**: When lives hit 0, instead of snapping instantly to the score screen, a dramatic slow-motion sequence begins. The screen turns red, and a "GAME OVER" text slams onto the screen.

## 3. Implementation Details

### React State (SwipeMode.jsx)
- Introduce `isTransitioningGameOver` state. 
- When lives drop to 0 in `handleMistake()`, set `isTransitioningGameOver = true` instead of `setIsGameOver(true)`.
- Use a `setTimeout` for ~2.5 seconds to wait for the dramatic animation to finish. After the timeout, set `setIsGameOver(true)` to show the final score card.
- Introduce `showCross` state, activated for ~300ms on incorrect answers.

### CSS (App.css)
Add new animation classes:
- `.camera-shake`: Keyframes translating the main container back and forth rapidly (e.g. `translate(5px, 5px)`, `translate(-5px, -5px)`).
- `.slam-text`: Keyframes scaling text from `transform: scale(4)` with 0 opacity to `transform: scale(1)` with 1 opacity quickly, accompanied by a small bounce/shake.
- `.dramatic-overlay`: A dark crimson semi-transparent fixed overlay that fades in.
- `.cross-stamp`: A red "X" icon centered over the card that briefly stamps in.

## 4. Flow Summary
1. User swipes wrong on last life.
2. `handleMistake()` decrements life to 0.
3. React renders `<div className="dramatic-overlay">` and `<h2 className="slam-text">GAME OVER</h2>`. Container gets `.camera-shake`.
4. 2500ms later -> `setIsGameOver(true)`.
5. React renders standard Game Over score screen.
