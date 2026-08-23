# Cyber-HUD & Neural Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform English Study Web into an immersive, state-of-the-art "Cyber-HUD / Neural Terminal" with synthesized Web Audio sound FX, 3D holographic tilt cards, floating `Ctrl+K` Command Palette, and a modernized 4-Sector Mission Control Hub.

**Architecture:** 
- A lightweight Web Audio API engine (`cyberSound.js`) provides zero-dependency procedural audio (clicks, chirps, chimes, combos) with persistent mute control.
- Reusable UI primitives (`TechBracket`, `HoloCard`, `CommandPalette`, `MissionDebriefModal`) supply standard Sci-Fi HUD aesthetics across the app.
- Top-level `App.jsx` hosts the Glass Visor navigation, Energy Core reactor EXP bar, and global Command Palette.
- `Home.jsx` is transformed into a 4-Sector Mission Control Hub with CEFR clearance chips, streak battery, and daily directives.

**Tech Stack:** React 19, Vite, Lucide React, react-parallax-tilt, Web Audio API, Vanilla CSS (CSS Grid, Glassmorphism, CSS 3D Transforms).

## Global Constraints
- Do not introduce heavy external audio asset files (MP3/WAV) — all UI micro-sounds must be generated dynamically via Web Audio API.
- Maintain existing local storage keys for EXP, levels, badges, and streaks to avoid data reset.
- Ensure 100% responsiveness on mobile screens (<768px) with touch-friendly tap targets (minimum 44px).
- All changes must pass build (`npm run build`) and lint checks without warnings.

---

### Task 1: Web Audio Cyber Sound Synthesizer Engine

**Files:**
- Create: `src/utils/cyberSound.js`
- Create: `src/hooks/useCyberSound.js`

**Interfaces:**
- Produces: 
  - `playCyberSound(type, options)` where type is `'hover' | 'click' | 'success' | 'combo' | 'levelUp' | 'warp'`
  - `isAudioMuted()`, `setAudioMuted(boolean)`, `toggleAudioMute()`
  - `useCyberSound()` hook providing `{ playSound, isMuted, toggleMute }`

- [ ] **Step 1: Write `src/utils/cyberSound.js`**

```javascript
/**
 * Procedural Web Audio API Sound Synthesizer for Cyber-HUD
 * Zero external assets required.
 */

let audioCtx = null;
let isMutedState = false;

// Load initial mute state
if (typeof window !== 'undefined') {
  isMutedState = localStorage.getItem('cyber_audio_muted') === 'true';
}

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isAudioMuted = () => isMutedState;

export const setAudioMuted = (muted) => {
  isMutedState = !!muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('cyber_audio_muted', isMutedState ? 'true' : 'false');
  }
};

export const toggleAudioMute = () => {
  setAudioMuted(!isMutedState);
  return isMutedState;
};

export const playCyberSound = (type = 'click', options = {}) => {
  if (isMutedState) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    switch (type) {
      case 'hover': {
        // High-pitch subtle frequency chirp (35ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.035);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
        break;
      }

      case 'click': {
        // Tactile mechanical relay tick
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'success': {
        // Harmonious dual-tone cyber chime (D5 -> A5)
        const tones = [587.33, 880.0];
        tones.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.08, now + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.25);
        });
        break;
      }

      case 'combo': {
        // Rising arpeggio based on streak count
        const streak = Math.min(options.streak || 1, 8);
        const baseFreq = 440 * Math.pow(1.08, streak);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'levelUp': {
        // Sci-Fi energy power surge chord
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.1, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.4);
        });
        break;
      }

      case 'warp': {
        // Cyber teleport / jump sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
};
```

- [ ] **Step 2: Write `src/hooks/useCyberSound.js`**

```javascript
import { useState, useCallback } from 'react';
import { playCyberSound, isAudioMuted, toggleAudioMute, setAudioMuted } from '../utils/cyberSound';

export const useCyberSound = () => {
  const [isMuted, setIsMuted] = useState(isAudioMuted());

  const toggle = useCallback(() => {
    const nextState = toggleAudioMute();
    setIsMuted(nextState);
    if (!nextState) {
      playCyberSound('click');
    }
    return nextState;
  }, []);

  const play = useCallback((type, options) => {
    playCyberSound(type, options);
  }, []);

  return {
    isMuted,
    toggleMute: toggle,
    setMuted: (val) => {
      setAudioMuted(val);
      setIsMuted(val);
    },
    playSound: play,
  };
};
```

- [ ] **Step 3: Test and Commit**
```bash
git add src/utils/cyberSound.js src/hooks/useCyberSound.js
git commit -m "feat: add Web Audio API cyber sound synthesizer engine and hook"
```

---

### Task 2: Core HUD Components (`TechBracket`, `HoloCard`, `CommandPalette`, `MissionDebriefModal`)

**Files:**
- Create: `src/components/TechBracket.jsx`
- Create: `src/components/HoloCard.jsx`
- Create: `src/components/CommandPalette.jsx`
- Create: `src/components/MissionDebriefModal.jsx`

