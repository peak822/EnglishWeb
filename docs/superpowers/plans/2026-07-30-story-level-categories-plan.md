# Story Level Categories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Group stories by difficulty levels (A1, A2, B1, B2) using category cards instead of showing all stories immediately.

**Architecture:** We will introduce a `selectedLevel` state to `StorySelection.jsx`. If null, it renders 4 large level cards. If a level is selected, it renders a filtered list of stories and a "Back to Levels" button.

**Tech Stack:** React, lucide-react

## Global Constraints

- Use existing CSS classes (e.g., `ui-card`, `hover-glow`, `ui-btn`, `ui-btn-secondary`, `text-gradient`) for styling.
- Keep the component self-contained.

---

### Task 1: Update StorySelection.jsx with State and Conditional Rendering

**Files:**
- Modify: `src/pages/StorySelection.jsx`

**Interfaces:**
- Consumes: `storiesData` from `../data/stories.json`
- Produces: A React component that toggles between category selection and filtered story list.

- [ ] **Step 1: Add `useState` and new icons imports**

Modify the imports at the top of `src/pages/StorySelection.jsx`:

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft, Star, Award, Zap, BookMarked } from 'lucide-react';
import Card from '../components/Card';
import storiesData from '../data/stories.json';
```

- [ ] **Step 2: Add state and category definitions**

Inside the `StorySelection` component, add the state and categories array:

```javascript
const StorySelection = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const categories = [
    { id: 'A1', title: 'A1 Beginner', icon: Star, color: '#4ade80' },
    { id: 'A2', title: 'A2 Elementary', icon: BookOpen, color: '#2dd4bf' },
    { id: 'B1', title: 'B1 Intermediate', icon: Award, color: '#3b82f6' },
    { id: 'B2', title: 'B2 Upper Intermediate', icon: Zap, color: '#8b5cf6' }
  ];

  const filteredStories = selectedLevel 
    ? storiesData.filter(story => story.level.startsWith(selectedLevel))
    : [];
```

- [ ] **Step 3: Render category cards if no level is selected**

Replace the `<div style={{ display: 'grid' ... }}>` block with conditional rendering:

```javascript
      {!selectedLevel ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                style={{ 
                  padding: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem'
                }}
                onClick={() => setSelectedLevel(category.id)}
                className="ui-card hover-glow"
              >
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '50%', 
                  background: `${category.color}20`,
                  color: category.color
                }}>
                  <Icon size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                  {category.title}
                </h3>
              </Card>
            );
          })}
        </div>
      ) : (
```

- [ ] **Step 4: Render filtered stories and back button if a level is selected**

Add the "Back to Levels" button and render the `filteredStories`:

```javascript
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
            <button 
              className="ui-btn ui-btn-secondary"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setSelectedLevel(null)}
            >
              <ArrowLeft size={16} />
              กลับไปเลือกระดับ (Back to Levels)
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {filteredStories.map(story => {
              const levelClass = story.level.charAt(0);
              return (
                <Card 
                  key={story.id} 
                  style={{ 
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  onClick={() => navigate(`/story-mode/${story.id}`)}
                  className="ui-card hover-glow"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-primary)',
                      background: 'rgba(0, 255, 255, 0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {story.genre}
                    </span>
                    <span className={`td-level level-${levelClass}`} style={{ margin: 0, padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                      {story.level}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: 'var(--color-secondary)',
                    marginBottom: '0.5rem',
                    flexGrow: 1
                  }}>
                    {story.title}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--color-neutral)',
                    fontSize: '0.875rem'
                  }}>
                    <Clock size={14} />
                    <span>{story.readTime}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
```

- [ ] **Step 5: Run UI manually to verify**

Run the app `npm run dev` and navigate to `/story-selection`.
Expected: 
1. Page shows 4 large cards (A1, A2, B1, B2).
2. Clicking a card shows the filtered list of stories.
3. Clicking the "Back to Levels" button goes back to the 4 cards.
4. "Back to Home" button at the bottom remains functional.

- [ ] **Step 6: Commit**

```bash
git add src/pages/StorySelection.jsx
git commit -m "feat: add category selection view to short story page"
```
