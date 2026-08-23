import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { filterWords } from '../hooks/useCategories';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import { Puzzle, Flame, Activity } from 'lucide-react';

const AssembleMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [assembledWord, setAssembledWord] = useState([]);
  const [status, setStatus] = useState('idle');
  const [level, setLevel] = useState('all');
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
    <div className="container animate-fade-up px-4 max-w-4xl mx-auto py-6">
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[rgba(188,19,254,0.3)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e879f9] font-bold tracking-wider uppercase">
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: ASSEMBLE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-wide">
              Assemble Mode <span className="text-[#e879f9] font-mono text-sm">(Data Anagrams)</span>
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
        <div className="grid grid-cols-3 gap-2 p-3 mb-6 rounded-lg bg-[rgba(10,15,30,0.85)] border border-[rgba(188,19,254,0.3)] font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">PROGRESS</span>
            <span className="font-bold text-sm text-[var(--color-primary)]">
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 15)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[rgba(255,255,255,0.1)]">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">STREAK COMBO</span>
            <span className="font-bold text-sm text-[#e879f9] flex items-center gap-1">
              <Flame size={14} />
              {streak}x
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">TYPE</span>
            <span className="font-bold text-sm text-[var(--color-accent)] uppercase">
              {currentWord ? currentWord.type : '-'}
            </span>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="text-center py-8 md:py-16">
            <h3 className="text-xl text-[var(--color-neutral)] font-mono">No data fragments for this clearance level.</h3>
          </Card>
        ) : (
          <div className="relative p-6 sm:p-10 rounded-xl bg-[rgba(10,15,30,0.9)] border border-[rgba(188,19,254,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(188,19,254,0.05)] overflow-hidden">
            <TechBracket color="#e879f9" size={18} />

            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(188,19,254,0.1)] animate-pulse z-0" />
            )}

            <div className="relative z-10 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[rgba(188,19,254,0.1)] border border-[rgba(188,19,254,0.3)] text-[0.7rem] font-mono tracking-widest text-[#e879f9] uppercase mb-4">
                TRANSLATION TARGET: {currentWord.meaning}
              </span>
              
              <div className={`letters-container mb-8 flex justify-center gap-2 flex-wrap ${status === 'incorrect' ? 'shake' : ''}`}>
                {assembledWord.map((slot, i) => (
                  <div 
                    key={i} 
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg flex items-center justify-center font-mono font-bold text-xl sm:text-2xl border-2 cursor-pointer transition-all ${
                      slot 
                        ? 'bg-[rgba(0,255,255,0.15)] border-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
                        : 'bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.15)] text-transparent'
                    } ${status === 'incorrect' ? 'border-red-500 bg-red-950/40' : ''}`}
                    onClick={() => handleSlotClick(slot, i)}
                  >
                    {slot ? slot.char.toUpperCase() : ''}
                  </div>
                ))}
              </div>

              {/* Scrambled Available Letter Blocks */}
              <div className="letters-container border-t border-[rgba(255,255,255,0.1)] pt-6 flex justify-center gap-2 flex-wrap">
                {scrambledLetters.map(letter => (
                  <button 
                    key={letter.id} 
                    disabled={letter.used || status === 'correct'}
                    className={`w-11 h-13 sm:w-13 sm:h-15 rounded-lg flex items-center justify-center font-mono font-bold text-lg sm:text-xl border transition-all ${
                      letter.used 
                        ? 'opacity-20 pointer-events-none border-transparent bg-transparent' 
                        : 'bg-[rgba(188,19,254,0.15)] border-[rgba(188,19,254,0.4)] text-white hover:bg-[rgba(188,19,254,0.3)] hover:scale-105 shadow-[0_0_10px_rgba(188,19,254,0.2)]'
                    }`}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter.char.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col items-center">
                {showHint && status !== 'correct' && (
                  <div className="mb-4 text-[#e879f9] text-xs font-mono animate-fade-up bg-[rgba(0,0,0,0.6)] py-2 px-4 rounded-lg border border-[rgba(188,19,254,0.3)]">
                    💡 คำอ่าน: <span className="text-white font-bold">{currentWord.thai_pronunciation || currentWord.ipa || 'N/A'}</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
                  <Button 
                    variant="secondary" 
                    className="w-full font-mono text-xs tracking-wider"
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
                    className="mt-4 text-xs font-mono text-[rgba(255,255,255,0.6)] hover:text-[var(--color-primary)] transition-colors underline underline-offset-4"
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
