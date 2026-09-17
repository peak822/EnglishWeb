import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import sentencesData from '../data/sentences.json';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

const BATCH_SIZE = 15;

const SyntaxMode = () => {
  const navigate = useNavigate();
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledWords, setScrambledWords] = useState([]);
  const [assembledWords, setAssembledWords] = useState([]);
  const [status, setStatus] = useState('idle');
  const [correctCount, setCorrectCount] = useState(0);

  const initRound = () => {
    const shuffled = [...sentencesData].sort(() => 0.5 - Math.random());
    setSentences(shuffled.slice(0, BATCH_SIZE));
    setCurrentIndex(0);
    setStatus('idle');
    setCorrectCount(0);
  };

  useEffect(() => {
    initRound();
  }, []);

  useEffect(() => {
    if (sentences.length > 0 && sentences[currentIndex]) {
      const currentItem = sentences[currentIndex];
      // Reconstruct the full sentence
      const fullSentence = currentItem.sentence.replace('_____', currentItem.word);
      // Split into words and clean terminal punctuation from tokens to prevent giving away the order
      const rawWordsArray = fullSentence.split(/\s+/).filter(w => w.length > 0);
      const cleanedWordsArray = rawWordsArray.map(w => w.replace(/[.,!?;:]+$/, ''));
      
      const wordObjects = cleanedWordsArray.map((word, index) => ({ id: index, word, used: false }));
      
      setScrambledWords(wordObjects.sort(() => 0.5 - Math.random()));
      setAssembledWords(new Array(cleanedWordsArray.length).fill(null));
      setStatus('idle');
    }
  }, [currentIndex, sentences]);

  const currentItem = sentences[currentIndex];

  const handleWordClick = (wordObj) => {
    if (wordObj.used || status === 'correct') return;

    playSound('click');

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
      const rawWordsArray = fullSentence.split(/\s+/).filter(w => w.length > 0);
      const correctCleanedArray = rawWordsArray.map(w => w.replace(/[.,!?;:]+$/, ''));
      const userWordsArray = newAssembled.map(w => w.word);
      
      if (correctCleanedArray.join(' ').toLowerCase() === userWordsArray.join(' ').toLowerCase()) {
        playSound('success');
        setStatus('correct');
        setCorrectCount(prev => prev + 1);
        addExp(20);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 2200);
      } else {
        playSound('click');
        setStatus('incorrect');
        setTimeout(() => {
          setAssembledWords(new Array(correctCleanedArray.length).fill(null));
          setScrambledWords(scrambledWords.map(w => ({ ...w, used: false })));
          setStatus('idle');
        }, 1000);
      }
    }
  };

  const handleSlotClick = (slotObj, index) => {
    if (!slotObj || status === 'correct') return;

    playSound('hover');

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
        <div className="container animate-fade-up text-center py-20" style={{ maxWidth: '650px' }}>
          <div style={{ background: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '16px', padding: '3rem 2rem' }}>
            <Sparkles size={48} className="text-[var(--color-primary)] mx-auto mb-4 animate-bounce" />
            <h2 className="text-gradient text-3xl font-extrabold mb-3">Syntax Protocol Complete! 🎉</h2>
            <p className="text-[var(--color-neutral)] text-base mb-6">
              You constructed <span className="text-[var(--color-primary)] font-bold">{correctCount}</span> out of <span className="font-bold">{sentences.length}</span> sentences correctly!
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
    return <div className="container text-center py-20"><h2 className="text-gradient">Initializing Neural Syntax Tree...</h2></div>;
  }

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '850px', padding: '1.5rem 1rem 4rem 1rem' }}>
      <div className="game-container">
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', color: '#a855f7', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            <span>SECTOR GAMMA // SYNTAX STRUCTURE PROTOCOL</span>
          </div>
          <h2 className="text-gradient-accent mb-2" style={{ fontSize: '1.5rem', fontWeight: '800' }}>Syntax Mode</h2>
          <p className="text-[var(--color-neutral)] text-sm">
            Construct the correct grammatical sentence in order. ({currentIndex + 1} / {sentences.length})
          </p>
        </div>

        <Card className="text-center py-8 md:py-12 px-6 relative overflow-hidden" style={{ border: '1px solid rgba(168, 85, 247, 0.35)' }}>
          {status === 'correct' && (
            <div className="absolute inset-0 bg-[rgba(34,197,94,0.1)] success-pulse z-0 rounded-[var(--radius-lg)]" />
          )}

          <div className="relative z-10">
            {currentItem.translationThai && (
              <div className="mb-6 py-2 px-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] text-[var(--color-secondary)] font-medium text-base inline-block">
                🇹🇭 {currentItem.translationThai}
              </div>
            )}
            
            {/* Assembly Area */}
            <div className={`letters-container flex-wrap justify-center mb-8 ${status === 'incorrect' ? 'shake' : ''}`} style={{ gap: '0.5rem', minHeight: '56px' }}>
              {assembledWords.map((slot, i) => (
                <div 
                  key={i} 
                  className={`letter-slot ${slot ? 'filled' : ''} ${status === 'incorrect' ? 'error' : ''} px-3 md:px-4 text-base md:text-lg rounded-[var(--radius-sm)]`}
                  onClick={() => handleSlotClick(slot, i)}
                  style={{ 
                    width: 'auto', 
                    minWidth: '48px', 
                    height: '2.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: slot ? '2px solid var(--color-primary)' : '1.5px dashed rgba(255,255,255,0.25)',
                    background: slot ? 'rgba(0, 255, 255, 0.15)' : 'rgba(0,0,0,0.35)',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {slot ? slot.word : ''}
                </div>
              ))}
            </div>

            {/* Word Bank */}
            <div className="letters-container flex-wrap justify-center border-t border-[rgba(255,255,255,0.1)] pt-6 md:pt-8" style={{ gap: '0.5rem' }}>
              {scrambledWords.map(wordObj => (
                <div 
                  key={wordObj.id} 
                  className={`letter-block ${wordObj.used ? 'used' : ''} px-3 md:px-4 text-base md:text-lg rounded-[var(--radius-sm)]`}
                  onClick={() => handleWordClick(wordObj)}
                  style={{ 
                    width: 'auto', 
                    minWidth: '48px', 
                    height: '2.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid rgba(168, 85, 247, 0.4)',
                    background: wordObj.used ? 'transparent' : 'rgba(168, 85, 247, 0.15)',
                    color: wordObj.used ? 'transparent' : '#ffffff',
                    cursor: wordObj.used ? 'default' : 'pointer',
                    opacity: wordObj.used ? 0.2 : 1,
                    pointerEvents: wordObj.used ? 'none' : 'auto',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {wordObj.word}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
               <Button 
                variant="secondary" 
                onClick={() => {
                  playSound('click');
                  setAssembledWords(new Array(assembledWords.length).fill(null));
                  setScrambledWords(scrambledWords.map(w => ({ ...w, used: false })));
                  setStatus('idle');
                }}
              >
                Reset Sentence
              </Button>
            </div>
            
            <div className="h-6 mt-4 w-full flex items-center justify-center">
              {status === 'incorrect' && (
                <p className="text-red-400 font-semibold animate-fade-up text-sm">
                  Incorrect sentence order! Try again...
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
