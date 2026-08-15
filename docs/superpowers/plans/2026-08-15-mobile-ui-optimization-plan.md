# Mobile-First UI/UX Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive Mobile-First UI/UX optimization across all 11 learning modes, story reader, navigation, and settings, ensuring a native app-like experience on smartphone screens (360px – 430px).

**Architecture:** Responsive CSS design tokens, dynamic viewport units (`100dvh`), safe-area insets (`env(safe-area-inset-bottom)`), minimum 44px touch targets, mobile keyboard attribute tuning (`inputMode`, `autoCapitalize`), and thumb-zone ergonomic layouts.

**Tech Stack:** React 19, Vite, Vanilla CSS / Tailwind utilities, Lucide React icons, Web Speech API.

---

## Global Constraints

- Retain existing desktop & tablet layouts using responsive media queries (`@media (min-width: 640px)`, `@media (min-width: 768px)`).
- Ensure all interactive elements have at least 44px x 44px touch hitbox on mobile devices.
- Prevent horizontal page overflow (`overflow-x: hidden`) across all viewports.
- Maintain Cyberpunk Neon aesthetic and theme switching compatibility.
- Ensure `npm run build` passes with zero errors.

---

## Task Breakdown

### Task 1: Global Mobile Foundations & CSS Enhancements
**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`

- [ ] **Step 1: Add safe-area insets, 100dvh, tap highlight removal, and touch momentum styles**
- [ ] **Step 2: Optimize `.match-grid`, `.letter-slot`, `.letter-block` responsive scaling with clamp()**
- [ ] **Step 3: Refine mobile navigation header and gamification stats layout**

### Task 2: Study & Game Modes Touch & Keyboard Optimization
**Files:**
- Modify: `src/pages/SwipeMode.jsx`
- Modify: `src/pages/TypingMode.jsx`
- Modify: `src/pages/GuessMode.jsx`
- Modify: `src/pages/ListeningMode.jsx`
- Modify: `src/pages/AssembleMode.jsx`

- [ ] **Step 1: Enhance SwipeMode with fit-to-viewport height and thumb action bar**
- [ ] **Step 2: Update TypingMode with mobile inputMode, anti-autocapitalize, and keyboard-safe layout**
- [ ] **Step 3: Optimize GuessMode, ListeningMode, and AssembleMode mobile card layouts**

### Task 3: Story Reader & Voice Settings Mobile Experience
**Files:**
- Modify: `src/pages/StoryReader.jsx`
- Modify: `src/components/VoiceSettings.css`

- [ ] **Step 1: Enhance StoryReader typography, word popover positioning, and narration player safe-area**
- [ ] **Step 2: Polish VoiceSettings bottom sheet drawer on mobile**

### Task 4: Build Verification & Mobile UI Testing
**Files:**
- Build: `npm run build`

- [ ] **Step 1: Run `npm run build` to verify production build passes**
- [ ] **Step 2: Create walkthrough artifact**
