# Listening Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Listening Mode" (ทายคำจากการฟัง) where users hear an English word via Web Speech API and select the correct spelling from 4 options.

**Architecture:** A new React component `ListeningMode.jsx` will be created using standard hooks (`useGamification`, `useCategories`). It will use `window.speechSynthesis` for audio and share the distractor filtering logic of `GuessMode.jsx`.

**Tech Stack:** React, Web Speech API, Tailwind-like custom CSS classes.

## Global Constraints

- No external testing frameworks (no test script in package.json), verify via `npm run build` and `npm run lint`.
- UI must follow the established theme (frosted glass, `var(--color-primary)`, `glitch-hover`, etc.).
- Distractors must not share the exact same Thai meaning as the target word.

---

### Task 1: Create ListeningMode Component

**Files:**
- Create: `src/pages/ListeningMode.jsx`

**Interfaces:**
- Consumes: `useGamification`, `filterWords` from `useCategories`, `vocabularyData` from `vocabulary.json`
- Produces: The main UI component for the `/listen` route.

- [ ] **Step 1: Write the ListeningMode.jsx component**

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import LevelSelector from '../components/LevelSelector';
import { useGamification } from '../hooks/useGamification';
import { filterWords } from '../hooks/useCategories';
import vocabularyData from '../data/vocabulary.json';

const ListeningMode = () => {
  const navigate = useNavigate();
  const { addExp } = useGamification();
  const [level, setLevel] = useState('all');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let result = filterWords(vocabularyData, level);
    result = [...result].sort(() => 0.5 - Math.random());
    setWords(result);
    setCurrentIndex(0);
    setIsLoaded(true);
  }, [level]);

  useEffect(() => {
    if (words.length > 0 && words[currentIndex]) {
      generateOptions();
      setStatus('idle');
      setSelectedOption(null);
    }
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];

  const playAudio = () => {
    if (!currentWord) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateOptions = () => {
    const correctWord = words[currentIndex];
    
    // Ensure we don't pick distractors that have the exact same meaning
    let pool = words.filter(w => w.word !== correctWord.word && w.type === correctWord.type && w.level === correctWord.level && w.meaning !== correctWord.meaning);
    
    if (pool.length < 3) {
      pool = vocabularyData.filter(w => w.word !== correctWord.word && w.type === correctWord.type && w.meaning !== correctWord.meaning);
    }
    if (pool.length < 3) {
      pool = vocabularyData.filter(w => w.word !== correctWord.word && w.meaning !== correctWord.meaning);
    }
    
    const uniquePoolMap = new Map();
    pool.forEach(w => uniquePoolMap.set(w.word, w));
    const uniquePool = Array.from(uniquePoolMap.values());
    
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    pool = shuffleArray(uniquePool).slice(0, 3);
    const newOptions = shuffleArray([...pool.map(w => w.word), correctWord.word]);
    setOptions(newOptions);
  };

  const handleGuess = (guess) => {
    if (status !== 'idle') return;
    setSelectedOption(guess);

    if (guess === currentWord.word) {
      setStatus('correct');
      addExp(10);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2500);
    } else {
      setStatus('incorrect');
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (!isLoaded) return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;

  if (!currentWord && words.length > 0 && currentIndex >= words.length) {
    return (
      <div className="container animate-fade-up text-center py-20">
        <h2 className="text-gradient text-4xl mb-4">Amazing Job! 🎉</h2>
        <button onClick={() => window.location.href = '/'} className="ui-btn ui-btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Listening Mode</h2>
          <div className="w-48 sm:w-64 z-50">
            <LevelSelector value={level} onChange={setLevel} />
          </div>
        </div>

        <div className="game-stats justify-center">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{words.length > 0 ? currentIndex + 1 : 0} / {words.length}</span>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="text-center py-16"><h3 className="text-xl text-[var(--color-neutral)]">No words available.</h3></Card>
        ) : (
          <Card className="text-center py-16 relative overflow-hidden">
            {status === 'correct' && <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />}

            <div className="relative z-10 flex flex-col items-center w-full">
              {status === 'correct' ? (
                <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.5s ease-out forwards', width: '100%' }}>
                  <h3 className="srs-title" style={{ color: '#fff' }}>{currentWord.word}</h3>
                  <p className="srs-ipa">/{currentWord.ipa || 'no ipa'}/</p>
                  <div className="srs-meaning-box" style={{ border: '1px solid var(--color-accent)' }}>
                    <p className="srs-meaning">{currentWord.meaning || 'No translation available'}</p>
                  </div>
                  <p style={{ marginTop: '2rem', color: '#4ade80', fontWeight: 'bold', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Correct! +10 EXP</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl mb-4 text-[var(--color-neutral)] font-medium">Listen and guess the word:</h3>
                  
                  <button 
                    onClick={playAudio}
                    className="flex flex-col items-center justify-center rounded-full mb-10 transition-transform hover:scale-105 active:scale-95"
                    style={{ 
                      width: '120px', height: '120px', 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid var(--color-primary)',
                      boxShadow: '0 0 20px rgba(0,255,255,0.2), inset 0 0 20px rgba(0,255,255,0.1)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    <Volume2 size={48} className="animate-pulse" />
                    <span className="mt-2 text-sm font-bold opacity-80">PLAY</span>
                  </button>

                  <div className={`options-grid w-full ${status === 'incorrect' ? 'shake' : ''}`}>
                    {options.map((opt, i) => {
                      let statusClass = '';
                      if (status === 'correct' && opt === currentWord.word) statusClass = 'correct-ans';
                      if (status === 'incorrect' && opt === selectedOption) statusClass = 'incorrect-ans';
                      
                      return (
                        <button key={i} className={`option-btn ${statusClass}`} onClick={() => handleGuess(opt)}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="h-8 mt-6 w-full flex items-center justify-center">
                    {status === 'incorrect' && <p className="text-red-400 font-semibold animate-fade-up">Incorrect! Try again...</p>}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ListeningMode;
```

- [ ] **Step 2: Check formatting with oxlint**
Run: `npm run lint`
Expected: 0 errors (warnings are fine).

### Task 2: Route and Home Page Integration

**Files:**
- Modify: `src/App.jsx:1-50`
- Modify: `src/pages/Home.jsx:25-50`

**Interfaces:**
- Consumes: `ListeningMode.jsx`

- [ ] **Step 1: Add Route in App.jsx**
Add `import ListeningMode from './pages/ListeningMode';` and `<Route path="/listen" element={<ListeningMode />} />` into the `Routes` block.

- [ ] **Step 2: Add Entry in Home.jsx**
In `Home.jsx`, find `const starterModes = [...]` and append:
```jsx
    {
      id: 'listen',
      title: 'ทายคำจากการฟัง',
      description: 'Listen to the word and guess its spelling and meaning.',
      icon: <Volume2 size={32} />,
      path: '/listen',
      color: '#4ade80' // Green
    }
```
Make sure `Volume2` is imported from `lucide-react`.

- [ ] **Step 3: Run Build to verify code compiles**
Run: `npm run build`
Expected: Successful build, no syntax errors.

- [ ] **Step 4: Commit**
```bash
git add src/App.jsx src/pages/Home.jsx src/pages/ListeningMode.jsx
git commit -m "feat: implement Listening Mode"
```
