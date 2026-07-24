import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { filterWords, THEMES } from '../hooks/useCategories';

const TypingMode = () => {
  const { addExp } = useGamification();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect, revealed
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    let result = filterWords(vocabularyData, level);
    result = [...result].sort(() => 0.5 - Math.random());
    setWords(result);
    setCurrentIndex(0);
    setInput('');
    setStatus('idle');
    setWrongCount(0);
    setShowHint(false);
    setIsLoaded(true);
  }, [level]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (words[currentIndex]) {
      const w = words[currentIndex].word;
      setHintText(w.split('').sort(() => 0.5 - Math.random()).join(' '));
    }
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];

  const handleInputChange = (e) => {
    if (status === 'revealed') return;

    const val = e.target.value.toLowerCase();
    setInput(val);
    
    // Auto-advance if the typed word is exactly correct
    if (currentWord && val.trim() === currentWord.word.toLowerCase()) {
      setStatus('correct');
      if (status !== 'revealed') {
        addExp(10);
      }
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setWrongCount(0);
        setShowHint(false);
      }, 1000);
    } else if (status !== 'incorrect' && status !== 'revealed') {
      setStatus('idle');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWord || status === 'revealed' || status === 'correct') return;

    if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setStatus('correct');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setWrongCount(0);
        setShowHint(false);
      }, 1500);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      if (newWrongCount >= 3) {
        setStatus('revealed');
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setInput('');
          setStatus('idle');
          setWrongCount(0);
          setShowHint(false);
        }, 2500);
      } else {
        setStatus('incorrect');
        setTimeout(() => {
          setStatus(prev => prev === 'incorrect' ? 'idle' : prev);
        }, 800);
      }
    }
  };

  if (!isLoaded) {
    return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Typing Mode</h2>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="level-select"
          >
            <option value="all">All Words</option>
            <optgroup label="Difficulty Levels">
              <option value="A1">A1 (Beginner)</option>
              <option value="A2">A2 (Elementary)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper Intermediate)</option>
            </optgroup>
            <optgroup label="Learning Themes">
              {THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{words.length > 0 ? currentIndex + 1 : 0} / {words.length}</span>
          </div>
          <div className="stat-item">
            <span>Level</span>
            <span className="stat-value">{currentWord ? currentWord.level : '-'}</span>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="text-center py-16">
            <h3 className="text-xl text-[var(--color-neutral)]">No words available for this level.</h3>
          </Card>
        ) : (
          <Card className="text-center py-16 relative overflow-hidden">
            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
            )}
            
            <div className="relative z-10">
              <div className="word-type">{currentWord.type}</div>
              
              <div className="font-mono text-2xl mb-10 text-[var(--color-primary)] opacity-80" style={{ letterSpacing: '0.2em' }}>
                {status === 'correct' || status === 'revealed' ? 
                  currentWord.word : 
                  currentWord.word.charAt(0) + '_'.repeat(currentWord.word.length - 2) + (currentWord.word.length > 1 ? currentWord.word.charAt(currentWord.word.length - 1) : '')
                }
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className={`typing-input ${
                    status === 'incorrect' ? 'error shake' : 
                    status === 'correct' ? 'success' : ''
                  }`}
                  placeholder="Type word..."
                  autoComplete="off"
                  disabled={status === 'revealed' || status === 'correct'}
                />
                <Button type="submit" variant="primary" className="w-64 mt-2" disabled={status === 'revealed' || status === 'correct'}>
                  Submit Answer
                </Button>
              </form>

              {status === 'revealed' && (
                <div className="mt-4 text-red-400 font-semibold animate-fade-up">
                  Skipping to next word...
                </div>
              )}

              {showHint && status !== 'revealed' && status !== 'correct' && (
                <div className="mt-6 text-[var(--color-neutral)] text-sm animate-fade-up bg-[rgba(255,255,255,0.05)] py-2 px-4 rounded-lg inline-block">
                  Hint (Scrambled): <span className="font-mono text-[var(--color-secondary)] tracking-widest ml-2">{hintText}</span>
                </div>
              )}
              
              {!showHint && status !== 'revealed' && status !== 'correct' && (
                <button 
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="mt-8 text-btn"
                >
                  Need a hint?
                </button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TypingMode;
