# Reading Mode Audio Pronunciation

## Overview
Add an audio pronunciation button to the vocabulary table in `ReadMode.jsx`. This button will allow users to hear the English pronunciation of each vocabulary word using the browser's built-in Web Speech API, without requiring any external dependencies or API keys.

## Architecture & Data Flow
1. **Audio Engine:** `window.speechSynthesis` (Web Speech API).
2. **Logic (`playAudio` function):** 
   - Accepts a `word` string.
   - Cancels any currently playing speech to prevent overlap (`window.speechSynthesis.cancel()`).
   - Creates a new `SpeechSynthesisUtterance(word)`.
   - Sets the language to `en-US` or `en-GB`.
   - Calls `window.speechSynthesis.speak()`.
3. **Component Updates (`ReadMode.jsx`):**
   - Import the `Volume2` icon from `lucide-react`.
   - Add a new column header `<th></th>` (empty text, just for the button) at the end of the `<thead>`.
   - Add a new cell `<td>` at the end of each row.
   - Inside the cell, render a `<button>` containing the `Volume2` icon.
   - Attach `onClick={() => playAudio(word.word)}` to the button.

## User Interface
- **Icon:** `Volume2` from `lucide-react`, size 20.
- **Button Styling:** Transparent background, primary/accent color on hover, cursor pointer. The button will be horizontally aligned with the other text in the row.
- **Location:** The far-right column of the table.

## Edge Cases & Error Handling
- **Missing API Support:** If a very old browser doesn't support `window.speechSynthesis`, the button should either gracefully do nothing or be hidden. We will add a quick check `if ('speechSynthesis' in window)` before calling the API.
- **Overlapping Clicks:** Addressed by calling `.cancel()` before speaking a new word.

## Self-Review
1. Placeholder scan: Clean.
2. Internal consistency: The UI matches the logic.
3. Scope check: Extremely focused feature.
4. Ambiguity check: Clear.
