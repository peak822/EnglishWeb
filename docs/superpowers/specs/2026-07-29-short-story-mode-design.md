# Short Story Reading Mode — Design Spec

## Overview
A new learning mode inside "The Library" category where users can practice reading comprehension. The mode provides short English stories with an interactive mechanic: users can click on any word in the text to instantly see its translation, part of speech, and pronunciation.

## UI Structure

### 1. Story Selection Page (`/story-mode`)
- **Layout**: A grid of cards similar to the main Home page.
- **Card Content**:
  - Story Title
  - Genre / Theme (e.g., Sci-Fi, Daily Life, Adventure)
  - Difficulty Level (A1, A2, B1, etc.)
  - Estimated reading time (e.g., "🕒 3 mins")
- **Interaction**: Clicking a card navigates to the Reading View for that specific story.

### 2. Interactive Reading View (`/story-mode/:id`)
- **Header**: Story title, level, and a "Back" button to return to the selection page.
- **Content Area**: 
  - The story text displayed with large, readable typography.
  - **Interactive Words**: Every word in the story is wrapped in a clickable element (e.g., `<span>`).
  - **Target Vocabulary (Optional)**: Specific words meant to be learned in this story can be slightly highlighted (e.g., a subtle dashed underline) to draw attention.
- **Word Lookup Popup (Tooltip/Modal)**:
  - When a user clicks a word, the app cleans the string (removes punctuation like `,`, `.`, `!`).
  - It searches the `vocabulary.json` database.
  - If found, a popup appears showing:
    - The word
    - Part of Speech (type)
    - Thai Meaning
    - Audio button to play pronunciation (using `speechSynthesis`)
  - If not found in the Oxford 3000 list, the popup can show a fallback message or do a simple translation if we had an API (for now, just a message like "Word not in core vocabulary").

## Data Architecture

### Static Story Data (`src/data/stories.json`)
An array of story objects:
```json
[
  {
    "id": "story-1",
    "title": "The Neon City",
    "genre": "Sci-Fi",
    "level": "A2",
    "readTime": "2 mins",
    "content": "The city was dark, but the neon lights shone brightly...",
    "targetWords": ["neon", "brightly", "dark"]
  }
]
```

## Integration
- **Route**: Add `<Route path="/story-mode" element={<StorySelection />} />` and `<Route path="/story-mode/:id" element={<StoryReader />} />` to `App.jsx`.
- **Home Page**: Add a card for this mode in the "starterModes" or "intermediateModes" array (will place it in The Library section next to ReadMode and POSGuide).
