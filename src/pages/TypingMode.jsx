import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';

const TypingMode = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect, revealed
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [level, setLevel] = useState('all');
  
  const inputRef = useRef(null);

  useEffect(() => {
    let result = [];
    if (level !== 'all') {
      const filtered = vocabularyData.filter(w => w.level === level);
      result = [...filtered].sort(() => 0.5 - Math.random());
    } else {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      levels.forEach(l => {
        const group = vocabularyData.filter(w => w.level === l);
        const shuffledGroup = [...group].sort(() => 0.5 - Math.random());
        result = [...result, ...shuffledGroup];
      });
    }
    setWords(result);
    setCurrentIndex(0);
    setInput('');
    setStatus('idle');
    setWrongCount(0);
    setShowHint(false);
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
    setInput(e.target.value.toLowerCase());
    setStatus('idle');
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

  if (!currentWord) {
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
            <option value="all">All Levels</option>
            <option value="A1">A1 (Beginner)</option>
            <option value="A2">A2 (Elementary)</option>
            <option value="B1">B1 (Intermediate)</option>
            <option value="B2">B2 (Upper Intermediate)</option>
          </select>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{currentIndex + 1} / {words.length}</span>
          </div>
          <div className="stat-item">
            <span>Level</span>
            <span className="stat-value">{currentWord.level}</span>
          </div>
        </div>

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
              />
              <Button type="submit" variant="primary" className="w-64 mt-2">
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
                className="mt-8 text-xs text-[var(--color-neutral)] opacity-40 hover:opacity-100 transition-opacity underline decoration-dotted"
              >
                Need a hint?
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TypingMode;
