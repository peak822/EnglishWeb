import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';

const GuessMode = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); 
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
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1500);
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

        <div className="game-stats">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value">{currentIndex + 1} / {words.length}</span>
          </div>
          <div className="stat-item">
            <span>Length</span>
            <span className="stat-value">{currentWord.word.length} letters</span>
          </div>
        </div>

        <Card className="text-center py-16 relative overflow-hidden">
          {status === 'correct' && (
            <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
          )}

          <div className="relative z-10">
            <h3 className="text-xl mb-6 text-[var(--color-neutral)] font-medium">Guess the word for this part of speech:</h3>
            <div className="word-type text-2xl mb-12">
              {currentWord.type}
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto ${status === 'incorrect' ? 'shake' : ''}`}>
              {options.map((opt, i) => (
                <Button 
                  key={i} 
                  variant="secondary"
                  className={`w-full text-lg py-4 ${
                    status === 'correct' && opt === currentWord.word ? '!bg-[var(--color-surface)] !border-[var(--color-surface)] !text-white !shadow-[var(--glow-primary)]' : 
                    status === 'incorrect' && opt === currentWord.word ? '!bg-[var(--color-surface)] !border-[var(--color-surface)] !text-white' :
                    ''
                  }`}
                  onClick={() => handleGuess(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
            
            <div className="h-8 mt-6 flex items-center justify-center">
              {status === 'incorrect' && (
                <p className="text-red-400 font-semibold animate-fade-up">
                  Incorrect! Try again...
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GuessMode;
