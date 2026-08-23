# Cyber-HUD & Neural Terminal UI Design Spec

**Date:** 2026-08-23  
**Status:** Approved  
**Topic:** English Study Web - Next-Generation Cyber-HUD & Neural Terminal UI/UX Overhaul  

---

## 1. Overview & Vision
Transform **English Study Web** from a traditional web application into an immersive, state-of-the-art **"Cyber-HUD / Neural Terminal" (Sci-Fi Neuro-Link Interface)**. The interface presents English learning as an advanced cybernetic training simulation with tactile 3D holographic components, dynamic Web Audio sound synthesis, keyboard-first HUD command operations, structured mission sectors, and interactive gamified feedback.

---

## 2. Core Architectural Pillars

### 2.1 Design System & Aesthetic Foundation
* **Color Palette & Themes:**
  * Cyberpunk Neon Dark mode as primary foundation (`#050512` void background, `#00ffff` cyber cyan, `#ff00ff` neon magenta, `#ffb700` warning amber, `#00ff66` matrix green).
  * High-contrast glassmorphism with frosted borders (`rgba(0, 255, 255, 0.15)` to `0.3`).
* **Chamfered Tech-Brackets (`[ ]` Corner Accents):**
  * Reusable CSS utilities & SVG micro-brackets at the corners of cards, hero containers, and modal dialogs.
* **3D Holographic Card & Tilt Physics (`HoloCard` Component):**
  * Interactive CSS 3D perspective (`rotateX`, `rotateY`) reacting smoothly to pointer coordinates with an iridescent light-sweep overlay (foil sheen gradient).
* **Typography & HUD Data Tags:**
  * Monospaced coordinates, status blips, and tactical badges (`Orbitron`, `JetBrains Mono` font pairing).

---

### 2.2 Built-in Cyber Sound Engine (`useCyberSound.js`)
* **Zero External Audio Files:** Synthesizes clean, high-tech micro-audio directly in the browser via native **Web Audio API**.
* **Sound Primitives:**
  * `hover`: High-frequency subtle chirp (sine wave 1200Hz -> 1800Hz, 35ms duration, ultra-low gain).
  * `click`: Crisp mechanical relay tick (band-pass filtered square wave + decay).
  * `success`: Dual-tone harmonized chime (587Hz D5 + 880Hz A5, smooth exponential decay).
  * `combo`: Rising synth arpeggio based on current streak count.
  * `levelUp`: Resonant Sci-Fi energy burst chord.
* **Mute / Audio Toggle:** Top navigation bar toggle with persistent state saved in `localStorage`.

---

### 2.3 HUD Command Palette (`CommandPalette.jsx` / `Ctrl+K`)
* Global floating HUD Terminal modal triggered by `Ctrl+K` (or `Cmd+K` on macOS) or by clicking the HUD shortcut button.
* **Capabilities:**
  * Instant navigation to any study sector / mode (`/typing`, `/assemble`, `/guess`, `/read`, `/listen`, `/context`, `/syntax`, `/match`, `/swipe`, `/pos`, `/pos-guide`, `/story-mode`).
  * Quick search for vocabulary definitions and IPA pronunciations.
  * Quick settings toggle (Audio Mute/Unmute, Theme switcher, CEFR level switch).
  * Keyboard navigation with arrow keys and `Enter`.

---

### 2.4 Navigation Bar & Energy Core Shell (`App.jsx` & Nav Styles)
* **Glass Visor Bar:** Sleek semi-transparent top header with cybernetic boundary glow.
* **Energy Core EXP Gauge:** Redesigned level/EXP bar styled as a glowing Sci-Fi reactor / power cell with pulsating animation on EXP gain.
* **Quick Access HUD Controls:** Theme selector, Audio toggle, and Command Palette quick-launcher.

---

### 2.5 Home "Mission Control & Neural Hub" (`Home.jsx`)
* **Hero Mission Status:**
  * System online terminal banner (`SYSTEM OPERATIONAL // PROTOCOL ACTIVE`).
  * Cyber Streak Battery displaying consecutive practice days.
  * One-click "RESUME LAST PROTOCOL" button jumping directly to the user's most recent training mode.
* **CEFR Clearance Level Matrix:**
  * Redesigned level selector styled as Security Clearance badges (A1 Explorer to C1 Master) with word count statistics and active indicator glow.
* **4-Sector Holographic Training Matrix:**
  * **Sector Alpha: Core Combat** (Typing, Assemble, Guess, Read).
  * **Sector Beta: Sensory & Reflex** (Listening, Match, Swipe).
  * **Sector Gamma: Deep Linguistics** (Syntax Tree, POS Tagging, POS Guide, Context).
  * **Sector Delta: Holo-Simulations** (Story Mode with interactive stories).
  * Each mode card includes 3D tilt, EXP reward badges (e.g. `+15 EXP / WORD`), and tech-bracket styling.
* **Daily Neural Directives Widget:**
  * Daily goal progress bar with bonus EXP rewards upon completion.

---

### 2.6 Learning Modes HUD Integration
* **Universal Mode Shell:** Standardized container with tech-bracket corners, streak multiplier tracker (`x2`, `x3`, `x5`, `x10` combo surge), and keyboard shortcut helpers.
* **Mode Enhancements:**
  * **Typing Mode:** Realtime WPM speed gauge and accuracy tracker HUD.
  * **Assemble & Match:** Magnetic snapping blocks with crisp lock sound effects.
  * **Syntax & POS:** Neon semantic token pills and glowing syntax tree branches.
  * **Story Mode:** Cyberpunk Holo-reader layout with word inspect popup HUD.
* **Mission Debrief Modal:**
  * Holographic end-of-session summary screen featuring rolling EXP counters, accuracy letter grades (S/A/B/C), and tactical next-step buttons.

---

## 3. Implementation Modules & File Structure

```
src/
├── utils/
│   └── cyberSound.js             # Web Audio API sound synthesizer engine
├── hooks/
│   └── useCyberSound.js          # React hook for audio triggers and mute state
├── components/
│   ├── HoloCard.jsx              # 3D Tilt + Foil Sheen wrapper component
│   ├── CommandPalette.jsx        # Ctrl+K HUD Command Palette & Quick Jump
│   ├── MissionDebriefModal.jsx   # Sci-Fi victory/summary modal component
│   └── TechBracket.jsx           # Reusable Sci-Fi corner bracket overlay
├── pages/
│   ├── Home.jsx                  # Overhauled Mission Control Hub
│   └── [All Mode Pages]          # HUD container integration & sound triggers
├── App.jsx                       # Nav visor, audio provider, command palette integration
├── App.css                       # Global HUD layout styles & visor styling
└── index.css                     # Chamfered tech-brackets, scanlines, neon animations
```

---

## 4. Verification & Testing Strategy
1. **Audio Synthesis Tests:** Verify Web Audio API works seamlessly across browsers without latency, and respect the mute toggle and user gesture policies.
2. **Interactive 3D Tilt Performance:** Ensure smooth 60fps transform transitions on both mouse and touch devices without causing layout reflows.
3. **Command Palette Functional Tests:** Verify `Ctrl+K` shortcut, fuzzy search for modes and words, keyboard navigation (`Up`/`Down`/`Enter`/`Esc`), and mobile tap triggers.
4. **Responsive Layout Verification:** Validate that all HUD frames, cockpit grids, and sector cards collapse cleanly on mobile viewports (<768px).
5. **No Regressions on Core Gamification:** Confirm level calculations, badge rewards, and localStorage persistence remain 100% operational.
