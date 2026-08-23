import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, RotateCcw, ArrowRight, Home as HomeIcon } from 'lucide-react';
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
    <div className="cyber-modal-backdrop">
      <div 
        className="cyber-debrief-modal"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(10, 16, 35, 0.96)',
          border: '1.5px solid var(--color-primary)',
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          boxShadow: '0 0 45px rgba(0, 255, 255, 0.3), 0 20px 60px rgba(0, 0, 0, 0.85)',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <TechBracket color="var(--color-primary)" size={20} />

        {/* Top Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', borderRadius: '9999px', background: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.3)', fontSize: '0.72rem', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <Zap size={13} />
          <span>{subtitle}</span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-family-sans)', color: '#ffffff', letterSpacing: '0.03em', marginBottom: '1rem' }}>
          {title}
        </h2>

        {/* Grade Badge */}
        <div style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{ 
              width: '90px',
              height: '90px',
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '3.2rem',
              fontFamily: 'var(--font-family-mono)',
              backgroundColor: 'rgba(0,0,0,0.6)', 
              borderColor: gradeColor, 
              borderWidth: '2.5px',
              borderStyle: 'solid',
              color: gradeColor,
              boxShadow: `0 0 30px ${gradeColor}`
            }}
          >
            {grade}
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginTop: '0.6rem' }}>
            ACCURACY RATING: {percentage}%
          </span>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.85rem', margin: '1rem 0', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-family-mono)', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>ACCURACY</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)', marginTop: '0.2rem' }}>{score}/{total}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>EXP GAINED</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-neutral)', marginTop: '0.2rem' }}>+{animatedExp} EXP</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>STREAK</span>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-accent)', marginTop: '0.2rem' }}>{streakCount}x</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {onRetry && (
            <button
              onClick={() => {
                playCyberSound('click');
                onRetry();
              }}
              style={{ flex: '1 1 40%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', fontWeight: '700', letterSpacing: '0.04em', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s ease' }}
            >
              <RotateCcw size={14} />
              <span>RETRY</span>
            </button>
          )}

          {onNext && (
            <button
              onClick={() => {
                playCyberSound('click');
                onNext();
              }}
              style={{ flex: '1 1 40%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'var(--color-primary)', color: '#000000', fontSize: '0.75rem', fontFamily: 'var(--font-family-mono)', fontWeight: '800', letterSpacing: '0.04em', cursor: 'pointer', border: 'none', boxShadow: '0 0 18px var(--color-primary)', transition: 'all 0.2s ease' }}
            >
              <span>{nextLabel}</span>
              <ArrowRight size={14} />
            </button>
          )}

          <button
            onClick={() => {
              playCyberSound('click');
              navigate('/');
            }}
            style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
