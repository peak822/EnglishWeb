# Home Page Difficulty Grouping Design

## Objective
To reorganize the game modes on the Home page (`Home.jsx`) into clear difficulty categories based on cognitive load, making it easier for users (especially new ones) to understand the learning path and choose an appropriate mode.

## Architecture & Data Flow
- **Data Structure Changes:** We will categorize the existing `modes` array in `Home.jsx` into three distinct arrays or grouped objects, each representing a difficulty level.
- **UI Changes:** The `mode-grid` will be divided into three distinct sections. Each section will have its own header (e.g., "🌱 Starter", "🚀 Intermediate", "🔥 Advanced") and a brief description.

## Component Details

### `Home.jsx`
- The unified `modes` array will be replaced by a structured grouping:
  - **Starter (เริ่มต้น):** 
    - `Read`: No fail condition, exploratory learning.
    - `Guess`: Multiple choice, high hinting.
  - **Intermediate (ระดับกลาง):**
    - `SRS`: Memory recall with flashcards.
    - `Assemble`: Unscrambling with letter hints.
    - `Context`: Fill-in-the-blank with multiple choice.
  - **Advanced (ระดับท้าทาย):**
    - `Typing`: Exact spelling from memory.
    - `Syntax`: Full sentence construction and grammar.

- **Layout Structure:**
  ```jsx
  <section className="mt-16">
    <h2 className="text-center mb-2">Select a Learning Mode</h2>
    
    {/* Starter Section */}
    <div className="difficulty-section mb-12">
      <h3 className="section-title text-[var(--color-primary)] flex items-center gap-2">🌱 Starter <span className="text-sm font-normal text-[var(--color-neutral)]">เรียนรู้และจดจำ</span></h3>
      <div className="mode-grid">
         {/* Map Starter modes here */}
      </div>
    </div>

    {/* Intermediate Section */}
    {/* ... similar structure ... */}

    {/* Advanced Section */}
    {/* ... similar structure ... */}
  </section>
  ```

### `App.css` (or `index.css`)
- Add minor styling for the new `difficulty-section` and `section-title` to ensure there is adequate spacing (`mb-12`) and clear visual hierarchy (e.g., borders or subtle background tint per section if needed, but keeping it aligned with the premium aesthetic).

## Error Handling & Edge Cases
- **Responsive Design:** Ensure the grid still collapses gracefully on mobile devices, maintaining the section headers above their respective grids.
- **State Integrity:** Routing paths (`/typing`, `/guess`, etc.) and icons will remain exactly the same to prevent breaking existing functionality.

## Verification & Testing
- Verify that clicking each mode card correctly navigates to its respective path.
- Visually verify that the spacing between sections does not feel cluttered.
- Check mobile view to ensure headers and cards align properly.
