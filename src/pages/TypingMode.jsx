import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import { Zap, Flame, Activity } from 'lucide-react';

const TypingMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect, revealed
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
    
    // Auto-advance if the typed word is exactly correct
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
    <div className="container animate-fade-up px-4 max-w-4xl mx-auto py-6">
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[rgba(0,255,255,0.2)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] font-bold tracking-wider uppercase">
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: TYPING</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-wide">
              Typing Mode <span className="text-[var(--color-primary)] font-mono text-sm">(Speed Recall)</span>
            </h2>
          </div>

          <div className="w-48 sm:w-64 z-20">
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
          </div>
        </div>

        {/* HUD Tactical Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 mb-6 rounded-lg bg-[rgba(10,15,30,0.85)] border border-[rgba(0,255,255,0.2)] font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">PROGRESS</span>
            <span className="font-bold text-sm text-[var(--color-primary)]">
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 20)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[rgba(255,255,255,0.1)]">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">STREAK COMBO</span>
            <span className="font-bold text-sm text-[var(--color-neutral)] flex items-center gap-1">
              <Flame size={14} />
              {streak}x
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">CEFR LEVEL</span>
            <span className="font-bold text-sm text-[var(--color-accent)] uppercase">
              {currentWord ? currentWord.level : '-'}
            </span>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="text-center py-8 md:py-16">
            <h3 className="text-xl text-[var(--color-neutral)] font-mono">No tactical words found for this clearance level.</h3>
          </Card>
        ) : (
          <div className="relative p-6 sm:p-10 rounded-xl bg-[rgba(10,15,30,0.9)] border border-[rgba(0,255,255,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(0,255,255,0.05)] overflow-hidden">
            <TechBracket color="var(--color-primary)" size={18} />

            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(0,255,255,0.1)] animate-pulse z-0" />
            )}
            
            <div className="relative z-10 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] text-[0.7rem] font-mono tracking-widest text-[var(--color-primary)] uppercase mb-4">
                TYPE: {currentWord.type}
              </span>
              
              <div className="text-2xl sm:text-3xl mb-8 text-[var(--color-primary)] font-bold px-4 font-sans tracking-wide">
                {status === 'correct' || status === 'revealed' ? 
                  <span className="font-mono text-white tracking-widest font-bold">{currentWord.word}</span> : 
                  currentWord.meaning
                }
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  value={input}
                  onChange={handleInputChange}
                  className={`typing-input w-full font-mono text-center text-lg tracking-wider bg-[rgba(0,0,0,0.6)] border-2 border-[rgba(0,255,255,0.3)] focus:border-[var(--color-primary)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-lg py-3 text-white transition-all ${
                    status === 'incorrect' ? 'border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 
                    status === 'correct' ? 'border-green-400 shadow-[0_0_15px_rgba(0,255,100,0.5)]' : ''
                  }`}
                  placeholder="Type English word..."
                  autoComplete="off"
                  disabled={status === 'revealed' || status === 'correct'}
                />

                <div className="flex gap-3 w-full justify-center">
                  <Button type="submit" variant="primary" className="flex-1 min-h-[44px] font-mono tracking-wider text-xs font-bold" disabled={status === 'revealed' || status === 'correct'}>
                    SUBMIT [ENTER]
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="min-h-[44px] font-mono tracking-wider text-xs font-bold"
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
                    SKIP PROTOCOL
                  </Button>
                </div>
              </form>

              {(status === 'correct' || status === 'revealed') && (
                <div className="mt-6 mx-auto animate-fade-up text-center p-4 bg-[rgba(0,0,0,0.6)] rounded-lg border border-[rgba(0,255,255,0.3)] w-full max-w-md font-mono">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-neutral)] mb-1">{currentWord.meaning}</h3>
                  <p className="text-xs text-[rgba(255,255,255,0.7)]">
                    {currentWord.thai_pronunciation ? `[${currentWord.thai_pronunciation}] ` : ''}
                    /{currentWord.ipa || 'no ipa'}/
                  </p>
                  <p className={`mt-2 font-bold text-xs ${status === 'correct' ? 'text-[var(--color-primary)]' : 'text-red-400'}`}>
                    {status === 'correct' ? '✓ TARGET DECRYPTED' : '⚡ REVEALED // ADVANCING...'}
                  </p>
                </div>
              )}

              {showHint && status !== 'revealed' && status !== 'correct' && (
                <div className="mt-4 text-[var(--color-neutral)] text-xs font-mono animate-fade-up bg-[rgba(0,0,0,0.5)] py-2 px-4 rounded-lg inline-block border border-white/10">
                  💡 คำอ่าน: <span className="font-mono text-[var(--color-secondary)] ml-1 font-bold">{currentWord.thai_pronunciation || currentWord.ipa || 'N/A'}</span>
                </div>
              )}
              
              {!showHint && status !== 'revealed' && status !== 'correct' && (
                <button 
                  type="button"
                  onClick={() => {
                    playSound('hover');
                    setShowHint(true);
                  }}
                  className="mt-6 text-xs font-mono text-[rgba(255,255,255,0.6)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4"
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
