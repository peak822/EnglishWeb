import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { filterWords } from '../hooks/useCategories';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import LevelSelector from '../components/LevelSelector';
import { useLevelFilter } from '../hooks/useLevelFilter';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import { Flame, Activity } from 'lucide-react';

const AssembleMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [assembledWord, setAssembledWord] = useState([]);
  const [status, setStatus] = useState('idle');
  const [level, setLevel] = useLevelFilter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
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
    setStatus('idle');
    setIsLoaded(true);
    setShowHint(false);
    setStreak(0);
    setCorrectCount(0);
    setIsDebriefOpen(false);
  };

  useEffect(() => {
    initWords(level);
  }, [level]);

  useEffect(() => {
    if (words.length > 0 && words[currentIndex]) {
      const word = words[currentIndex].word.toLowerCase();
      const letters = word.split('').map((char, index) => ({ id: index, char, used: false }));
      setScrambledLetters(letters.sort(() => 0.5 - Math.random()));
      setAssembledWord(new Array(word.length).fill(null));
      setStatus('idle');
      setShowHint(false);
    }
  }, [currentIndex, words]);

  const currentWord = words[currentIndex];

  const handleLetterClick = (letterObj) => {
    if (letterObj.used || status === 'correct') return;

    playSound('click');

    const firstEmptyIndex = assembledWord.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return;

    const newAssembled = [...assembledWord];
    newAssembled[firstEmptyIndex] = letterObj;
    setAssembledWord(newAssembled);

    const newScrambled = scrambledLetters.map(l => 
      l.id === letterObj.id ? { ...l, used: true } : l
    );
    setScrambledLetters(newScrambled);

    if (newAssembled.every(slot => slot !== null)) {
      const finalWord = newAssembled.map(l => l.char).join('');
      if (finalWord === currentWord.word.toLowerCase()) {
        setStatus('correct');
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setCorrectCount(prev => prev + 1);
        addExp(nextStreak >= 3 ? 25 : 20);

        if (nextStreak >= 3) {
          playSound('combo', { streak: nextStreak });
        } else {
          playSound('success');
        }

        timeoutRef.current = setTimeout(() => {
          if (currentIndex + 1 >= Math.min(words.length, 15)) {
            setIsDebriefOpen(true);
          } else {
            setCurrentIndex(prev => prev + 1);
          }
        }, 1600);
      } else {
        setStatus('incorrect');
        setStreak(0);
        timeoutRef.current = setTimeout(() => {
          setAssembledWord(new Array(currentWord.word.length).fill(null));
          setScrambledLetters(scrambledLetters.map(l => ({ ...l, used: false })));
          setStatus('idle');
        }, 800);
      }
    }
  };

  const handleSlotClick = (slotObj, index) => {
    if (!slotObj || status === 'correct') return;

    playSound('hover');
    const newAssembled = [...assembledWord];
    newAssembled[index] = null;
    setAssembledWord(newAssembled);

    const newScrambled = scrambledLetters.map(l => 
      l.id === slotObj.id ? { ...l, used: false } : l
    );
    setScrambledLetters(newScrambled);
  };

  if (!isLoaded) {
    return <div className="container animate-fade-up text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '850px', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(188,19,254,0.3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: '#e879f9', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: ASSEMBLE</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-family-sans)', color: '#ffffff', letterSpacing: '0.02em', marginTop: '0.2rem' }}>
              Assemble Mode <span style={{ color: '#e879f9', fontSize: '0.9rem', fontFamily: 'var(--font-family-mono)' }}>(Data Anagrams)</span>
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
        <div className="hud-stats-grid" style={{ '--hud-border': 'rgba(188, 19, 254, 0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>PROGRESS</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 15)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>STREAK COMBO</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#e879f9', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-neutral)', fontFamily: 'var(--font-family-mono)' }}>No data fragments for this clearance level.</h3>
          </div>
        ) : (
          <div className="hud-panel-box" style={{ '--hud-border': 'rgba(188, 19, 254, 0.4)' }}>
            <TechBracket color="#e879f9" size={18} />

            {status === 'correct' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(188,19,254,0.1)', animation: 'pulse 1.5s infinite', zIndex: 0 }} />
            )}

            <div style={{ position: 'relative', zIndex: 10 }}>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.85rem', borderRadius: '9999px', background: 'rgba(188,19,254,0.1)', border: '1px solid rgba(188,19,254,0.3)', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', color: '#e879f9', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                TRANSLATION TARGET: {currentWord.meaning}
              </span>
              
              {/* Assembled Word Slot Row */}
              <div className={`letters-container ${status === 'incorrect' ? 'shake' : ''}`} style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.75rem', width: '100%' }}>
                {assembledWord.map((slot, i) => (
                  <button
                    type="button"
                    key={i} 
                    disabled={!slot || status === 'correct'}
                    aria-label={slot ? `นำตัวอักษร ${slot.char} ออกจากตำแหน่ง ${i + 1}` : `ตำแหน่ง ${i + 1} ว่าง`}
                    style={{
                      width: 'clamp(34px, 8.5vw, 52px)',
                      height: 'clamp(42px, 11vw, 62px)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-family-mono)',
                      fontWeight: '800',
                      fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
                      border: slot ? '2px solid var(--color-primary)' : '1.5px dashed rgba(255,255,255,0.25)',
                      background: slot ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0,0,0,0.4)',
                      color: '#ffffff',
                      boxShadow: slot ? '0 0 15px rgba(0, 255, 255, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      touchAction: 'manipulation'
                    }}
                    onClick={() => handleSlotClick(slot, i)}
                  >
                    {slot ? slot.char.toUpperCase() : ''}
                  </button>
                ))}
              </div>

              {/* Scrambled Available Letter Blocks */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
                {scrambledLetters.map(letter => (
                  <button 
                    key={letter.id} 
                    disabled={letter.used || status === 'correct'}
                    style={{
                      width: 'clamp(32px, 8vw, 48px)',
                      height: 'clamp(40px, 10vw, 56px)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-family-mono)',
                      fontWeight: '800',
                      fontSize: 'clamp(1rem, 3.8vw, 1.25rem)',
                      border: '1.5px solid rgba(188, 19, 254, 0.4)',
                      background: letter.used ? 'transparent' : 'rgba(188, 19, 254, 0.18)',
                      color: letter.used ? 'transparent' : '#ffffff',
                      boxShadow: letter.used ? 'none' : '0 0 12px rgba(188, 19, 254, 0.25)',
                      cursor: letter.used ? 'default' : 'pointer',
                      opacity: letter.used ? 0.2 : 1,
                      pointerEvents: letter.used ? 'none' : 'auto',
                      transition: 'all 0.15s ease',
                      touchAction: 'manipulation'
                    }}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter.char.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {showHint && status !== 'correct' && (
                  <div style={{ marginBottom: '1rem', color: '#e879f9', fontSize: '0.8rem', fontFamily: 'var(--font-family-mono)', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(188,19,254,0.3)' }}>
                    💡 คำอ่าน: <span style={{ color: '#ffffff', fontWeight: '700', marginLeft: '0.3rem' }}>{currentWord.thai_pronunciation || currentWord.ipa || 'N/A'}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '300px' }}>
                  <Button 
                    variant="secondary" 
                    style={{ width: '100%', fontFamily: 'var(--font-family-mono)', fontSize: '0.8rem', fontWeight: '700' }}
                    onClick={() => {
                      playSound('click');
                      setAssembledWord(new Array(currentWord.word.length).fill(null));
                      setScrambledLetters(scrambledLetters.map(l => ({ ...l, used: false })));
                      setStatus('idle');
                    }}
                  >
                    RESET TILES
                  </Button>
                </div>

                {!showHint && status !== 'correct' && (
                  <button 
                    type="button"
                    onClick={() => {
                      playSound('hover');
                      setShowHint(true);
                    }}
                    style={{ marginTop: '1rem', background: 'transparent', border: 'none', fontSize: '0.78rem', fontFamily: 'var(--font-family-mono)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    [ Request Hint ]
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mission Debrief Modal */}
      <MissionDebriefModal
        isOpen={isDebriefOpen}
        title="ASSEMBLE PROTOCOL COMPLETE"
        subtitle="SECTOR ALPHA TRAINING"
        score={correctCount}
        total={Math.min(words.length, 15)}
        expGained={correctCount * 20}
        streakCount={streak}
        onRetry={() => initWords(level)}
        onNext={() => initWords(level)}
        nextLabel="NEXT BATCH"
      />
    </div>
  );
};

export default AssembleMode;
