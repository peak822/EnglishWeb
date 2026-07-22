import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useSRS } from '../hooks/useSRS';
import { useGamification } from '../hooks/useGamification';

const SRSMode = () => {
  const { getDueWords, reviewWord, getStats } = useSRS();
  const { addExp } = useGamification();
  
  const [sessionWords, setSessionWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalReviewed: 0, matureCards: 0, learningCards: 0 });

  useEffect(() => {
    // Load up to 20 words for this session
    const due = getDueWords(vocabularyData, 20);
    setSessionWords(due);
    setStats(getStats());
  }, [getDueWords, getStats]);

  const handleReview = (quality) => {
    const currentWord = sessionWords[currentIndex];
    reviewWord(currentWord.id, quality);
    
    if (quality >= 3) {
      addExp(5); // Reward 5 EXP for Good/Easy
    } else {
      addExp(1); // Reward 1 EXP for Hard/Wrong (participation)
    }

    setIsFlipped(false);
    
    if (currentIndex + 1 < sessionWords.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      setStats(getStats());
    }
  };

  if (isFinished || sessionWords.length === 0) {
    return (
      <div className="container animate-fade-up text-center py-20">
        <h2 className="text-gradient text-4xl mb-4">Daily Review Complete! 🎉</h2>
        <p className="text-[var(--color-neutral)] text-lg mb-8">You have reviewed {sessionWords.length} words today.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
          <Card className="p-6">
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalReviewed}</h3>
            <p className="text-[var(--color-neutral)] text-sm">Total Words Learning</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-3xl font-bold text-[var(--color-primary)] mb-2">{stats.matureCards}</h3>
            <p className="text-[var(--color-neutral)] text-sm">Mastered (Mature)</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-3xl font-bold text-[var(--color-accent)] mb-2">{stats.learningCards}</h3>
            <p className="text-[var(--color-neutral)] text-sm">Currently Learning</p>
          </Card>
        </div>
        
        <Button onClick={() => window.location.href = '/'}>Back to Home</Button>
      </div>
    );
  }

  const currentWord = sessionWords[currentIndex];

  return (
    <div className="container animate-fade-up">
      <div className="text-center mb-10">
        <h2 className="text-gradient mb-4">SRS Flashcards</h2>
        <p className="text-[var(--color-neutral)]">
          Review {currentIndex + 1} of {sessionWords.length}
        </p>
      </div>

      <div className="max-w-xl mx-auto perspective-1000">
        <div 
          className={`relative w-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ minHeight: '350px' }}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Front of card */}
          <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-10 shadow-2xl border-2 border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] transition-colors">
            <p className="text-[var(--color-primary)] font-mono text-sm mb-4 bg-[rgba(0,225,255,0.1)] px-3 py-1 rounded-full">{currentWord.type}</p>
            <h3 className="text-5xl font-bold text-white mb-8">{currentWord.word}</h3>
            <p className="text-[var(--color-neutral)] animate-pulse">Click to reveal meaning</p>
          </Card>

          {/* Back of card */}
          <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-10 shadow-2xl border-2 border-[var(--color-primary)] bg-[rgba(15,23,42,0.95)]">
            <h3 className="text-4xl font-bold text-white mb-2">{currentWord.word}</h3>
            <p className="text-[var(--color-neutral)] font-mono text-lg mb-6">/{currentWord.ipa || 'no ipa'}/</p>
            
            <div className="bg-[rgba(255,255,255,0.05)] w-full py-4 rounded-xl mb-8">
              <p className="text-2xl font-semibold text-[var(--color-accent)]">{currentWord.meaning || 'No translation available'}</p>
            </div>

            <div className="w-full">
              <p className="text-[var(--color-neutral)] text-sm mb-3">How well did you know this?</p>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(1); }}
                  className="py-3 rounded-lg bg-[rgba(239,68,68,0.1)] text-[rgb(248,113,113)] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.2)] font-semibold transition-colors"
                >
                  Hard
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(3); }}
                  className="py-3 rounded-lg bg-[rgba(234,179,8,0.1)] text-[rgb(250,204,21)] border border-[rgba(234,179,8,0.2)] hover:bg-[rgba(234,179,8,0.2)] font-semibold transition-colors"
                >
                  Good
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(5); }}
                  className="py-3 rounded-lg bg-[rgba(34,197,94,0.1)] text-[rgb(74,222,128)] border border-[rgba(34,197,94,0.2)] hover:bg-[rgba(34,197,94,0.2)] font-semibold transition-colors"
                >
                  Easy
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SRSMode;
