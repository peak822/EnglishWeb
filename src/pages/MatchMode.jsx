import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { filterWords, THEMES } from '../hooks/useCategories';

const MatchMode = () => {
  const { addExp } = useGamification();
  const [level, setLevel] = useState('all');
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const startNewGame = () => {
    let pool = filterWords(vocabularyData, level);
    if (pool.length < 6) {
      pool = vocabularyData; // Fallback if theme has too few words
    }
    
    // Pick 6 random words
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledPool.slice(0, 6);
    
    // Create 12 cards (6 words, 6 meanings)
    const newCards = [];
    selectedWords.forEach(wordObj => {
      newCards.push({ id: wordObj.id, content: wordObj.word, type: 'word', matchId: wordObj.id });
      newCards.push({ id: `${wordObj.id}_meaning`, content: wordObj.meaning, type: 'meaning', matchId: wordObj.id });
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

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].matchId)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      
      if (firstCard.matchId === secondCard.matchId) {
        // Match!
        setMatchedIds([...matchedIds, firstCard.matchId]);
        setFlippedIndices([]);
        setIsLocked(false);
        
        // Check win condition
        if (matchedIds.length + 1 === 6) {
          setIsWon(true);
          // Reward EXP based on moves (fewer moves = more EXP)
          const baseExp = 30;
          const penalty = Math.max(0, (moves - 6) * 2);
          const finalExp = Math.max(10, baseExp - penalty);
          addExp(finalExp);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="container animate-fade-up">
      <div className="game-container">
        <div className="game-header">
          <h2 className="text-gradient">Memory Match</h2>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="level-select"
          >
            <option value="all">All Words</option>
            <optgroup label="Difficulty Levels">
              <option value="A1">A1 (Beginner)</option>
              <option value="A2">A2 (Elementary)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper Intermediate)</option>
            </optgroup>
            <optgroup label="Learning Themes">
              {THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="game-stats justify-between">
          <div className="stat-item">
            <span>Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-item">
            <span>Pairs:</span>
            <span className="stat-value">{matchedIds.length} / 6</span>
          </div>
          <Button variant="secondary" onClick={startNewGame}>
            Restart
          </Button>
        </div>

        <Card className="p-8 relative">
          {isWon && (
            <div className="absolute inset-0 bg-[rgba(15,23,42,0.8)] backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[var(--radius-lg)] animate-fade-up">
              <h2 className="text-4xl font-bold text-gradient mb-4">You Won! 🎉</h2>
              <p className="text-[var(--color-neutral)] mb-6">Completed in {moves} moves</p>
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
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`match-card transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} ${isMatched ? 'matched' : ''}`}
                >
                  {/* Front of card (Hidden state) */}
                  <div className="match-card-front backface-hidden">
                    <span style={{ fontSize: '2.5rem' }}>❓</span>
                  </div>
                  
                  {/* Back of card (Revealed state) */}
                  <div className={`match-card-back backface-hidden rotate-y-180 ${card.type === 'word' ? 'type-word' : 'type-meaning'}`}>
                    <span className="card-badge">
                      {card.type === 'word' ? '🇬🇧' : '🇹🇭'}
                    </span>
                    <span className="card-text">
                      {card.content}
                    </span>
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
