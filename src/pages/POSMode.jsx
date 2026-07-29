import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Zap, ArrowLeft, RotateCcw } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { generateQuestion } from '../utils/posUtils';
import vocabularyData from '../data/vocabulary.json';
import Card from '../components/Card';

const POSMode = () => {
  const navigate = useNavigate();
  const { addExp } = useGamification();

  const [gameState, setGameState] = useState('idle'); // idle, playing, gameover
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // To handle button flashing for wrong answer
  const [wrongSelection, setWrongSelection] = useState(null);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    setTimeLeft(60);
    setGameState('playing');
    setCurrentQuestion(generateQuestion(vocabularyData));
    setWrongSelection(null);
  };

  const handleAnswer = (selectedPOS) => {
    if (gameState !== 'playing' || !currentQuestion) return;

    if (selectedPOS === currentQuestion.correctPOS) {
      // Correct
      setScore(s => s + 10 + Math.floor(streak / 5) * 5); // Bonus for high streak
      setStreak(s => s + 1);
      setCorrectAnswers(c => c + 1);
      setTimeLeft(t => Math.min(60, t + 1)); // Max 60 seconds
      setWrongSelection(null);
      
      // Next question immediately
      setCurrentQuestion(generateQuestion(vocabularyData));
    } else {
      // Wrong
      setStreak(0);
      setTimeLeft(t => Math.max(0, t - 2)); // Penalty
      setWrongSelection(selectedPOS);
      
      // Clear red flash after 300ms
      setTimeout(() => {
        setWrongSelection(null);
      }, 300);
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeLeft]);

  // Handle Game Over Gamification
  useEffect(() => {
    if (gameState === 'gameover') {
      const expGained = Math.floor(score / 5);
      if (expGained > 0) {
        addExp(expGained);
      }
    }
  }, [gameState, score, addExp]);

  if (gameState === 'idle') {
    return (
      <div className="container animate-fade-up flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
        <div 
          className="text-center mb-8 w-full" 
          style={{ 
            background: 'rgba(2,2,5,0.85)', 
            padding: '3rem 2rem', 
            borderRadius: '1.5rem', 
            border: '1px solid rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(12px)', 
            maxWidth: '650px', 
            margin: '0 auto 2.5rem auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <Zap size={64} className="mx-auto mb-4 animate-pulse" style={{ color: 'var(--color-accent)' }} />
          <h1 className="font-bold mb-4 glitch-hover text-gradient" data-text="Rapid Fire POS" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            Rapid Fire POS
          </h1>
          <p className="text-xl mx-auto leading-relaxed" style={{ color: 'var(--color-secondary)', maxWidth: '500px' }}>
            ท้าทายความเร็วในการแยกแยะชนิดของคำศัพท์ (Part of Speech) <br/>
            ตอบให้ถูกและเร็วที่สุดในเวลา <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>60 วินาที!</span>
          </p>
        </div>
        
        <button 
          className="ui-btn ui-btn-primary flex items-center justify-center gap-2 mb-4"
          style={{ padding: '1rem 2rem', fontSize: '1.25rem', width: '100%', maxWidth: '300px' }}
          onClick={startGame}
        >
          <Zap size={24} />
          <span>เริ่มเกมเลย!</span>
        </button>
        
        <button 
          className="ui-btn ui-btn-secondary flex items-center justify-center gap-2"
          style={{ padding: '0.75rem 2rem', width: '100%', maxWidth: '300px' }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          <span>กลับหน้าแรก</span>
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="container animate-fade-up flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
        <Card className="w-full text-center p-8" style={{ maxWidth: '450px', borderTop: '4px solid var(--color-primary)' }}>
          <h2 className="text-3xl font-bold mb-6 text-gradient">Time's Up!</h2>
          
          <div className="mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
              <span style={{ color: 'var(--color-neutral)' }}>คะแนนรวม</span>
              <span className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{score}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
              <span style={{ color: 'var(--color-neutral)' }}>ตอบถูก</span>
              <span className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }}>{correctAnswers} คำ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
              <span style={{ color: 'var(--color-neutral)' }}>EXP ที่ได้รับ</span>
              <span className="font-bold" style={{ fontSize: '1.25rem', color: '#4ade80' }}>+{Math.floor(score / 5)} EXP</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="ui-btn ui-btn-primary flex items-center justify-center gap-2" style={{ padding: '0.75rem' }} onClick={startGame}>
              <RotateCcw size={18} />
              <span>เล่นอีกครั้ง</span>
            </button>
            <button className="ui-btn ui-btn-secondary flex items-center justify-center gap-2" style={{ padding: '0.75rem' }} onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
              <span>กลับหน้าแรก</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up mx-auto" style={{ maxWidth: '800px' }}>
      {/* Top HUD */}
      <div className="flex items-center justify-between mb-8" style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-4">
          <button style={{ color: 'var(--color-neutral)', cursor: 'pointer' }} onClick={() => setGameState('idle')}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral)' }}>SCORE</span>
            <span className="font-bold font-mono" style={{ fontSize: '1.5rem' }}>{score}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2" style={{ color: 'var(--color-accent)' }}>
          <Zap size={20} fill={streak >= 5 ? "currentColor" : "none"} className={streak >= 5 ? "animate-pulse" : ""} />
          <span className="font-bold font-mono">x{streak}</span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-xl">
          <Timer size={24} style={{ color: timeLeft <= 10 ? '#ef4444' : 'var(--color-primary)' }} className={timeLeft <= 10 ? "animate-pulse" : ""} />
          <span style={{ color: timeLeft <= 10 ? '#ef4444' : 'inherit' }}>{timeLeft}s</span>
        </div>
      </div>
      
      {/* Time Progress Bar */}
      <div className="w-full mb-8" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${(timeLeft / 60) * 100}%`, 
            backgroundColor: timeLeft <= 10 ? '#ef4444' : 'var(--color-primary)',
            transition: 'all 1s linear'
          }}
        />
      </div>

      {/* Word Display */}
      {currentQuestion && (
        <Card className="text-center mb-8" style={{ padding: '4rem 1rem' }}>
          <h2 className="font-bold mb-4 glitch-hover" data-text={currentQuestion.currentWord.word} style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            {currentQuestion.currentWord.word}
          </h2>
          <p style={{ fontSize: '1.5rem', color: 'var(--color-neutral)' }}>
            {currentQuestion.currentWord.meaning}
          </p>
        </Card>
      )}

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {currentQuestion?.options.map((option, index) => {
          const isWrong = wrongSelection === option;
          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={wrongSelection !== null && isWrong}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: isWrong ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.15)',
                background: isWrong ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                color: isWrong ? '#fca5a5' : 'white',
                transform: isWrong ? 'translateX(5px)' : 'scale(1)',
                boxShadow: isWrong ? 'none' : '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                if(!isWrong) {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.background = 'rgba(255,0,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if(!isWrong) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              onMouseDown={(e) => {
                if(!isWrong) e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                if(!isWrong) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default POSMode;
