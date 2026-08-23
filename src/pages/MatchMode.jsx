import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { useGamification } from '../hooks/useGamification';
import { useCyberSound } from '../hooks/useCyberSound';
import { filterWords } from '../hooks/useCategories';
import LevelSelector from '../components/LevelSelector';
import TechBracket from '../components/TechBracket';
import MissionDebriefModal from '../components/MissionDebriefModal';
import { speakText, stopSpeech } from '../utils/audioService';
import { Grid, Flame, Activity, RotateCcw } from 'lucide-react';

const MatchMode = () => {
  const { addExp } = useGamification();
  const { playSound } = useCyberSound();
  const [level, setLevel] = useState('all');
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [matchStreak, setMatchStreak] = useState(0);
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
      pool = vocabularyData;
    }
    
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
    
    if (selectedWords.length < 6) {
      selectedWords.push(...shuffledPool.slice(0, 6 - selectedWords.length));
    }
    
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
    
    const shuffledCards = newCards.sort(() => 0.5 - Math.random());
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsWon(false);
    setIsLocked(false);
    setMatchStreak(0);
    setIsDebriefOpen(false);
  };

  useEffect(() => {
    startNewGame();
  }, [level]);

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flippedIndices.includes(index)) return;
    if (matchedIds.includes(cards[index].matchId)) return;
    if (flippedIndices.length >= 2) return;

    playSound('click');

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
        if (secondCard.type === 'word') {
          playAudio(secondCard.content);
        }
        
        const nextStreak = matchStreak + 1;
        setMatchStreak(nextStreak);
        if (nextStreak >= 2) {
          playSound('combo', { streak: nextStreak });
        } else {
          playSound('success');
        }

        timeoutRef.current = setTimeout(() => {
          setMatchedIds(prev => [...prev, firstCard.matchId]);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 650);
      } else {
        setMatchStreak(0);
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
      const baseExp = 35;
      const penalty = Math.max(0, (moves - totalPairs) * 2);
      const finalExp = Math.max(15, baseExp - penalty);
      addExp(finalExp);
      
      timeoutRef.current = setTimeout(() => {
        setIsDebriefOpen(true);
      }, 700);
    }
  }, [matchedIds.length, isWon, moves, cards.length, addExp]);

  const totalPairs = cards.length > 0 ? cards.length / 2 : 6;

  return (
    <div className="container animate-fade-up px-4 max-w-4xl mx-auto py-6">
      <div className="game-container">
        
        {/* HUD Game Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[rgba(0,242,254,0.3)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] font-bold tracking-wider uppercase">
              <Activity size={15} />
              <span>SECTOR BETA // PROTOCOL: MATCH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-wide">
              Match Mode <span className="text-[#00f2fe] font-mono text-sm">(3D Memory Matrix)</span>
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
        <div className="hud-stats-grid" style={{ '--hud-border': 'rgba(0, 242, 254, 0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>MOVES TAKEN</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>{moves}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase' }}>PAIRS MATCHED</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#00f2fe' }}>
              {matchedIds.length} / {totalPairs}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => {
                playSound('click');
                startNewGame();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-family-mono)',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.85)',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                marginTop: '0.2rem'
              }}
            >
              <RotateCcw size={12} />
              <span>RESTART</span>
            </button>
          </div>
        </div>

        <div className="hud-panel-box" style={{ '--hud-border': 'rgba(0, 242, 254, 0.35)', padding: '1.25rem 0.75rem' }}>
          <TechBracket color="#00f2fe" size={18} />

          <div className="match-grid perspective-1000">
            {cards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
              const isMatched = matchedIds.includes(card.matchId);
              
              return (
                <div 
                  key={card.id || index}
                  onClick={() => handleCardClick(index)}
                  onMouseEnter={() => playSound('hover')}
                  className={`match-card transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} ${isMatched ? 'matched' : ''}`}
                >
                  {/* Front of card (Hidden state) */}
                  <div className="match-card-front backface-hidden bg-[rgba(10,15,30,0.9)] border border-[rgba(0,242,254,0.3)]">
                    <span className="font-mono text-2xl font-bold text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]">
                      [ ? ]
                    </span>
                  </div>
                  
                  {/* Back of card (Revealed state) */}
                  <div className={`match-card-back backface-hidden ${card.type === 'word' ? 'type-word' : 'type-meaning'}`}>
                    <span className="card-badge">
                      {card.type === 'word' ? 'EN' : 'TH'}
                    </span>
                    <span className="card-text font-mono font-bold">
                      {card.content}
                    </span>
                    {card.type === 'word' && card.ipa && (
                      <span className="text-[0.65rem] font-mono text-[var(--color-primary)] opacity-80 mt-1">
                        /{card.ipa}/
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Debrief Modal */}
      <MissionDebriefModal
        isOpen={isDebriefOpen}
        title="MATRIX SYNCHRONIZATION COMPLETE"
        subtitle="SECTOR BETA RECOGNITION"
        score={totalPairs}
        total={Math.max(moves, totalPairs)}
        expGained={Math.max(15, 35 - Math.max(0, (moves - totalPairs) * 2))}
        streakCount={matchStreak}
        onRetry={startNewGame}
        onNext={startNewGame}
        nextLabel="NEXT MATRIX"
      />
    </div>
  );
};

export default MatchMode;
