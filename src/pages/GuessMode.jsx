import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { useGamification } from '../hooks/useGamification';
import { filterWords, THEMES } from '../hooks/useCategories';
import vocabularyData from '../data/vocabulary.json';

const GuessMode = () => {
  const { addExp } = useGamification();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
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
    setIsLoaded(true);
  }, [level]);

  useEffect(() => {
    if (words.length > 0 && words[currentIndex]) {
      generateOptions();
      setStatus('idle');
      setSelectedOption(null);
      setHintLevel(0);
    }
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];

  const generateOptions = () => {
    const correctWord = words[currentIndex];
    
    // Try to get words of the SAME type to make it harder to guess just by grammar
    let pool = words.filter(w => w.word !== correctWord.word && w.type === correctWord.type && w.level === correctWord.level);
    
    // If not enough words of the same type in the same level, expand to all levels but same type
    if (pool.length < 3) {
      pool = vocabularyData.filter(w => w.word !== correctWord.word && w.type === correctWord.type);
    }

    // If STILL not enough words, just get any word
    if (pool.length < 3) {
      pool = vocabularyData.filter(w => w.word !== correctWord.word);
    }
    
    // To make choices more diverse, we ensure they are unique words
    // Remove duplicates from pool just in case
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
      // Calculate EXP based on hints used (10 -> 5 -> 2)
      const expGained = hintLevel === 0 ? 10 : hintLevel === 1 ? 5 : 2;
      addExp(expGained);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2500); // Increased delay for post-answer review
    } else {
      setStatus('incorrect');
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setSelectedOption(null);
      }, 1000);
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
          <h2 className="text-gradient">Guess Mode</h2>
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

        <div className="game-stats justify-center">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{words.length > 0 ? currentIndex + 1 : 0} / {words.length}</span>
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

            <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {status === 'correct' ? (
                <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.5s ease-out forwards', width: '100%' }}>
                  <h3 className="srs-title" style={{ color: '#fff' }}>{currentWord.word}</h3>
                  <p className="srs-ipa">/{currentWord.ipa || 'no ipa'}/</p>
                  <div className="srs-meaning-box" style={{ border: '1px solid var(--color-accent)' }}>
                    <p className="srs-meaning">{currentWord.meaning || 'No translation available'}</p>
                  </div>
                  <p style={{ marginTop: '2rem', color: '#4ade80', fontWeight: 'bold', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Correct! +{hintLevel === 0 ? 10 : hintLevel === 1 ? 5 : 2} EXP</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl mb-8 text-[var(--color-neutral)] font-medium">Guess the word for this meaning:</h3>
                  <div className="flex justify-center w-full px-4" style={{ marginBottom: '3.5rem' }}>
                    <div className="font-bold px-8 py-4 md:px-16 md:py-6 rounded-full w-full max-w-2xl flex items-center justify-center" 
                         style={{ 
                           fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
                           color: 'var(--color-primary)', 
                           background: 'rgba(255, 255, 255, 0.03)',
                           border: '1px solid rgba(255, 255, 255, 0.1)',
                           boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2), 0 8px 32px rgba(0, 0, 0, 0.1)'
                         }}>
                      {currentWord.meaning}
                    </div>
                  </div>

                  <div className={`options-grid w-full ${status === 'incorrect' ? 'shake' : ''}`}>
                    {options.map((opt, i) => {
                      let statusClass = '';
                      if (status === 'correct' && opt === currentWord.word) statusClass = 'correct-ans';
                      if (status === 'incorrect' && opt === selectedOption) statusClass = 'incorrect-ans';
                      
                      return (
                        <button 
                          key={i} 
                          className={`option-btn ${statusClass}`}
                          onClick={() => handleGuess(opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="h-8 mt-6 w-full flex items-center justify-center">
                    {status === 'incorrect' && (
                      <p className="text-red-400 font-semibold animate-fade-up">
                        Incorrect! Try again...
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {hintLevel < 2 && status !== 'correct' && (
                      <button 
                        type="button"
                        onClick={() => setHintLevel(prev => prev + 1)}
                        className="text-btn"
                        style={{ marginBottom: '1rem', color: 'var(--color-neutral)', textDecoration: 'underline' }}
                      >
                        Need a hint? (Gain less EXP)
                      </button>
                    )}
                    
                    {hintLevel > 0 && (
                      <div style={{ marginTop: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', animation: 'fadeUp 0.3s ease-out forwards', color: 'var(--color-neutral)', fontSize: '0.875rem', textAlign: 'center' }}>
                        {hintLevel >= 1 && (
                          <p style={{ marginBottom: '0.25rem' }}>
                            First letter: <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-secondary)', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>{currentWord.word.charAt(0).toUpperCase()} {'_ '.repeat(Math.max(1, currentWord.word.length - 1))}</span>
                          </p>
                        )}
                        {hintLevel >= 2 && (
                          <p style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            Part of speech: <span style={{ color: 'var(--color-accent)', fontWeight: '600', marginLeft: '0.25rem' }}>{currentWord.type || "Unknown"}</span>
                          </p>
                        )}
                      </div>
                    )}
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

export default GuessMode;
