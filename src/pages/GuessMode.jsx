import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import vocabularyData from '../data/vocabulary.json';
import { Flame, Activity } from 'lucide-react';

const GuessMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('idle'); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const initWords = (lvl) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let result = filterWords(vocabularyData, lvl);
    result = [...result].sort(() => 0.5 - Math.random());
    setWords(result);
    setCurrentIndex(0);
    setStreak(0);
    setCorrectCount(0);
    setIsDebriefOpen(false);
    setIsLoaded(true);
  };

  useEffect(() => {
    initWords(level);
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
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setCorrectCount(prev => prev + 1);

      if (nextStreak >= 3) {
        playSound('combo', { streak: nextStreak });
      } else {
        playSound('success');
      }

      const expGained = hintLevel === 0 ? (nextStreak >= 3 ? 15 : 10) : hintLevel === 1 ? 5 : 2;
      addExp(expGained);

      timeoutRef.current = setTimeout(() => {
        if (currentIndex + 1 >= Math.min(words.length, 15)) {
          setIsDebriefOpen(true);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 2200);
    } else {
      playSound('click');
      setStatus('incorrect');
      setStreak(0);
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (!isLoaded) {
    return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '850px', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(251,191,36,0.3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: '#fbbf24', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: GUESS</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-family-sans)', color: '#ffffff', letterSpacing: '0.02em', marginTop: '0.2rem' }}>
              Guess Mode <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontFamily: 'var(--font-family-mono)' }}>(Clue Deduction)</span>
            </h2>
          </div>

          <div style={{ width: '220px', zIndex: 20 }}>
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
          </div>
        </div>

        {/* HUD Tactical Stats */}
        <div className="hud-stats-grid" style={{ '--hud-border': 'rgba(251, 191, 36, 0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>PROGRESS</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 15)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>STREAK COMBO</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Flame size={14} />
              {streak}x
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>TYPE</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              {currentWord ? currentWord.type : '-'}
            </span>
          </div>
        </div>

        {words.length === 0 ? (
          <div className="hud-panel-box">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-neutral)', fontFamily: 'var(--font-family-mono)' }}>No tactical words found for this clearance level.</h3>
          </div>
        ) : (
          <div className="hud-panel-box" style={{ '--hud-border': 'rgba(251, 191, 36, 0.4)' }}>
            <TechBracket color="#fbbf24" size={18} />

            {status === 'correct' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(251,191,36,0.1)', animation: 'pulse 1.5s infinite', zIndex: 0 }} />
            )}

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {status === 'correct' ? (
                <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', fontFamily: 'var(--font-family-mono)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>TARGET VERIFIED</span>
                  <h3 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', marginBottom: '0.25rem' }}>{currentWord.word}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>/{currentWord.ipa || 'no ipa'}/</p>
                  <div style={{ padding: '1rem 1.5rem', borderRadius: '12px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(251,191,36,0.4)', maxWidth: '360px', width: '100%' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: '800' }}>{currentWord.meaning}</p>
                  </div>
                  <p style={{ marginTop: '1rem', color: '#4ade80', fontWeight: '800', fontSize: '0.85rem' }}>
                    + {hintLevel === 0 ? 10 : hintLevel === 1 ? 5 : 2} EXP GRANTED
                  </p>
                </div>
              ) : (
                <>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                    DECRYPT TARGET BY MEANING
                  </span>

                  <div style={{ width: '100%', maxWidth: '520px', padding: '1.25rem', marginBottom: '1.75rem', borderRadius: '14px', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-family-sans)' }}>
                      {currentWord.meaning}
                    </span>
                  </div>

                  <div className={status === 'incorrect' ? 'shake' : ''} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', width: '100%', maxWidth: '480px' }}>
                    {options.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      let bg = 'rgba(10, 16, 35, 0.85)';
                      let border = '1.5px solid rgba(255, 255, 255, 0.15)';
                      let color = '#ffffff';
                      let shadow = 'none';
                      
                      if (status === 'correct' && opt === currentWord.word) {
                        bg = 'rgba(34, 197, 94, 0.25)';
                        border = '1.5px solid #4ade80';
                        color = '#86efac';
                        shadow = '0 0 15px rgba(34, 197, 94, 0.5)';
                      } else if (status === 'incorrect' && isSelected) {
                        bg = 'rgba(239, 68, 68, 0.25)';
                        border = '1.5px solid #ef4444';
                        color = '#fca5a5';
                        shadow = '0 0 15px rgba(239, 68, 68, 0.5)';
                      }
                      
                      return (
                        <button 
                          key={i} 
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '10px',
                            border,
                            background: bg,
                            color,
                            boxShadow: shadow,
                            fontFamily: 'var(--font-family-mono)',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            letterSpacing: '0.04em'
                          }}
                          onClick={() => handleGuess(opt)}
                          onMouseEnter={() => playSound('hover')}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div style={{ height: '24px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {status === 'incorrect' && (
                      <p style={{ color: '#f87171', fontFamily: 'var(--font-family-mono)', fontSize: '0.78rem', fontWeight: '800' }} className="animate-fade-up">
                        MISMATCH DETECTED // RETRYING...
                      </p>
                    )}
                  </div>

                  {/* Hint Section */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {hintLevel < 2 && status !== 'correct' && (
                      <button 
                        type="button"
                        onClick={() => {
                          playSound('hover');
                          setHintLevel(prev => prev + 1);
                        }}
                        style={{ background: 'transparent', border: 'none', fontSize: '0.78rem', fontFamily: 'var(--font-family-mono)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        [ Request Clue Hint (EXP Reduced) ]
                      </button>
                    )}
                    
                    {hintLevel > 0 && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(251,191,36,0.3)', fontFamily: 'var(--font-family-mono)', fontSize: '0.78rem', color: '#fbbf24', textAlign: 'center', maxWidth: '340px' }}>
                        {hintLevel >= 1 && (
                          <p>
                            PART OF SPEECH: <strong style={{ color: '#ffffff' }}>{currentWord.type || "N/A"}</strong>
                          </p>
                        )}
                        {hintLevel >= 2 && (
                          <p style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            PRONUNCIATION: <strong style={{ color: '#ffffff' }}>/{currentWord.ipa || currentWord.thai_pronunciation || "N/A"}/</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mission Debrief Modal */}
      <MissionDebriefModal
        isOpen={isDebriefOpen}
        title="GUESS PROTOCOL COMPLETE"
        subtitle="SECTOR ALPHA TRAINING"
        score={correctCount}
        total={Math.min(words.length, 15)}
        expGained={correctCount * 15}
        streakCount={streak}
        onRetry={() => initWords(level)}
        onNext={() => initWords(level)}
        nextLabel="NEXT BATCH"
      />
    </div>
  );
};

export default GuessMode;
