import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import sentencesData from '../data/sentences.json';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

const BATCH_SIZE = 15;

const ContextMode = () => {
  const navigate = useNavigate();
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle');
  const [lastGuess, setLastGuess] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const initRound = () => {
    const shuffled = [...sentencesData].sort(() => 0.5 - Math.random());
    setSentences(shuffled.slice(0, BATCH_SIZE));
    setCurrentIndex(0);
    setStatus('idle');
    setLastGuess(null);
    setCorrectCount(0);
  };

  useEffect(() => {
    initRound();
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
    if (!sentences[currentIndex]) return;
    const current = sentences[currentIndex];
    const correctWord = current.word;
    
    // 1. Try matching distractors by identical targetPOS
    let pool = sentencesData
      .filter(s => s.word.toLowerCase() !== correctWord.toLowerCase() && s.targetPOS === current.targetPOS)
      .map(s => s.word);
    
    // Deduplicate
    pool = [...new Set(pool)];

    // 2. If POS pool is too small, fallback to same level or general unique words
    if (pool.length < 3) {
      const levelPool = sentencesData
        .filter(s => s.word.toLowerCase() !== correctWord.toLowerCase() && s.level === current.level)
        .map(s => s.word);
      pool = [...new Set([...pool, ...levelPool])];
    }

    if (pool.length < 3) {
      const generalPool = sentencesData
        .filter(s => s.word.toLowerCase() !== correctWord.toLowerCase())
        .map(s => s.word);
      pool = [...new Set([...pool, ...generalPool])];
    }
    
    // Pick 3 random distractors
    const chosenDistractors = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const newOptions = [...chosenDistractors, correctWord].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
  };

  const handleGuess = (guess) => {
    if (status !== 'idle') return;
    
    setLastGuess(guess);

    if (guess.toLowerCase() === currentItem.word.toLowerCase()) {
      playSound('success');
      setStatus('correct');
      setCorrectCount(prev => prev + 1);
      addExp(15);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1800);
    } else {
      playSound('click');
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
        <div className="container animate-fade-up text-center py-20" style={{ maxWidth: '650px' }}>
          <div style={{ background: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '16px', padding: '3rem 2rem' }}>
            <Sparkles size={48} className="text-[var(--color-primary)] mx-auto mb-4 animate-bounce" />
            <h2 className="text-gradient text-3xl font-extrabold mb-3">Context Protocol Complete! 🎉</h2>
            <p className="text-[var(--color-neutral)] text-base mb-6">
              You scored <span className="text-[var(--color-primary)] font-bold">{correctCount}</span> out of <span className="font-bold">{sentences.length}</span> context challenges!
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" onClick={initRound} className="flex items-center gap-2">
                <RotateCcw size={16} /> Next Batch
              </Button>
              <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                Back to Terminal <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return <div className="container text-center py-20"><h2 className="text-gradient">Initializing Neural Context...</h2></div>;
  }

  // Split sentence at the blank '_____'
  const parts = currentItem.sentence.split('_____');

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '800px', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div className="game-container">
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: '#c084fc', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            <span>SECTOR GAMMA // CONTEXT CLUES PROTOCOL</span>
          </div>
          <h2 className="text-gradient mb-2" style={{ fontSize: '1.5rem', fontWeight: '800' }}>Context Mode</h2>
          <p className="text-[var(--color-neutral)] text-sm">
            Fill in the blank to complete the sentence logically. ({currentIndex + 1} / {sentences.length})
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8 text-center relative overflow-hidden" style={{ border: '1px solid rgba(192, 132, 252, 0.35)' }}>
          {status === 'correct' && (
            <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
          )}
          
          <div className="relative z-10" style={{ width: '100%' }}>
            <div className="context-sentence" style={{ fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              <span>{parts[0]}</span>
              <span className={`context-blank ${status === 'correct' ? 'filled' : ''}`} style={{ fontWeight: '800', color: status === 'correct' ? '#4ade80' : 'var(--color-primary)' }}>
                {status === 'correct' ? currentItem.word : '________'}
              </span>
              <span>{parts[1]}</span>
            </div>

            {/* Thai Translation Feedback on Correct */}
            {status === 'correct' && currentItem.translationThai && (
              <div className="animate-fade-up mb-6 py-2 px-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-emerald-300 text-sm font-sans">
                💡 {currentItem.translationThai}
              </div>
            )}

            <div className={`context-grid ${status === 'incorrect' ? 'shake' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {options.map((opt, i) => {
                let statusClass = '';
                if (status === 'correct' && opt.toLowerCase() === currentItem.word.toLowerCase()) statusClass = 'correct-ans';
                if (status === 'incorrect' && opt === lastGuess) statusClass = 'incorrect-ans';
                
                return (
                  <button 
                    key={i} 
                    className={`option-btn ${statusClass}`}
                    onClick={() => handleGuess(opt)}
                    style={{ 
                      padding: '0.85rem 1rem', 
                      fontSize: '1.05rem', 
                      fontWeight: '700',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(192, 132, 252, 0.4)',
                      background: 'rgba(192, 132, 252, 0.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="h-6 mt-4 flex items-center justify-center">
              {status === 'incorrect' && (
                <p className="text-red-400 font-semibold animate-fade-up text-sm">
                  Incorrect! Try another context option...
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContextMode;
