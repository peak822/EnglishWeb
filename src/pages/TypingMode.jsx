import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import { Flame, Activity } from 'lucide-react';

const TypingMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  
  const inputRef = useRef(null);
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
    setInput('');
    setStatus('idle');
    setWrongCount(0);
    setShowHint(false);
    setStreak(0);
    setCorrectCount(0);
    setIsDebriefOpen(false);
    setIsLoaded(true);
  };

  useEffect(() => {
    initWords(level);
  }, [level]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const currentWord = words[currentIndex];

  const handleCorrect = () => {
    setStatus('correct');
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setCorrectCount(prev => prev + 1);

    if (nextStreak >= 3) {
      playSound('combo', { streak: nextStreak });
    } else {
      playSound('success');
    }

    if (status !== 'revealed') {
      const bonus = nextStreak >= 3 ? 15 : 10;
      addExp(bonus);
    }

    timeoutRef.current = setTimeout(() => {
      if (currentIndex + 1 >= Math.min(words.length, 20)) {
        setIsDebriefOpen(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setWrongCount(0);
        setShowHint(false);
      }
    }, 2200);
  };

  const handleInputChange = (e) => {
    if (status === 'revealed') return;

    const val = e.target.value.toLowerCase();
    setInput(val);
    
    if (currentWord && val.trim() === currentWord.word.toLowerCase()) {
      handleCorrect();
    } else if (status !== 'incorrect' && status !== 'revealed') {
      setStatus('idle');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWord || status === 'revealed' || status === 'correct') return;

    if (input.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      handleCorrect();
    } else {
      playSound('click');
      setStreak(0);
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      if (newWrongCount >= 3) {
        setStatus('revealed');
        timeoutRef.current = setTimeout(() => {
          if (currentIndex + 1 >= Math.min(words.length, 20)) {
            setIsDebriefOpen(true);
          } else {
            setCurrentIndex(prev => prev + 1);
            setInput('');
            setStatus('idle');
            setWrongCount(0);
            setShowHint(false);
          }
        }, 2500);
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

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '850px', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,255,255,0.25)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: 'var(--color-primary)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: TYPING</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-family-sans)', color: '#ffffff', letterSpacing: '0.02em', marginTop: '0.2rem' }}>
              Typing Mode <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-family-mono)' }}>(Speed Recall)</span>
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
        <div className="hud-stats-grid" style={{ '--hud-border': 'rgba(0, 255, 255, 0.3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>PROGRESS</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 20)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>STREAK COMBO</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-neutral)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Flame size={14} />
              {streak}x
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>CEFR LEVEL</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              {currentWord ? currentWord.level : '-'}
            </span>
          </div>
        </div>

        {words.length === 0 ? (
          <div className="hud-panel-box">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-neutral)', fontFamily: 'var(--font-family-mono)' }}>No tactical words found for this clearance level.</h3>
          </div>
        ) : (
          <div className="hud-panel-box" style={{ '--hud-border': 'rgba(0, 255, 255, 0.35)' }}>
            <TechBracket color="var(--color-primary)" size={18} />

            {status === 'correct' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,255,0.1)', animation: 'pulse 1.5s infinite', zIndex: 0 }} />
            )}
            
            <div style={{ position: 'relative', zIndex: 10 }}>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                TYPE: {currentWord.type}
              </span>
              
              <div style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--color-primary)', fontWeight: '800', fontFamily: 'var(--font-family-sans)', letterSpacing: '0.02em' }}>
                {status === 'correct' || status === 'revealed' ? 
                  <span style={{ fontFamily: 'var(--font-family-mono)', color: '#ffffff', letterSpacing: '0.15em', fontWeight: '900' }}>{currentWord.word}</span> : 
                  currentWord.meaning
                }
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  value={input}
                  onChange={handleInputChange}
                  className={`typing-input ${
                    status === 'incorrect' ? 'error shake' : 
                    status === 'correct' ? 'success' : ''
                  }`}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-family-mono)',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    letterSpacing: '0.06em',
                    background: 'rgba(0,0,0,0.6)',
                    border: '2px solid rgba(0,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff'
                  }}
                  placeholder="Type English word..."
                  autoComplete="off"
                  disabled={status === 'revealed' || status === 'correct'}
                />

                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <Button type="submit" variant="primary" style={{ flex: 1, minHeight: '44px', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.04em' }} disabled={status === 'revealed' || status === 'correct'}>
                    SUBMIT [ENTER]
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    style={{ minHeight: '44px', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', fontWeight: '700' }}
                    onClick={() => {
                      if (status === 'revealed' || status === 'correct') return;
                      playSound('click');
                      setStreak(0);
                      setStatus('revealed');
                      timeoutRef.current = setTimeout(() => {
                        if (currentIndex + 1 >= Math.min(words.length, 20)) {
                          setIsDebriefOpen(true);
                        } else {
                          setCurrentIndex(prev => prev + 1);
                          setInput('');
                          setStatus('idle');
                          setWrongCount(0);
                          setShowHint(false);
                        }
                      }, 2500);
                    }}
                    disabled={status === 'revealed' || status === 'correct'}
                  >
                    SKIP
                  </Button>
                </div>
              </form>

              {(status === 'correct' || status === 'revealed') && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.6)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.3)', width: '100%', maxWidth: '420px', margin: '1.5rem auto 0 auto', fontFamily: 'var(--font-family-mono)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-neutral)', marginBottom: '0.25rem' }}>{currentWord.meaning}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                    {currentWord.thai_pronunciation ? `[${currentWord.thai_pronunciation}] ` : ''}
                    /{currentWord.ipa || 'no ipa'}/
                  </p>
                  <p style={{ marginTop: '0.5rem', fontWeight: '700', fontSize: '0.8rem', color: status === 'correct' ? 'var(--color-primary)' : '#f87171' }}>
                    {status === 'correct' ? '✓ TARGET DECRYPTED' : '⚡ REVEALED // ADVANCING...'}
                  </p>
                </div>
              )}

              {showHint && status !== 'revealed' && status !== 'correct' && (
                <div style={{ marginTop: '1rem', color: 'var(--color-neutral)', fontSize: '0.8rem', fontFamily: 'var(--font-family-mono)', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>
                  💡 คำอ่าน: <span style={{ color: 'var(--color-secondary)', marginLeft: '0.3rem', fontWeight: '700' }}>{currentWord.thai_pronunciation || currentWord.ipa || 'N/A'}</span>
                </div>
              )}
              
              {!showHint && status !== 'revealed' && status !== 'correct' && (
                <button 
                  type="button"
                  onClick={() => {
                    playSound('hover');
                    setShowHint(true);
                  }}
                  style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', fontSize: '0.78rem', fontFamily: 'var(--font-family-mono)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  [ Request Decryption Hint ]
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mission Debrief Modal */}
      <MissionDebriefModal
        isOpen={isDebriefOpen}
        title="TYPING PROTOCOL COMPLETE"
        subtitle="SECTOR ALPHA TRAINING"
        score={correctCount}
        total={Math.min(words.length, 20)}
        expGained={correctCount * 15}
        streakCount={streak}
        onRetry={() => initWords(level)}
        onNext={() => initWords(level)}
        nextLabel="NEXT BATCH"
      />
    </div>
  );
};

export default TypingMode;
