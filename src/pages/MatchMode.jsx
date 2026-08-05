import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import { speakText, stopSpeech } from '../utils/audioService';

const MatchMode = () => {
  const { addExp } = useGamification();
  const [level, setLevel] = useState('all');
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopSpeech();
    };
  }, []);

  const playAudio = (text) => {
    speakText(text);
  };

  const startNewGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    let pool = filterWords(vocabularyData, level);
    if (pool.length < 6) {
      pool = vocabularyData; // Fallback if theme has too few words
    }
    
    // Pick 6 random words with distinct meanings to prevent ambiguity
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedWords = [];
    const usedMeanings = new Set();
    
    for (const w of shuffledPool) {
      if (w.meaning && !usedMeanings.has(w.meaning)) {
        selectedWords.push(w);
        usedMeanings.add(w.meaning);
      }
      if (selectedWords.length === 6) break;
    }
    
    // Fallback if not enough distinct meanings
    if (selectedWords.length < 6) {
      selectedWords.push(...shuffledPool.slice(0, 6 - selectedWords.length));
    }
    
    // Create 12 cards (6 words, 6 meanings)
    const newCards = [];
    selectedWords.forEach(wordObj => {
      newCards.push({ 
        id: `word_${wordObj.id}`, 
        content: wordObj.word, 
        type: 'word', 
        matchId: wordObj.id,
        ipa: wordObj.ipa,
        level: wordObj.level
      });
      newCards.push({ 
        id: `meaning_${wordObj.id}`, 
        content: wordObj.meaning, 
        type: 'meaning', 
        matchId: wordObj.id,
        level: wordObj.level
      });
    });
    
    // Shuffle the 12 cards
    const shuffledCards = newCards.sort(() => 0.5 - Math.random());
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsWon(false);
    setIsLocked(false);
  };

  useEffect(() => {
    startNewGame();
  }, [level]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].matchId)) return;
    if (flippedIndices.length >= 2) return;

    const clickedCard = cards[index];
    if (clickedCard.type === 'word') {
      playAudio(clickedCard.content);
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);
      
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      
      if (firstCard.matchId === secondCard.matchId) {
        // If the second card is the word, pronounce it
        if (secondCard.type === 'word') {
          playAudio(secondCard.content);
        }
        // Match! Add a delay so the user can see the cards before they settle
        timeoutRef.current = setTimeout(() => {
          setMatchedIds(prev => [...prev, firstCard.matchId]);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 650);
      } else {
        // No match
        timeoutRef.current = setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  useEffect(() => {
    const totalPairs = cards.length > 0 ? cards.length / 2 : 6;
    if (matchedIds.length > 0 && matchedIds.length === totalPairs && !isWon) {
      setIsWon(true);
      const baseExp = 30;
      const penalty = Math.max(0, (moves - totalPairs) * 2);
      const finalExp = Math.max(10, baseExp - penalty);
      addExp(finalExp);
    }
  }, [matchedIds.length, isWon, moves, cards.length, addExp]);

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Memory Match</h2>
          <div className="w-48 sm:w-64 z-50">
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
          </div>
        </div>

        <div className="game-stats justify-between">
          <div className="stat-item">
            <span>Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-item">
            <span>Pairs:</span>
            <span className="stat-value">{matchedIds.length} / {cards.length > 0 ? cards.length / 2 : 6}</span>
          </div>
          <Button variant="secondary" onClick={startNewGame}>
            Restart
          </Button>
        </div>

        <Card className="p-4 sm:p-8 relative">
          {isWon && (
            <div className="absolute inset-0 bg-[rgba(15,23,42,0.85)] backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[var(--radius-lg)] animate-fade-up p-6 text-center">
              <h2 className="text-4xl font-bold text-gradient mb-3">You Won! 🎉</h2>
              <p className="text-[var(--color-neutral)] mb-6 text-lg">Completed in {moves} moves</p>
              <Button variant="primary" onClick={startNewGame} className="w-48">
                Play Again
              </Button>
            </div>
          )}

          <div className="match-grid perspective-1000">
            {cards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
              const isMatched = matchedIds.includes(card.matchId);
              
              return (
                <div 
                  key={card.id || index}
                  onClick={() => handleCardClick(index)}
                  className={`match-card transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} ${isMatched ? 'matched' : ''}`}
                >
                  {/* Front of card (Hidden state) */}
                  <div className="match-card-front backface-hidden">
                    <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.3))' }}>❓</span>
                  </div>
                  
                  {/* Back of card (Revealed state) */}
                  <div className={`match-card-back backface-hidden ${card.type === 'word' ? 'type-word' : 'type-meaning'}`}>
                    <span className="card-badge">
                      {card.type === 'word' ? '🇬🇧' : '🇹🇭'}
                    </span>
                    <span className="card-text">
                      {card.content}
                    </span>
                    {card.type === 'word' && card.ipa && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        /{card.ipa}/
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MatchMode;
