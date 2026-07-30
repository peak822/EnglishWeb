# Story Level Categories Design

## 1. Goal Description

The goal is to update the "Short Story Reading" page (`src/pages/StorySelection.jsx`) to group stories by difficulty levels (A1, A2, B1, B2). Instead of showing all stories immediately, the user will first select a difficulty level from 4 large category cards. Once a level is selected, only the stories for that level will be displayed.

## 2. Approach

We will implement the "Category Cards View" approach:
- **Initial State:** The page displays 4 large cards corresponding to the levels: A1, A2, B1, and B2. No story cards are shown.
- **Category Selection:** When the user clicks on one of the level cards, the view transitions to show only the stories that belong to the selected level.
- **Navigation:** When viewing stories for a specific level, a "<- Back to Levels" button will be displayed at the top to allow the user to return to the category selection view. The "Back to Home" button will remain at the bottom of the page.

## 3. UI/UX Details

### 3.1. Category Selection View
- A grid of 4 cards for A1, A2, B1, and B2.
- Each card will have:
  - An icon indicating the level (e.g., using `lucide-react` icons).
  - A title (e.g., "A1 Beginner", "A2 Elementary", "B1 Intermediate", "B2 Upper Intermediate").
  - Distinct styling (using existing `hover-glow` and `ui-card` classes) to make them look clickable and visually appealing.

### 3.2. Story List View
- Filtered list of story cards based on the selected level.
- A "<- Back to Levels" button at the top, styled consistently with the application's UI (e.g., secondary button style).

## 4. Technical Implementation

- **State Management:** Add a state variable `selectedLevel` to `src/pages/StorySelection.jsx` (initial value: `null`).
- **Data Filtering:** When `selectedLevel` is set, filter `storiesData` based on the story's level.
- **Conditional Rendering:** Render either the category cards or the filtered story cards based on the value of `selectedLevel`.

## 5. Scope and Considerations

- This change only affects the `StorySelection.jsx` page.
- It leverages existing data in `storiesData` and existing UI components (`Card`).
- The transition between views will be instant (standard React state update).

