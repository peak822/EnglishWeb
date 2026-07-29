import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { filterWords, THEMES } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';

const TypingMode = () => {
  const { addExp } = useGamification();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect, revealed
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setWrongCount(0);
        setShowHint(false);
      }, 3500);
    } else if (status !== 'incorrect' && status !== 'revealed') {
      setStatus('idle');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWord || status === 'revealed' || status === 'correct') return;

    if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setStatus('correct');
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setWrongCount(0);
        setShowHint(false);
      }, 3500);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      if (newWrongCount >= 3) {
        setStatus('revealed');
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setInput('');
          setStatus('idle');
          setWrongCount(0);
          setShowHint(false);
        }, 3500);
      } else {
        setStatus('incorrect');
        timeoutRef.current = setTimeout(() => {
          setStatus(prev => prev === 'incorrect' ? 'idle' : prev);
        }, 800);
      }
    }
  };

  if (!isLoaded) {
    return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  if (!currentWord && words.length > 0 && currentIndex >= words.length) {
    return (
      <div className="container animate-fade-up text-center py-20">
        <h2 className="text-gradient text-4xl mb-4">Amazing Job! 🎉</h2>
        <p className="text-[var(--color-neutral)] text-lg mb-8">You have completed all available words in this level!</p>
        <button onClick={() => window.location.href = '/'} className="ui-btn ui-btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Typing Mode</h2>
          <div className="w-48 sm:w-64 z-50">
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
          </div>
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
          <Card className="text-center py-8 md:py-16">
            <h3 className="text-xl text-[var(--color-neutral)]">No words available for this level.</h3>
          </Card>
        ) : (
          <Card className="text-center py-8 md:py-16 relative overflow-hidden">
            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
            )}
            
            <div className="relative z-10">
              <div className="word-type">{currentWord.type}</div>
              
              <div className="text-2xl mb-10 text-[var(--color-primary)] font-bold px-4">
                {status === 'correct' || status === 'revealed' ? 
                  <span className="font-mono" style={{ letterSpacing: '0.2em' }}>{currentWord.word}</span> : 
                  currentWord.meaning
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

              {(status === 'correct' || status === 'revealed') && (
                <div className="mt-8 animate-fade-up text-center p-6 bg-[rgba(255,255,255,0.05)] rounded-[var(--radius-md)] border border-[rgba(0,255,255,0.2)]" style={{ width: '100%', maxWidth: '400px' }}>
                  <h3 className="text-2xl font-bold text-[var(--color-accent)] mb-2">{currentWord.meaning}</h3>
                  <p className="font-mono text-[var(--color-neutral)] opacity-80">/{currentWord.ipa || 'no ipa'}/</p>
                  <p className={`mt-4 font-semibold text-sm ${status === 'correct' ? 'text-[var(--color-primary)]' : 'text-red-400'}`}>
                    {status === 'correct' ? 'Correct! Moving to next word...' : 'Skipping to next word...'}
                  </p>
                </div>
              )}

              {showHint && status !== 'revealed' && status !== 'correct' && (
                <div className="mt-6 text-[var(--color-neutral)] text-sm animate-fade-up bg-[rgba(255,255,255,0.05)] py-2 px-4 rounded-lg inline-block">
                  Pronunciation: <span className="font-mono text-[var(--color-secondary)] ml-2">/{currentWord.ipa || currentWord.thai_pronunciation || 'N/A'}/</span>
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
