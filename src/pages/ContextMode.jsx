import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import sentencesData from '../data/sentences.json';
import { useGamification } from '../hooks/useGamification';

const ContextMode = () => {
  const { addExp } = useGamification();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle');
  const [lastGuess, setLastGuess] = useState(null);

  useEffect(() => {
    // Shuffle sentences
    const shuffled = [...sentencesData].sort(() => 0.5 - Math.random());
    setSentences(shuffled);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (sentences.length > 0 && sentences[currentIndex]) {
      generateOptions();
      setStatus('idle');
      setLastGuess(null);
    }
  }, [currentIndex, sentences]);

  const currentItem = sentences[currentIndex];

  const generateOptions = () => {
    const correctWord = sentences[currentIndex].word;
    
    // Get unique words from all sentences to use as distractors
    const allWords = [...new Set(sentencesData.map(s => s.word))];
    let pool = allWords.filter(w => w !== correctWord);
    
    // Pick 3 random distractors
    pool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const newOptions = [...pool, correctWord].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
  };

  const handleGuess = (guess) => {
    if (status !== 'idle') return;
    
    setLastGuess(guess);

    if (guess === currentItem.word) {
      setStatus('correct');
      addExp(10);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1500);
    } else {
      setStatus('incorrect');
      setTimeout(() => {
        setStatus('idle');
        setLastGuess(null);
      }, 1000);
    }
  };

  if (!currentItem) {
    if (sentences.length > 0 && currentIndex >= sentences.length) {
      return (
        <div className="container animate-fade-up text-center py-20">
          <h2 className="text-gradient text-4xl mb-4">Amazing Job! 🎉</h2>
          <p className="text-[var(--color-neutral)] text-lg mb-8">You have completed all available context sentences!</p>
          <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
        </div>
      );
    }
    return <div className="container text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  // Split sentence at the blank '_____'
  const parts = currentItem.sentence.split('_____');

  return (
    <div className="container animate-fade-up">
      <div className="text-center mb-10">
        <h2 className="text-gradient mb-4">Context Mode</h2>
        <p className="text-[var(--color-neutral)]">
          Fill in the blank to complete the sentence. ({currentIndex + 1} / {sentences.length})
        </p>
      </div>

      <Card className="max-w-2xl mx-auto p-10 text-center relative overflow-hidden">
        {status === 'correct' && (
          <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
        )}
        
        <div className="relative z-10" style={{ width: '100%' }}>
          <div className="context-sentence">
            <span>{parts[0]}</span>
            <span className={`context-blank ${status === 'correct' ? 'filled' : ''}`}>
              {status === 'correct' ? currentItem.word : '________'}
            </span>
            <span>{parts[1]}</span>
          </div>

          <div className={`context-grid ${status === 'incorrect' ? 'shake' : ''}`}>
            {options.map((opt, i) => {
              let statusClass = '';
              if (status === 'correct' && opt === currentItem.word) statusClass = 'correct-ans';
              if (status === 'incorrect' && opt === lastGuess) statusClass = 'incorrect-ans';
              
              return (
                <button 
                  key={i} 
                  className={`option-btn ${statusClass}`}
                  onClick={() => handleGuess(opt)}
                  style={{ width: '100%' }}
                >
                  {opt}
                </button>
              );
            })}
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
  );
};

export default ContextMode;
