import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Zap, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';
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
      <div className="container animate-fade-up flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-8">
          <Zap size={64} className="mx-auto mb-4 text-[var(--color-accent)] animate-pulse" />
          <h1 className="text-4xl font-bold mb-4 glitch-hover" data-text="Rapid Fire POS">Rapid Fire POS</h1>
          <p className="text-xl text-[var(--color-neutral)] max-w-lg mx-auto">
            ท้าทายความเร็วในการแยกแยะชนิดของคำศัพท์ (Part of Speech) 
            ตอบให้ถูกและเร็วที่สุดในเวลา 60 วินาที!
          </p>
        </div>
        
        <button 
          className="btn-primary text-xl px-8 py-4 flex items-center gap-2 mb-4"
          onClick={startGame}
        >
          <Zap size={24} />
          <span>เริ่มเกมเลย!</span>
        </button>
        
        <button 
          className="btn-ghost flex items-center gap-2"
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
      <div className="container animate-fade-up flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center p-8 border-t-4 border-t-[var(--color-primary)]">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Time's Up!</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-4 rounded-lg">
              <span className="text-[var(--color-neutral)]">คะแนนรวม</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">{score}</span>
            </div>
            <div className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-4 rounded-lg">
              <span className="text-[var(--color-neutral)]">ตอบถูก</span>
              <span className="text-xl font-bold text-[var(--color-accent)]">{correctAnswers} คำ</span>
            </div>
            <div className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-4 rounded-lg">
              <span className="text-[var(--color-neutral)]">EXP ที่ได้รับ</span>
              <span className="text-xl font-bold text-green-400">+{Math.floor(score / 5)} EXP</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="btn-primary flex items-center justify-center gap-2" onClick={startGame}>
              <RotateCcw size={18} />
              <span>เล่นอีกครั้ง</span>
            </button>
            <button className="btn-ghost flex items-center justify-center gap-2" onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
              <span>กลับหน้าแรก</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up max-w-3xl mx-auto">
      {/* Top HUD */}
      <div className="flex items-center justify-between mb-6 bg-[rgba(0,0,0,0.3)] p-4 rounded-xl border border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <button className="text-[var(--color-neutral)] hover:text-white transition-colors" onClick={() => setGameState('idle')}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-neutral)]">SCORE</span>
            <span className="text-xl font-bold font-mono">{score}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[var(--color-accent)]">
          <Zap size={20} fill={streak >= 5 ? "currentColor" : "none"} className={streak >= 5 ? "animate-pulse" : ""} />
          <span className="font-bold font-mono">x{streak}</span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-xl">
          <Timer size={24} className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-[var(--color-primary)]"} />
          <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}s</span>
        </div>
      </div>
      
      {/* Time Progress Bar */}
      <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 60) * 100}%`, backgroundColor: timeLeft <= 10 ? '#EF4444' : 'var(--color-primary)' }}
        />
      </div>

      {/* Word Display */}
      {currentQuestion && (
        <Card className="text-center py-12 mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-5xl sm:text-6xl font-bold mb-4 glitch-hover" data-text={currentQuestion.currentWord.word}>
            {currentQuestion.currentWord.word}
          </h2>
          <p className="text-2xl text-[var(--color-neutral)]">
            {currentQuestion.currentWord.meaning}
          </p>
        </Card>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion?.options.map((option, index) => {
          const isWrong = wrongSelection === option;
          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={wrongSelection !== null && isWrong}
              className={`
                p-6 rounded-xl text-xl font-bold border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-95
                ${isWrong 
                  ? 'border-red-500 bg-red-500/20 text-red-300 translate-x-1' 
                  : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:shadow-[0_0_15px_var(--color-accent)]'}
              `}
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
