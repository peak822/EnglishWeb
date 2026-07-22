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
    <div className="container" style={{ animation: 'fadeUp 0.5s ease-out forwards' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>SRS Flashcards</h2>
        <p style={{ color: 'var(--color-neutral)' }}>
          Review {currentIndex + 1} of {sessionWords.length}
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }} className="perspective-1000">
        <div 
          className={`relative w-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ minHeight: '350px' }}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Front of card */}
          <Card className="absolute srs-card-front backface-hidden shadow-2xl">
            <p className="word-type">{currentWord.type}</p>
            <h3 className="srs-title">{currentWord.word}</h3>
            <p style={{ color: 'var(--color-neutral)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Click to reveal meaning</p>
          </Card>

          {/* Back of card */}
          <Card className="absolute srs-card-back backface-hidden rotate-y-180 shadow-2xl">
            <h3 className="srs-title" style={{ color: '#fff' }}>{currentWord.word}</h3>
            <p className="srs-ipa">/{currentWord.ipa || 'no ipa'}/</p>
            
            <div className="srs-meaning-box">
              <p className="srs-meaning">{currentWord.meaning || 'No translation available'}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ color: 'var(--color-neutral)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>How well did you know this?</p>
              <div className="srs-buttons">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(1); }}
                  className="srs-btn srs-btn-hard"
                >
                  Hard
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(3); }}
                  className="srs-btn srs-btn-good"
                >
                  Good
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleReview(5); }}
                  className="srs-btn srs-btn-easy"
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
