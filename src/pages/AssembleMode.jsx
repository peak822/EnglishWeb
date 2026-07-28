import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { filterWords, THEMES } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';

const AssembleMode = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [assembledWord, setAssembledWord] = useState([]);
  const [status, setStatus] = useState('idle');
  const [level, setLevel] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let result = filterWords(vocabularyData, level);
    result = [...result].sort(() => 0.5 - Math.random());
    setWords(result);
    setCurrentIndex(0);
    setStatus('idle');
    setIsLoaded(true);
    setShowHint(false);
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
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 1500);
      } else {
        setStatus('incorrect');
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

  if (!currentWord && words.length > 0 && currentIndex >= words.length) {
    return (
      <div className="container animate-fade-up text-center py-20">
        <h2 className="text-gradient text-4xl mb-4">Amazing Job! 🎉</h2>
        <p className="text-[var(--color-neutral)] text-lg mb-8">You have completed all available words in this level!</p>
        <button onClick={() => window.location.href = '/'} className="ui-btn ui-btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient-accent">Assemble Mode</h2>
          <div className="w-48 sm:w-64 z-50">
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span>Word</span>
            <span className="stat-value" style={{ color: 'var(--color-accent)' }}>{words.length > 0 ? currentIndex + 1 : 0} / {words.length}</span>
          </div>
          <div className="stat-item">
            <span>Type</span>
            <span className="stat-value" style={{ color: 'var(--color-accent)' }}>{currentWord ? currentWord.type : '-'}</span>
          </div>
        </div>

        {words.length === 0 ? (
          <Card className="text-center py-16">
            <h3 className="text-xl text-[var(--color-neutral)]">No words available for this level.</h3>
          </Card>
        ) : (
          <Card className="text-center py-16 relative overflow-hidden">
            {status === 'correct' && (
              <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
            )}

            <div className="relative z-10">
              <h3 className="mb-10 text-[var(--color-secondary)] font-medium">Click letters to build the word</h3>
              
              <div className={`letters-container mb-12 ${status === 'incorrect' ? 'shake' : ''}`}>
                {assembledWord.map((slot, i) => (
                  <div 
                    key={i} 
                    className={`letter-slot ${slot ? 'filled' : ''} ${status === 'incorrect' ? 'error' : ''}`}
                    onClick={() => handleSlotClick(slot, i)}
                  >
                    {slot ? slot.char.toUpperCase() : ''}
                  </div>
                ))}
              </div>

              <div className="letters-container border-t border-[rgba(255,255,255,0.05)] pt-12">
                {scrambledLetters.map(letter => (
                  <div 
                    key={letter.id} 
                    className={`letter-block ${letter.used ? 'used' : ''}`}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter.char.toUpperCase()}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col items-center">
                {showHint && status !== 'correct' && (
                  <div className="mb-6 text-[var(--color-neutral)] text-base animate-fade-up bg-[rgba(255,255,255,0.05)] py-3 px-6 rounded-lg border border-[rgba(0,255,255,0.2)]">
                    💡 คำศัพท์ภาษาอังกฤษที่แปลว่า <span className="font-bold text-[var(--color-secondary)] text-lg">"{currentWord.meaning}"</span> คือคำว่าอะไรนะ?
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setAssembledWord(new Array(currentWord.word.length).fill(null));
                      setScrambledLetters(scrambledLetters.map(l => ({ ...l, used: false })));
                      setStatus('idle');
                    }}
                  >
                    Reset Word
                  </Button>
                </div>

                {!showHint && status !== 'correct' && (
                  <button 
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="mt-6 text-btn"
                  >
                    ขอคำใบ้หน่อย
                  </button>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssembleMode;
