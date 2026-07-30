import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import sentencesData from '../data/sentences.json';
import { useGamification } from '../hooks/useGamification';

const SyntaxMode = () => {
  const { addExp } = useGamification();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState([]);
  const [assembledWords, setAssembledWords] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // Shuffle sentences
    const shuffled = [...sentencesData].sort(() => 0.5 - Math.random());
    setSentences(shuffled);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (sentences.length > 0 && sentences[currentIndex]) {
      const currentItem = sentences[currentIndex];
      // Reconstruct the full sentence
      const fullSentence = currentItem.sentence.replace('_____', currentItem.word);
      // Split into words, preserving simple punctuation attached to words
      const wordsArray = fullSentence.split(/\s+/).filter(w => w.length > 0);
      
      const wordObjects = wordsArray.map((word, index) => ({ id: index, word, used: false }));
      
      setScrambledWords(wordObjects.sort(() => 0.5 - Math.random()));
      setAssembledWords(new Array(wordsArray.length).fill(null));
      setStatus('idle');
    }
  }, [currentIndex, sentences]);

  const currentItem = sentences[currentIndex];

  const handleWordClick = (wordObj) => {
    if (wordObj.used || status === 'correct') return;

    const firstEmptyIndex = assembledWords.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return;

    const newAssembled = [...assembledWords];
    newAssembled[firstEmptyIndex] = wordObj;
    setAssembledWords(newAssembled);

    const newScrambled = scrambledWords.map(w => 
      w.id === wordObj.id ? { ...w, used: true } : w
    );
    setScrambledWords(newScrambled);

    if (newAssembled.every(slot => slot !== null)) {
      const fullSentence = currentItem.sentence.replace('_____', currentItem.word);
      const correctWordsArray = fullSentence.split(/\s+/).filter(w => w.length > 0);
      const userWordsArray = newAssembled.map(w => w.word);
      
      if (correctWordsArray.join(' ') === userWordsArray.join(' ')) {
        setStatus('correct');
        addExp(15);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 2000);
      } else {
        setStatus('incorrect');
        setTimeout(() => {
          setAssembledWords(new Array(correctWordsArray.length).fill(null));
          setScrambledWords(scrambledWords.map(w => ({ ...w, used: false })));
          setStatus('idle');
        }, 1000);
      }
    }
  };

  const handleSlotClick = (slotObj, index) => {
    if (!slotObj || status === 'correct') return;

    const newAssembled = [...assembledWords];
    newAssembled[index] = null;
    setAssembledWords(newAssembled);

    const newScrambled = scrambledWords.map(w => 
      w.id === slotObj.id ? { ...w, used: false } : w
    );
    setScrambledWords(newScrambled);
  };

  if (!currentItem) {
    if (sentences.length > 0 && currentIndex >= sentences.length) {
      return (
        <div className="container animate-fade-up text-center py-20">
          <h2 className="text-gradient text-4xl mb-4">Incredible! 🎉</h2>
          <p className="text-[var(--color-neutral)] text-lg mb-8">You have completed all syntax challenges!</p>
          <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
        </div>
      );
    }
    return <div className="container text-center"><h2 className="text-gradient">Loading...</h2></div>;
  }

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header justify-center mb-8">
          <h2 className="text-gradient-accent">Syntax Mode</h2>
        </div>

        <div className="game-stats justify-center">
          <div className="stat-item">
            <span>Sentence</span>
            <span className="stat-value" style={{ color: 'var(--color-accent)' }}>{currentIndex + 1} / {sentences.length}</span>
          </div>
        </div>

        <Card className="text-center py-8 md:py-16 px-6 relative overflow-hidden">
          {status === 'correct' && (
            <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
          )}

          <div className="relative z-10">
            <h3 className="mb-10 text-[var(--color-secondary)] font-medium text-xl">
              Construct the correct sentence
            </h3>
            
            {/* Assembly Area */}
            <div className={`letters-container flex-wrap justify-center mb-12 ${status === 'incorrect' ? 'shake' : ''}`} style={{ gap: '0.5rem', minHeight: '60px' }}>
              {assembledWords.map((slot, i) => (
                <div 
                  key={i} 
                  className={`letter-slot ${slot ? 'filled' : ''} ${status === 'incorrect' ? 'error' : ''} px-2 md:px-4 text-base md:text-xl rounded-[var(--radius-sm)]`}
                  onClick={() => handleSlotClick(slot, i)}
                  style={{ width: 'auto', minWidth: '40px', height: '3rem' }}
                >
                  {slot ? slot.word : ''}
                </div>
              ))}
            </div>

            {/* Word Bank */}
            <div className="letters-container flex-wrap justify-center border-t border-[rgba(255,255,255,0.05)] pt-8 md:pt-12" style={{ gap: '0.5rem' }}>
              {scrambledWords.map(wordObj => (
                <div 
                  key={wordObj.id} 
                  className={`letter-block ${wordObj.used ? 'used' : ''} px-2 md:px-4 text-base md:text-xl rounded-[var(--radius-sm)]`}
                  onClick={() => handleWordClick(wordObj)}
                  style={{ width: 'auto', minWidth: '40px', height: '3rem' }}
                >
                  {wordObj.word}
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
               <Button 
                variant="secondary" 
                onClick={() => {
                  setAssembledWords(new Array(assembledWords.length).fill(null));
                  setScrambledWords(scrambledWords.map(w => ({ ...w, used: false })));
                  setStatus('idle');
                }}
              >
                Reset
              </Button>
            </div>
            
            <div className="h-8 mt-6 w-full flex items-center justify-center">
              {status === 'incorrect' && (
                <p className="text-red-400 font-semibold animate-fade-up">
                  Incorrect! Try again...
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SyntaxMode;
