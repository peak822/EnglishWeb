import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LevelSelector from '../components/LevelSelector';
import vocabularyData from '../data/vocabulary.json';
import { filterWords } from '../hooks/useCategories';
import { useGamification } from '../hooks/useGamification';
import { Heart, Check, X, Zap } from 'lucide-react';

const SwipeMode = () => {
  const { addExp } = useGamification();
  const [level, setLevel] = useState('all');
  const [words, setWords] = useState([]);
  
  // Game State
  const [currentCard, setCurrentCard] = useState(null);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  
  // Animation State
  const [swipeState, setSwipeState] = useState(null); // 'left' or 'right'
  const [swipeFeedback, setSwipeFeedback] = useState(null); // 'success' or 'error'
  const [isTransitioningGameOver, setIsTransitioningGameOver] = useState(false);
  const [showCross, setShowCross] = useState(false);
  
  const timerRef = useRef(null);
  const MAX_CARDS = 20;
  const TIME_PER_CARD = 4000; // 4 seconds

  // Initialize words based on level
  useEffect(() => {
    const filtered = filterWords(vocabularyData, level);
    setWords(filtered);
    resetGame(filtered);
  }, [level]);

  // Generate next card
  const generateNextCard = useCallback((wordList) => {
    if (!wordList || wordList.length < 2) return;
    
    const targetWord = wordList[Math.floor(Math.random() * wordList.length)];
    const isCorrect = Math.random() > 0.5;
    
    let displayedMeaning = targetWord.meaning;
    if (!isCorrect) {
      let randomWord;
      do {
        randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      } while (randomWord.id === targetWord.id);
      displayedMeaning = randomWord.meaning;
    }
    
    setCurrentCard({
      word: targetWord.word,
      meaning: displayedMeaning,
      isCorrect
    });
    setTimeLeft(100);
  }, []);



  const handleMistake = useCallback(() => {
    setShowCross(true);
    setTimeout(() => setShowCross(false), 400);

    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setIsTransitioningGameOver(true);
        setTimeout(() => {
          setIsTransitioningGameOver(false);
          setIsGameOver(true);
        }, 2500); // Dramatic slow-mo wait
      }
      return newLives;
    });
    setCombo(0);
  }, []);

  const handleSuccess = useCallback(() => {
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(current => Math.max(current, newCombo));
      return newCombo;
    });
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= MAX_CARDS) {
        setHasWon(true);
        setIsGameOver(true);
      }
      return newScore;
    });
  }, []);

  const handleSwipe = useCallback((direction) => {
    if (isGameOver || hasWon || isTransitioningGameOver || swipeState || !currentCard) return;

    if (direction === 'timeout') {
      handleMistake();
      setSwipeFeedback('error');
      setSwipeState('left');
    } else {
      const userThinksCorrect = direction === 'right';
      const isActuallyCorrect = currentCard.isCorrect;

      if (userThinksCorrect === isActuallyCorrect) {
        handleSuccess();
        setSwipeFeedback('success');
      } else {
        handleMistake();
        setSwipeFeedback('error');
      }
      setSwipeState(direction);
    }

    // Wait for animation to finish before generating next
    setTimeout(() => {
      setSwipeState(null);
      setSwipeFeedback(null);
      if (!isGameOver && !hasWon) {
        generateNextCard(words);
      }
    }, 300);
  }, [currentCard, isGameOver, hasWon, swipeState, handleSuccess, handleMistake, words, generateNextCard]);

  // Timer logic
  useEffect(() => {
    if (isGameOver || hasWon || isTransitioningGameOver || swipeState || !currentCard) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          handleSwipe('timeout');
          return 0;
        }
        return prev - (100 / (TIME_PER_CARD / 50));
      });
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCard, isGameOver, hasWon, swipeState, handleSwipe]);

  // Swipe/Pointer handlers
  const pointerStartX = useRef(null);
  const handlePointerDown = (e) => {
    // Prevent default drag behavior for images/text
    if (e.target.tagName !== 'BUTTON') {
      pointerStartX.current = e.clientX;
      e.target.setPointerCapture(e.pointerId);
    }
  };
  
  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const pointerEndX = e.clientX;
    const diff = pointerEndX - pointerStartX.current;
    
    if (Math.abs(diff) > 50) { // Threshold for swipe
      if (diff > 0) handleSwipe('right');
      else handleSwipe('left');
    }
    
    e.target.releasePointerCapture(e.pointerId);
    pointerStartX.current = null;
  };

  const handlePointerCancel = (e) => {
    if (pointerStartX.current !== null) {
      e.target.releasePointerCapture(e.pointerId);
      pointerStartX.current = null;
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  // End Game EXP
  useEffect(() => {
    if ((isGameOver || hasWon) && score > 0) {
      const baseExp = score * 5;
      const comboBonus = maxCombo * 2;
      addExp(baseExp + comboBonus);
    }
  }, [isGameOver, hasWon]);

  const resetGame = (wordList = words) => {
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setSwipeState(null);
    if (wordList.length > 0) {
      generateNextCard(wordList);
    }
  };

  if (isGameOver || hasWon) {
    return (
      <div className="container animate-fade-up flex justify-center items-center min-h-[60vh]">
        <Card className="p-10 text-center max-w-md w-full shadow-2xl border border-white/10">
          <h2 className={`text-5xl font-bold mb-6 ${hasWon ? 'text-gradient' : 'text-red-500'}`}>
            {hasWon ? 'Victory! 🎉' : 'Game Over'}
          </h2>
          <div className="text-[var(--color-neutral)] text-xl mb-8 space-y-4">
            <p>Score: <span className="text-white font-bold">{score} / {MAX_CARDS}</span></p>
            <p>Max Combo: <span className="text-[var(--color-primary)] font-bold">{maxCombo}</span></p>
          </div>
          <Button onClick={resetGame} variant="primary" className="w-full">Play Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Full-screen feedback glow */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 ${
          swipeFeedback === 'success' ? 'feedback-glow-success' : 
          swipeFeedback === 'error' ? 'feedback-glow-error' : 
          'bg-transparent'
        }`}
      />
      <div className={`container animate-fade-up relative z-10 ${showCross || isTransitioningGameOver ? 'camera-shake' : ''}`}>
      
      {/* Dramatic Game Over Transition */}
      {isTransitioningGameOver && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center dramatic-overlay pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-black text-white slam-text tracking-widest uppercase">Game Over</h1>
        </div>
      )}
      
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Speed Swipe</h2>
          <div className="w-48 sm:w-64 z-50">
            <LevelSelector value={level} onChange={setLevel} />
          </div>
        </div>

        <div className="game-stats flex flex-wrap justify-center sm:justify-between items-center gap-4 mb-6">
          <div className="flex gap-1 text-red-500">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={24} fill={i < lives ? 'currentColor' : 'none'} className={i < lives ? 'animate-pulse' : 'opacity-30'} />
            ))}
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="text-[var(--color-neutral)]">Score:</span> 
            {score}/{MAX_CARDS}
          </div>
          <div className={`text-xl font-bold flex items-center gap-2 ${combo > 2 ? 'text-[var(--color-primary)]' : 'text-white'}`}>
            <Zap size={20} fill={combo > 2 ? 'currentColor' : 'none'} />
            Combo x{combo}
          </div>
        </div>

        {currentCard && (
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-sm md:text-base text-[var(--color-neutral)] mb-4 text-center max-w-md leading-relaxed">
              <div className="mb-1">Swipe <strong className="text-green-400">Right ➡️</strong> if correct (ปัดขวาถ้าแปล <strong className="text-green-400">ถูก</strong>)</div>
              <div>Swipe <strong className="text-red-400">⬅️ Left</strong> if wrong (ปัดซ้ายถ้าแปล <strong className="text-red-400">ผิด</strong>)</div>
            </div>

            <div 
              className={`swipe-card-container relative w-full max-w-sm ${swipeState === 'left' ? 'swipe-left-anim' : swipeState === 'right' ? 'swipe-right-anim' : ''} cursor-grab active:cursor-grabbing`}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <Card className={`p-6 sm:p-10 text-center relative overflow-hidden h-64 sm:h-80 flex flex-col justify-center items-center shadow-2xl border-2 select-none transition-all duration-200 ${
                swipeFeedback === 'success' ? 'border-green-400 bg-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : 
                swipeFeedback === 'error' ? 'border-red-400 bg-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 
                'border-white/10'
              }`}>
                {/* Cross Stamp on Mistake */}
                {showCross && <div className="cross-stamp">❌</div>}

                {/* Timer Bar */}
                <div 
                  className={`absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-400 to-[var(--color-primary)] transition-all duration-75`}
                  style={{ width: `${timeLeft}%`, backgroundColor: timeLeft < 30 ? 'red' : '' }}
                />
                
                <h3 className="text-4xl font-bold text-white mb-6 tracking-wide">{currentCard.word}</h3>
                <div className="w-16 h-1 bg-white/20 mx-auto rounded-full mb-6"></div>
                <p className="text-2xl text-[var(--color-secondary)] font-medium leading-relaxed">{currentCard.meaning}</p>
                
              </Card>
            </div>
            
            {/* Helper buttons */}
            <div className="flex gap-8 mt-8">
               <button onClick={() => handleSwipe('left')} className="p-4 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 transition-colors">
                 <X size={32} />
               </button>
               <button onClick={() => handleSwipe('right')} className="p-4 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/40 transition-colors">
                 <Check size={32} />
               </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default SwipeMode;
