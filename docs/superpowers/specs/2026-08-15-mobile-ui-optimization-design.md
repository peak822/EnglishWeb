# Mobile-First UI/UX Optimization Design Specification

**Author:** Antigravity AI  
**Date:** 2026-08-15  
**Scope:** Complete Mobile-First UI/UX Polish across all pages, study modes, interactive components, and settings for the English Study Web application.

---

## 1. Overview & Goals

The English Study Web application contains 11 learning/game modes, interactive story reader, POS grammar guide, and settings. This specification details the comprehensive mobile responsiveness, touch ergonomics, safe area handling, keyboard interactions, and responsive scaling required to give smartphones (360px – 430px) a native mobile app feel.

---

## 2. Global Mobile Foundations

### 2.1 Viewport & Safe Areas
- Use `100dvh` (Dynamic Viewport Height) to prevent layout jumps when mobile address bars expand or collapse.
- Add `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to navbar, footer, sticky audio controls, and modal bottom sheets for notched devices (iPhone notch/Dynamic Island, Android gestures).
- Prevent accidental horizontal overflow with strict `overflow-x: hidden` and `max-w-full`.

### 2.2 Touch Ergonomics & Feedback
- Set minimum touch target size to `44px x 44px` for all interactive elements, letter blocks, quiz option buttons, and controls.
- Disable default mobile tap highlight grey boxes: `-webkit-tap-highlight-color: transparent`.
- Add tactile visual spring transitions: `active:scale-[0.97]` and smooth feedback for taps.
- Smooth iOS inertial momentum scrolling: `-webkit-overflow-scrolling: touch`.

---

## 3. Mode-by-Mode Mobile Enhancements

### 3.1 Swipe Mode (`SwipeMode.jsx`)
- **Card Sizing:** Dynamic card height constrained to fit viewport without scrolling (`height: clamp(340px, 58vh, 460px)`).
- **Pointer Drag:** `touch-action: pan-y` on card container to prevent page scroll collision while swiping horizontally.
- **Thumb Action Bar:** Floating bottom buttons for "❌ Don't Know", "🔊 Listen", "✔️ Know" placed in comfortable thumb reach zone with large touch hitboxes.

### 3.2 Memory Match Mode (`MatchMode.jsx`)
- **Grid Layout:** 3-column layout on mobile with flexible gap (`gap: 0.5rem`).
- **Typography Scaling:** Thai translation text scaled dynamically with ellipsis / multi-line centering to prevent overflow.
- **Flip Speed:** Responsive 3D transform timing optimized for 60fps mobile hardware rendering.

### 3.3 Assemble & Syntax Modes (`AssembleMode.jsx`, `SyntaxMode.jsx`)
- **Dynamic Letter Slots:** Slots and letter blocks scale dynamically using `clamp(28px, 8vw, 48px)` so words with 8-12 letters fit cleanly on screen without awkward row breakage.
- **Touch Targets:** Word chips and letter blocks maintain sufficient padding for accurate finger tapping.

### 3.4 Typing Mode (`TypingMode.jsx`)
- **Mobile Keyboard Attributes:**
  - `inputMode="text"`
  - `autoCapitalize="none"`
  - `autoCorrect="off"`
  - `spellCheck="false"`
- **Viewport Layout:** Position word prompt and input field in the top half of the screen to remain clearly visible above the virtual keyboard.
- **Quick Action:** Add an accessible "Skip / Show Answer" tap button.

### 3.5 Guess, Listening & Context Modes (`GuessMode.jsx`, `ListeningMode.jsx`, `ContextMode.jsx`)
- **Stacked Options:** 4 option choices render as full-width vertical stack cards for effortless one-handed tapping.
- **Audio Hitbox:** Large, centered speaker button with pulsing ring for quick audio playback.

### 3.6 Interactive Story Reader (`StoryReader.jsx`)
- **Typography:** Story text rendered with readable font size (`1.15rem / 18px`) and generous line height (`1.85`).
- **Smart Word Popover:** Word lookup popover positioned smoothly with boundary detection to prevent clipping at mobile viewport edges.
- **Bottom Narration Bar:** Sticky audio player bar positioned above the bottom safe-area margin.

### 3.7 Parts of Speech Guide & Quiz (`POSGuide.jsx`, `POSMode.jsx`)
- **Filter Tabs:** Horizontal swipeable category pill bar with smooth snap and hidden scrollbars.
- **Example Cards:** Card padding adjusted for mobile screens (`p-4`) with clear visual hierarchy.

### 3.8 Voice Settings Drawer (`VoiceSettings.jsx`)
- **Mobile Sheet:** Renders as a sleek Bottom Sheet / Modal with blurred backdrop, large sliders for pitch/speed, and prominent test button.

---

## 4. Verification & Testing Criteria
- Tested on standard mobile viewport widths (360px, 375px, 390px, 414px, 430px).
- Zero horizontal scrolling or clipped text.
- All game modes fully playable with one hand.
- Production build compiles cleanly with `npm run build`.
