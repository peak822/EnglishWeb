import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import vocabularyData from '../data/vocabulary.json';
import { HelpCircle, Flame, Activity } from 'lucide-react';

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
    <div className="container animate-fade-up px-4 max-w-4xl mx-auto py-6">
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[rgba(251,191,36,0.3)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#fbbf24] font-bold tracking-wider uppercase">
              <Activity size={15} />
              <span>SECTOR ALPHA // PROTOCOL: GUESS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-wide">
              Guess Mode <span className="text-[#fbbf24] font-mono text-sm">(Clue Deduction)</span>
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
        <div className="grid grid-cols-3 gap-2 p-3 mb-6 rounded-lg bg-[rgba(10,15,30,0.85)] border border-[rgba(251,191,36,0.3)] font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">PROGRESS</span>
            <span className="font-bold text-sm text-[var(--color-primary)]">
              {words.length > 0 ? currentIndex + 1 : 0} / {Math.min(words.length, 15)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[rgba(255,255,255,0.1)]">
            <span className="text-[rgba(255,255,255,0.5)] text-[0.65rem] uppercase">STREAK COMBO</span>
            <span className="font-bold text-sm text-[#fbbf24] flex items-center gap-1">
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
            <h3 className="text-xl text-[var(--color-neutral)] font-mono">No tactical words found for this clearance level.</h3>
          </Card>
        ) : (
          <div className="relative p-6 sm:p-10 rounded-xl bg-[rgba(10,15,30,0.9)] border border-[rgba(251,191,36,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(251,191,36,0.05)] overflow-hidden">
            <TechBracket color="#fbbf24" size={18} />

            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(251,191,36,0.1)] animate-pulse z-0" />
            )}

            <div className="relative z-10 text-center flex flex-col items-center">
              {status === 'correct' ? (
                <div className="py-6 flex flex-col items-center animate-fade-up w-full font-mono">
                  <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-2">TARGET VERIFIED</span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-1">{currentWord.word}</h3>
                  <p className="text-xs text-[rgba(255,255,255,0.7)] mb-4">/{currentWord.ipa || 'no ipa'}/</p>
                  <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.6)] border border-[rgba(251,191,36,0.4)] max-w-sm w-full">
                    <p className="text-base text-[var(--color-primary)] font-bold">{currentWord.meaning}</p>
                  </div>
                  <p className="mt-4 text-green-400 font-bold text-xs">
                    + {hintLevel === 0 ? 10 : hintLevel === 1 ? 5 : 2} EXP GRANTED
                  </p>
                </div>
              ) : (
                <>
                  <span className="inline-block px-3 py-1 rounded-full bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)] text-[0.7rem] font-mono tracking-widest text-[#fbbf24] uppercase mb-4">
                    DECRYPT THE TARGET BY MEANING
                  </span>

                  <div className="w-full max-w-xl p-5 mb-8 rounded-xl bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.15)] shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]">
                    <span className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] font-sans">
                      {currentWord.meaning}
                    </span>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg ${status === 'incorrect' ? 'shake' : ''}`}>
                    {options.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-[rgba(10,15,30,0.8)] border-[rgba(255,255,255,0.15)] text-white hover:border-[var(--color-primary)] hover:bg-[rgba(0,255,255,0.1)]';
                      
                      if (status === 'correct' && opt === currentWord.word) {
                        btnStyle = 'bg-green-600/30 border-green-400 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
                      } else if (status === 'incorrect' && isSelected) {
                        btnStyle = 'bg-red-600/30 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
                      }
                      
                      return (
                        <button 
                          key={i} 
                          className={`p-3.5 rounded-lg border font-mono font-bold text-base transition-all tracking-wider ${btnStyle}`}
                          onClick={() => handleGuess(opt)}
                          onMouseEnter={() => playSound('hover')}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="h-6 mt-4 w-full flex items-center justify-center">
                    {status === 'incorrect' && (
                      <p className="text-red-400 font-mono text-xs font-bold animate-fade-up">
                        MISMATCH DETECTED // RETRYING...
                      </p>
                    )}
                  </div>

                  {/* Hint Section */}
                  <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] w-full flex flex-col items-center">
                    {hintLevel < 2 && status !== 'correct' && (
                      <button 
                        type="button"
                        onClick={() => {
                          playSound('hover');
                          setHintLevel(prev => prev + 1);
                        }}
                        className="text-xs font-mono text-[rgba(255,255,255,0.6)] hover:text-[#fbbf24] transition-colors underline underline-offset-4"
                      >
                        [ Request Clue Hint (EXP Reduced) ]
                      </button>
                    )}
                    
                    {hintLevel > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(251,191,36,0.3)] font-mono text-xs text-[#fbbf24] text-center max-w-sm">
                        {hintLevel >= 1 && (
                          <p>
                            PART OF SPEECH: <span className="text-white font-bold">{currentWord.type || "N/A"}</span>
                          </p>
                        )}
                        {hintLevel >= 2 && (
                          <p className="mt-1 pt-1 border-t border-[rgba(255,255,255,0.1)]">
                            PRONUNCIATION: <span className="text-white font-bold">/{currentWord.ipa || currentWord.thai_pronunciation || "N/A"}/</span>
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