- [ ] **Step 1: Write `src/components/TechBracket.jsx`**
Sci-Fi corner brackets with customizable glow and size.

- [ ] **Step 2: Write `src/components/HoloCard.jsx`**
Wraps cards with `react-parallax-tilt` (or pure CSS on touch devices), iridescence foil sheen layer, corner tech-brackets, and hover/click audio triggers.

- [ ] **Step 3: Write `src/components/CommandPalette.jsx`**
Global `Ctrl+K` modal offering quick-jump to all 12 training modes, theme toggles, audio controls, and vocabulary quick search.

- [ ] **Step 4: Write `src/components/MissionDebriefModal.jsx`**
Sci-Fi mission summary modal showing score, accuracy grade (S/A/B/C), EXP counter, and next mission actions with sound effects.

- [ ] **Step 5: Test and Commit**
```bash
git add src/components/TechBracket.jsx src/components/HoloCard.jsx src/components/CommandPalette.jsx src/components/MissionDebriefModal.jsx
git commit -m "feat: add core Cyber-HUD UI components (HoloCard, CommandPalette, TechBracket, DebriefModal)"
```

---

### Task 3: Global HUD Shell, Navigation Visor & Style Enhancements

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `src/index.css`

- [ ] **Step 1: Update `src/App.jsx`**
  - Integrate `CommandPalette` with global `Ctrl+K` listener and header shortcut button.
  - Upgrade Navigation to Glass Visor HUD with glowing perimeter.
  - Implement Energy Core Reactor EXP bar with pulsating glow effect.
  - Add Cyber Audio HUD toggle button (`Volume2` / `VolumeX`) with tactical tooltip.

- [ ] **Step 2: Update `src/App.css` and `src/index.css`**
  - Add Chamfered corner styles (`.cyber-box`, `.tech-bracket-corner`).
  - Add Holo foil sheen gradient animations (`@keyframes holo-sheen`).
  - Add Energy Reactor progress bar glowing styling.
  - Add Command Palette backdrop blur and floating HUD animations.

- [ ] **Step 3: Test and Commit**
```bash
git add src/App.jsx src/App.css src/index.css
git commit -m "feat: upgrade App layout with Cyber Visor, Energy Reactor bar, and Command Palette"
```

---

### Task 4: Home "Mission Control & Neural Hub" Redesign

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Overhaul `src/pages/Home.jsx`**
  - Header: Sci-Fi System Status Banner (`SYSTEM OPERATIONAL // PROTOCOL ACTIVE`).
  - Cyber Streak Power Core Battery Widget.
  - "Resume Last Protocol" Quick Action Button.
  - CEFR Clearance Matrix (A1 - C1 Level chips with glowing active state).
  - 4-Sector Holographic Grid (Sector Alpha: Core, Beta: Reflex, Gamma: Linguistics, Delta: Holo-Stories) using `HoloCard`.
  - Daily Neural Directives Widget with live EXP reward calculation.

- [ ] **Step 2: Test and Commit**
```bash
git add src/pages/Home.jsx
git commit -m "feat: redesign Home page into 4-Sector Cyber Mission Control Hub"
```

---

### Task 5: Learning Modes HUD Integration

**Files:**
- Modify: `src/pages/TypingMode.jsx`
- Modify: `src/pages/AssembleMode.jsx`
- Modify: `src/pages/GuessMode.jsx`
- Modify: `src/pages/MatchMode.jsx`

- [ ] **Step 1: Integrate HUD elements & Cyber Audio in `TypingMode.jsx`**
  - Add WPM Speedometer & Accuracy Gauge HUD.
  - Trigger audio on correct/incorrect strokes and completion.

- [ ] **Step 2: Integrate HUD elements & Cyber Audio in `AssembleMode.jsx`**
  - Add magnetic snap feedback and sounds when placing word letters.

- [ ] **Step 3: Integrate HUD elements & Cyber Audio in `GuessMode.jsx` & `MatchMode.jsx`**
  - Add combo surge particles, tactical choice cards, and end-of-session MissionDebriefModal.

- [ ] **Step 4: Test and Commit**
```bash
git add src/pages/TypingMode.jsx src/pages/AssembleMode.jsx src/pages/GuessMode.jsx src/pages/MatchMode.jsx
git commit -m "feat: integrate Cyber-HUD styling, combo surges, and sound triggers across core modes"
```

---

### Task 6: Verification, Responsive Polish & Build Validation

**Files:**
- Build & Lint check across the entire codebase.

- [ ] **Step 1: Run Vite Build Check**
```bash
npm run build
```
Expected: Zero build errors, clean asset output in `dist/`.

- [ ] **Step 2: Run Oxlint / Code Quality Check**
```bash
npm run lint
```
Expected: Clean lint passes with no syntax or import errors.

- [ ] **Step 3: Final Commit & Summary**
```bash
git commit -m "chore: complete Cyber-HUD UI overhaul and validation"
```
