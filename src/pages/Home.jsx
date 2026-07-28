import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Puzzle, HelpCircle, ArrowRight, BookOpen, Grid, Zap } from 'lucide-react';
import Card from '../components/Card';
import Tilt from 'react-parallax-tilt';

const Home = () => {
  const navigate = useNavigate();

  const starterModes = [
    {
      id: 'read',
      title: 'อ่านคำศัพท์',
      description: 'Browse, search, and study the entire Oxford 3000 vocabulary list.',
      icon: <BookOpen size={32} />,
      path: '/read',
      color: 'var(--color-surface)'
    },
    {
      id: 'guess',
      title: 'ทายคำศัพท์',
      description: 'Guess the word based on hints like part of speech and length.',
      icon: <HelpCircle size={32} />,
      path: '/guess',
      color: '#F59E0B'
    },
    {
      id: 'pos',
      title: 'หมวดหมู่คำ (POS)',
      description: 'ฝึกแยกแยะชนิดของคำ (Noun, Verb, Adj, etc.) อย่างรวดเร็วเพื่อสร้างความจำอัตโนมัติ',
      icon: <Zap size={32} />,
      path: '/pos',
      color: '#8B5CF6' // violet
    },
    {
      id: 'match',
      title: 'เกมจับคู่ (Match)',
      description: 'Test your memory! Match English words with their Thai meanings.',
      icon: <Grid size={32} />,
      path: '/match',
      color: '#00E1FF' // Bright Cyan
    }
  ];

  const intermediateModes = [
    {
      id: 'srs',
      title: 'ทบทวน (SRS)',
      description: 'Smart flashcards that remember when you need to review a word.',
      icon: <BookOpen size={32} />,
      path: '/srs',
      color: '#10B981' // emerald
    },
    {
      id: 'assemble',
      title: 'ประกอบคำศัพท์',
      description: 'Assemble scrambled letters to form the correct word.',
      icon: <Puzzle size={32} />,
      path: '/assemble',
      color: 'var(--color-accent)'
    },
    {
      id: 'context',
      title: 'โหมดเติมคำ (Context)',
      description: 'Fill in the blanks in real-world sentences to understand context.',
      icon: <Type size={32} />,
      path: '/context',
      color: '#8B5CF6' // violet
    },
    {
      id: 'swipe',
      title: 'โหมดปัดซ้ายขวา',
      description: 'Test your reflexes! Swipe right if the meaning matches, left if it is wrong.',
      icon: <Zap size={32} />,
      path: '/swipe',
      color: '#F59E0B' // amber
    }
  ];

  const advancedModes = [
    {
      id: 'typing',
      title: 'พิมพ์คำศัพท์',
      description: 'Practice typing vocabulary from memory based on its type and level.',
      icon: <Type size={32} />,
      path: '/typing',
      color: 'var(--color-primary)'
    },
    {
      id: 'syntax',
      title: 'เรียงประโยค (Syntax)',
      description: 'Assemble scrambled words to form a correct English sentence.',
      icon: <Puzzle size={32} />,
      path: '/syntax',
      color: '#EC4899' // pink
    }
  ];

  const renderModeGrid = (modeList) => (
    <div className="mode-grid">
      {modeList.map((mode) => (
        <Tilt 
          key={mode.id} 
          glareEnable={true} 
          glareMaxOpacity={0.15} 
          glareColor={mode.color} 
          glarePosition="all" 
          tiltMaxAngleX={10} 
          tiltMaxAngleY={10}
          scale={1.02}
          transitionSpeed={2500}
        >
          <Card 
            className="mode-card flex flex-col h-full"
            onClick={() => navigate(mode.path)}
          >
            <div className="mode-icon" style={{ color: mode.color, borderColor: mode.color }}>
              {mode.icon}
            </div>
            <h3 className="text-2xl mb-3">{mode.title}</h3>
            <p className="mb-6 flex-grow">{mode.description}</p>
            
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]" style={{ color: mode.color, fontWeight: 600 }}>
              <span>Start Practice</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Tilt>
      ))}
    </div>
  );

  return (
    <div className="container animate-fade-up">
      <section className="hero-section text-center">
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <h1 className="text-gradient glitch-hover" data-text="Discover the Joy of English" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Discover the Joy of English</h1>
          <p className="mt-6 text-xl mx-auto" style={{ color: 'var(--color-neutral)' }}>
            Elevate your vocabulary step by step in a relaxed environment. Choose a learning mode that fits your pace, and start growing your English skills today.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto text-center mb-8" style={{ background: 'rgba(2,2,5,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px 0 rgba(0,255,255,0.05)' }}>
          <h2 className="text-center mb-2 glitch-hover" data-text="Select a Learning Mode">Select a Learning Mode</h2>
          <p className="text-center" style={{ color: 'var(--color-neutral)' }}>
            Choose a mode to start practicing and earning EXP
          </p>
        </div>
        
        <div className="difficulty-section">
          <div className="section-header flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
              🌱 Starter
            </h3>
            <span className="text-sm font-medium text-[var(--color-neutral)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">เรียนรู้และจดจำ</span>
          </div>
          {renderModeGrid(starterModes)}
        </div>

        <div className="difficulty-section">
          <div className="section-header flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-accent)' }}>
              🚀 Intermediate
            </h3>
            <span className="text-sm font-medium text-[var(--color-neutral)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">ทบทวนและทำความเข้าใจ</span>
          </div>
          {renderModeGrid(intermediateModes)}
        </div>

        <div className="difficulty-section">
          <div className="section-header flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-secondary)' }}>
              🔥 Advanced
            </h3>
            <span className="text-sm font-medium text-[var(--color-neutral)] bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">ท้าทายความแม่นยำ</span>
          </div>
          {renderModeGrid(advancedModes)}
        </div>
      </section>
    </div>
  );
};

export default Home;
