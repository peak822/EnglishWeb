# Speed Swipe Mode Design Spec

## Overview
A new game mode called "Speed Swipe" designed to train rapid vocabulary recognition through a Tinder-style swipe interface. Users are presented with a flashcard containing an English word and a Thai meaning. They must quickly decide if the meaning is correct (Swipe Right) or incorrect (Swipe Left) before time runs out.

## Core Mechanics
- **Card Generation**: 
  - Pulls words based on the selected difficulty level/theme.
  - 50% chance the displayed meaning matches the word.
  - 50% chance the displayed meaning is randomly selected from a different word in the dataset.
- **Controls**:
  - Desktop: Left Arrow (False/Incorrect) and Right Arrow (True/Correct).
  - Mobile: Swipe left and Swipe right touch gestures.
- **Time Limit**: Each card has a strict timer (e.g., 3-5 seconds).
- **Lives & Progression**:
  - The player starts with 3 lives (Hearts).
  - An incorrect swipe or running out of time deducts 1 life.
  - The game ends when lives reach 0 (Game Over) or 20 cards are answered correctly (Victory).
- **Combos**: Consecutive correct answers build a combo multiplier, which increases the EXP earned.

## Visuals & UI
- **Animations**: 
  - Swiping right makes the card tilt right, glow green, and fade out.
  - Swiping left makes the card tilt left, glow red, and fade out.
- **Timer Bar**: A horizontal bar at the top or bottom of the card that shrinks over time. Turns red and pulses when time is running low (< 1.5 seconds).
- **Feedback Icons**: A large Green Check or Red Cross appears overlaying the card briefly when a decision is made.
- **Layout**: Fits seamlessly into the Cyberpunk theme with neon borders and dark backgrounds.

## Technical Architecture
- **Component**: `src/pages/SwipeMode.jsx`
- **Hooks**: Use existing `useGamification` for EXP calculation. May need a custom hook or local state for gesture tracking (touch start/end coordinates).
- **State Management**:
  - `currentCard`: The current word and meaning being displayed.
  - `timeLeft`: Timer for the current card.
  - `lives`: Integer, starts at 3.
  - `combo`: Integer, resets on mistake.
  - `swipeDirection`: String ('left', 'right', or null) for animation triggers.

## Self-Review Checklist
- [x] No placeholders or vague requirements.
- [x] Mechanics are consistent with the Cyberpunk aesthetic.
- [x] Scope is well-defined and suitable for a single implementation plan.
- [x] Follows the user's explicit preference for fast-paced, reflex-based learning.
