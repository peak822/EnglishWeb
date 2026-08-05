import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Zap, ArrowLeft, RotateCcw, Volume2, Trophy, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { generateQuestion, POS_DETAILS } from '../utils/posUtils';
import vocabularyData from '../data/vocabulary.json';
import { speakText, stopSpeech } from '../utils/audioService';

const POSMode = () => {
  const navigate = useNavigate();
  const { addExp } = useGamification();

  const [gameState, setGameState] = useState('idle'); // idle, playing, gameover
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Feedback states
  const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'wrong', pos: string }
  const [scorePopup, setScorePopup] = useState(null);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const playWordAudio = (text) => {
    speakText(text);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setTimeLeft(60);
    setFeedback(null);
    setScorePopup(null);
    setGameState('playing');
    
    const firstQ = generateQuestion(vocabularyData);
    setCurrentQuestion(firstQ);
    if (firstQ?.currentWord?.word) {
      playWordAudio(firstQ.currentWord.word);
    }
  };

  const handleAnswer = (selectedPOS) => {
    if (gameState !== 'playing' || !currentQuestion || feedback) return;

    setTotalAnswered(t => t + 1);

    if (selectedPOS === currentQuestion.correctPOS) {
      // Correct answer
      const streakBonus = Math.floor(streak / 5) * 5;
      const pointsGained = 10 + streakBonus;
      
      setScore(s => s + pointsGained);
      setStreak(s => {
        const next = s + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
      setCorrectAnswers(c => c + 1);
      setTimeLeft(t => Math.min(60, t + 1));
      
      setFeedback({ type: 'correct', pos: selectedPOS });
      setScorePopup(`+${pointsGained}`);

      setTimeout(() => {
        setFeedback(null);
        setScorePopup(null);
        const nextQ = generateQuestion(vocabularyData);
        setCurrentQuestion(nextQ);
        if (nextQ?.currentWord?.word) {
          playWordAudio(nextQ.currentWord.word);
        }
      }, 250);
    } else {
      // Wrong answer
      setStreak(0);
      setTimeLeft(t => Math.max(0, t - 2));
      setFeedback({ type: 'wrong', pos: selectedPOS });
      setScorePopup('-2s');

      setTimeout(() => {
        setFeedback(null);
        setScorePopup(null);
      }, 350);
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

  // IDLE SCREEN
  if (gameState === 'idle') {
    return (
      <div className="pos-game-wrapper animate-fade-up" style={{ minHeight: '80vh', justifyContent: 'center' }}>
        <div className="pos-modal-card pos-glass-card">
          <div className="pos-icon-circle" style={{ background: 'rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.35)' }}>
            <Zap size={44} className="animate-pulse" style={{ color: 'var(--color-primary)' }} />
          </div>
          
          <h1 className="font-extrabold text-gradient mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Rapid Fire POS
          </h1>
          
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 auto 1.5rem auto', maxWidth: '480px' }}>
            ทดสอบความไวในการแยกแยะชนิดของคำศัพท์ (Part of Speech)<br/>
            ตอบให้ถูกและเร็วที่สุดเพื่อเก็บคอมโบในเวลา <span style={{ color: '#00ffff', fontWeight: 'bold' }}>60 วินาที!</span>
          </p>

          {/* Quick Guide Grid */}
          <div className="pos-guide-grid">
            {Object.entries(POS_DETAILS).slice(0, 4).map(([key, info]) => (
              <div key={key} className="pos-guide-item" style={{ border: `1px solid ${info.border}` }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{info.icon}</div>
                <div style={{ color: info.color, fontWeight: 800, fontSize: '0.85rem' }}>{info.nameEn}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{info.nameTh}</div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center', marginTop: '1.5rem' }}>
            <button className="pos-primary-btn" onClick={startGame}>
              <Zap size={22} fill="currentColor" />
              <span>เริ่มเกมทันที!</span>
            </button>
            
            <button className="pos-secondary-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GAME OVER SCREEN
  if (gameState === 'gameover') {
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    const expEarned = Math.floor(score / 5);

    return (
      <div className="pos-game-wrapper animate-fade-up" style={{ minHeight: '80vh', justifyContent: 'center' }}>
        <div className="pos-modal-card pos-glass-card" style={{ maxWidth: '480px' }}>
          <div className="pos-icon-circle" style={{ background: 'rgba(250, 204, 21, 0.12)', border: '1px solid rgba(250, 204, 21, 0.4)' }}>
            <Trophy size={42} style={{ color: '#facc15' }} />
          </div>

          <h2 className="text-3xl font-extrabold text-gradient mb-1">Time's Up!</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>สรุปผลการแข่งขัน Rapid Fire POS</p>
          
          <div className="pos-stats-list">
            <div className="pos-stat-row">
              <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>คะแนนรวม</span>
              <span style={{ color: '#00ffff', fontWeight: 900, fontFamily: 'var(--font-family-mono)', fontSize: '1.75rem' }}>{score}</span>
            </div>
            
            <div className="pos-stat-row">
              <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>ความแม่นยำ</span>
              <span style={{ color: '#4ade80', fontWeight: 800, fontFamily: 'var(--font-family-mono)', fontSize: '1.2rem' }}>
                {correctAnswers} / {totalAnswered} ({accuracy}%)
              </span>
            </div>
            
            <div className="pos-stat-row">
              <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>คอมโบสูงสุด</span>
              <span style={{ color: '#facc15', fontWeight: 800, fontFamily: 'var(--font-family-mono)', fontSize: '1.2rem' }}>
                🔥 x{maxStreak}
              </span>
            </div>

            <div className="pos-stat-row" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <span style={{ color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                <Sparkles size={18} /> EXP ที่ได้รับ
              </span>
              <span style={{ color: '#4ade80', fontWeight: 900, fontFamily: 'var(--font-family-mono)', fontSize: '1.35rem' }}>
                +{expEarned} EXP
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', marginTop: '1.25rem' }}>
            <button className="pos-primary-btn" style={{ width: '100%' }} onClick={startGame}>
              <RotateCcw size={18} />
              <span>เล่นอีกครั้ง</span>
            </button>

            <button className="pos-secondary-btn" style={{ width: '100%' }} onClick={() => navigate('/')}>
              <ArrowLeft size={16} />
              <span>กลับหน้าหลัก</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PLAYING SCREEN
  const isTimeLow = timeLeft <= 10;
  const currentWord = currentQuestion?.currentWord;

  return (
    <div className="pos-game-wrapper animate-fade-up">
      {/* Top HUD Bar */}
      <div className="pos-hud-bar">
        {/* Back Button & Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button className="pos-hud-btn" onClick={() => setGameState('idle')} title="ออกจากการแข่งขัน">
            <ArrowLeft size={18} />
          </button>
          
          <div className="pos-hud-stat">
            <span className="pos-hud-label">Score</span>
            <span className="pos-hud-value">{score}</span>
          </div>
        </div>
        
        {/* Streak Badge */}
        <div className={`pos-streak-badge ${streak >= 3 ? 'active' : ''}`}>
          <Flame 
            size={18} 
            className={streak >= 5 ? "animate-bounce" : ""} 
            style={{ color: streak >= 3 ? '#facc15' : '#94a3b8' }} 
            fill={streak >= 3 ? "currentColor" : "none"} 
          />
          <span>x{streak}</span>
        </div>
        
        {/* Timer Badge */}
        <div className={`pos-timer-badge ${isTimeLow ? 'warning' : ''}`}>
          <Timer size={19} />
          <span>{timeLeft}s</span>
        </div>
      </div>
      
      {/* Progress Track */}
      <div className="pos-progress-track">
        <div 
          className={`pos-progress-fill ${isTimeLow ? 'warning' : ''}`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      {/* Main Word Card */}
      {currentQuestion && currentWord && (
        <div className="pos-question-card pos-glass-card">
          {/* Header Row: Level Badge & Audio */}
          <div className="pos-question-header">
            <span className="pos-level-tag">
              {currentWord.level || 'A1'}
            </span>

            <button 
              onClick={() => playWordAudio(currentWord.word)}
              className="pos-audio-trigger"
              title="ฟังเสียงอ่านคำศัพท์"
            >
              <Volume2 size={19} />
            </button>
          </div>

          {/* English Word */}
          <h2 className="pos-word-display">
            {currentWord.word}
          </h2>

          {/* IPA Phonetics */}
          {currentWord.ipa && (
            <div className="pos-ipa-display">
              /{currentWord.ipa}/
            </div>
          )}

          {/* Thai Meaning */}
          <p className="pos-meaning-display">
            {currentWord.meaning}
          </p>

          {/* Point Popup Animation */}
          {scorePopup && (
            <div className={`pos-point-popup ${scorePopup.startsWith('+') ? 'correct' : 'wrong'}`}>
              {scorePopup}
            </div>
          )}
        </div>
      )}

      {/* 2x2 Choice Buttons Grid */}
      <div className="pos-options-grid">
        {currentQuestion?.options.map((option, index) => {
          const info = POS_DETAILS[option] || {
            nameEn: option,
            nameTh: 'ชนิดของคำ',
            descTh: '',
            icon: '⚡',
            color: '#38bdf8',
            bg: 'rgba(56, 189, 248, 0.12)',
            border: 'rgba(56, 189, 248, 0.35)',
            glow: '0 0 15px rgba(56, 189, 248, 0.3)'
          };

          const isSelected = feedback?.pos === option;
          const isCorrect = isSelected && feedback?.type === 'correct';
          const isWrong = isSelected && feedback?.type === 'wrong';

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              className={`pos-btn-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              style={{
                borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : info.border,
              }}
              onMouseEnter={(e) => {
                if (!feedback) {
                  e.currentTarget.style.borderColor = info.color;
                  e.currentTarget.style.background = info.bg;
                  e.currentTarget.style.boxShadow = info.glow;
                }
              }}
              onMouseLeave={(e) => {
                if (!feedback) {
                  e.currentTarget.style.borderColor = info.border;
                  e.currentTarget.style.background = 'rgba(10, 16, 32, 0.85)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                }
              }}
            >
              {/* Icon & English Name */}
              <div className="pos-btn-option-title">
                <span className="pos-btn-option-icon">{info.icon}</span>
                <span className="pos-btn-option-en" style={{ color: info.color }}>
                  {info.nameEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default POSMode;
