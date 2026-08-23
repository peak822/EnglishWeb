import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Zap, CheckCircle2, RotateCcw, ArrowRight, Home as HomeIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCyberSound } from '../utils/cyberSound';
import TechBracket from './TechBracket';

export const MissionDebriefModal = ({
  isOpen,
  title = 'MISSION DEBRIEF',
  subtitle = 'PROTOCOL EXECUTION COMPLETE',
  score = 0,
  total = 0,
  expGained = 50,
  streakCount = 1,
  onRetry,
  onNext,
  nextLabel = 'NEXT MISSION'
}) => {
  const navigate = useNavigate();
  const [animatedExp, setAnimatedExp] = useState(0);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 100;
  
  let grade = 'S';
  let gradeColor = '#00ffff';
  if (percentage >= 95) {
    grade = 'S';
    gradeColor = '#00ffff';
  } else if (percentage >= 80) {
    grade = 'A';
    gradeColor = '#00ff66';
  } else if (percentage >= 60) {
    grade = 'B';
    gradeColor = '#ffb700';
  } else {
    grade = 'C';
    gradeColor = '#ff0055';
  }

  useEffect(() => {
    if (isOpen) {
      if (percentage >= 80) {
        playCyberSound('levelUp');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#00ffff', '#ff00ff', '#00ff66', '#ffb700']
          });
        } catch (e) {
          // ignore
        }
      } else {
        playCyberSound('success');
      }

      // Rolling EXP animation
      let current = 0;
      const step = Math.max(1, Math.floor(expGained / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= expGained) {
          setAnimatedExp(expGained);
          clearInterval(interval);
        } else {
          setAnimatedExp(current);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isOpen, expGained, percentage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,5,18,0.85)] backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[var(--color-surface,rgba(10,15,30,0.95))] border border-[var(--color-primary)] rounded-xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.3)] overflow-hidden text-center">
        <TechBracket color="var(--color-primary)" size={20} />

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] text-[0.7rem] font-mono tracking-widest text-[var(--color-primary)] uppercase mb-3">
          <Zap size={12} />
          {subtitle}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-white mb-4">
          {title}
        </h2>

        {/* Grade Badge */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-5xl font-mono shadow-[0_0_25px] transition-transform hover:scale-105"
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.6)', 
              borderColor: gradeColor, 
              borderWidth: '2px',
              color: gradeColor,
              boxShadow: `0 0 25px ${gradeColor}`
            }}
          >
            {grade}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[rgba(255,255,255,0.6)] mt-2">
            ACCURACY RATING: {percentage}%
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 my-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] font-mono text-xs">
          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)]">ACCURACY</span>
            <span className="font-bold text-sm text-[var(--color-primary)]">{score}/{total}</span>
          </div>
          <div className="flex flex-col items-center border-x border-[rgba(255,255,255,0.1)]">
            <span className="text-[rgba(255,255,255,0.5)]">EXP GAINED</span>
            <span className="font-bold text-sm text-[var(--color-neutral)]">+{animatedExp} EXP</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[rgba(255,255,255,0.5)]">STREAK</span>
            <span className="font-bold text-sm text-[var(--color-accent)]">{streakCount}x</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          {onRetry && (
            <button
              onClick={() => {
                playCyberSound('click');
                onRetry();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] text-white text-xs font-mono font-bold tracking-wider transition-all border border-[rgba(255,255,255,0.2)]"
            >
              <RotateCcw size={14} />
              RETRY
            </button>
          )}

          {onNext && (
            <button
              onClick={() => {
                playCyberSound('click');
                onNext();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[var(--color-primary)] hover:bg-[rgba(0,255,255,0.85)] text-black text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_15px_var(--color-primary)]"
            >
              <ArrowRight size={14} />
              {nextLabel}
            </button>
          )}

          <button
            onClick={() => {
              playCyberSound('click');
              navigate('/');
            }}
            className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] hover:text-white transition-all border border-[rgba(255,255,255,0.15)]"
            title="Return to Hub"
          >
            <HomeIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionDebriefModal;
