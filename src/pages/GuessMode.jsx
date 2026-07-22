import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useGamification } from '../hooks/useGamification';
import vocabularyData from '../data/vocabulary.json';

const GuessMode = () => {
  const { addExp } = useGamification();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [hintLevel, setHintLevel] = useState(0);
  const [level, setLevel] = useState('all');

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
  }, [level]);

  useEffect(() => {
    if (words.length > 0 && words[currentIndex]) {
      generateOptions();
      setStatus('idle');
      setHintLevel(0);
    }
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];

  const generateOptions = () => {
    const correctWord = words[currentIndex].word;
    
    let pool = words.filter(w => w.word !== correctWord && w.level === currentWord.level);
    if (pool.length < 3) {
      pool = vocabularyData.filter(w => w.word !== correctWord);
    }
    
    pool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const newOptions = [...pool.map(w => w.word), correctWord].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
  };

  const handleGuess = (guess) => {
    if (status !== 'idle') return;

    if (guess === currentWord.word) {
      setStatus('correct');
      // Calculate EXP based on hints used (10 -> 5 -> 2)
      const expGained = hintLevel === 0 ? 10 : hintLevel === 1 ? 5 : 2;
      addExp(expGained);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2500); // Increased delay for post-answer review
    } else {
      setStatus('incorrect');
      setTimeout(() => {
        setStatus('idle');
      }, 1000);
    }
  };

  if (!currentWord) {
    return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;
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
            <option value="all">All Levels</option>
            <option value="A1">A1 (Beginner)</option>
            <option value="A2">A2 (Elementary)</option>
            <option value="B1">B1 (Intermediate)</option>
            <option value="B2">B2 (Upper Intermediate)</option>
          </select>
        </div>

        <div className="game-stats justify-center">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{currentIndex + 1} / {words.length}</span>
          </div>
        </div>

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
                <h3 className="text-xl mb-6 text-[var(--color-neutral)] font-medium">Guess the word for this part of speech:</h3>
                <div className="word-type text-2xl mb-12">
                  {currentWord.type}
                </div>

                <div className={`options-grid w-full ${status === 'incorrect' ? 'shake' : ''}`}>
                  {options.map((opt, i) => {
                    let statusClass = '';
                    if (status === 'correct' && opt === currentWord.word) statusClass = 'correct-ans';
                    if (status === 'incorrect' && opt === currentWord.word) statusClass = 'incorrect-ans';
                    
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
                      style={{ marginBottom: '1rem' }}
                    >
                      Need a hint? (-EXP)
                    </button>
                  )}
                  
                  {hintLevel > 0 && (
                    <div style={{ marginTop: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', animation: 'fadeUp 0.3s ease-out forwards', color: 'var(--color-neutral)', fontSize: '0.875rem', textAlign: 'center' }}>
                      {hintLevel >= 1 && (
                        <p style={{ marginBottom: '0.25rem' }}>
                          First letter: <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-secondary)', letterSpacing: '0.1em', marginLeft: '0.25rem' }}>{currentWord.word.charAt(0).toUpperCase()} _ _ _</span>
                        </p>
                      )}
                      {hintLevel >= 2 && (
                        <p style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          Meaning: <span style={{ color: 'var(--color-accent)', fontWeight: '600', marginLeft: '0.25rem' }}>{currentWord.meaning || "No translation"}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GuessMode;
