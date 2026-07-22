import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Puzzle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import Card from '../components/Card';

const Home = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'read',
      title: 'อ่านคำศัพท์',
      description: 'Browse, search, and study the entire Oxford 3000 vocabulary list.',
      icon: <BookOpen size={32} />,
      path: '/read',
      color: 'var(--color-surface)'
    },
    {
      id: 'typing',
      title: 'พิมพ์คำศัพท์',
      description: 'Practice typing vocabulary from memory based on its type and level.',
      icon: <Type size={32} />,
      path: '/typing',
      color: 'var(--color-primary)'
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
      id: 'guess',
      title: 'ทายคำศัพท์',
      description: 'Guess the word based on hints like part of speech and length.',
      icon: <HelpCircle size={32} />,
      path: '/guess',
      color: '#F59E0B'
    },
    {
      id: 'srs',
      title: 'ทบทวน (SRS)',
      description: 'Smart flashcards that remember when you need to review a word.',
      icon: <BookOpen size={32} />,
      path: '/srs',
      color: '#10B981' // emerald
    },
    {
      id: 'context',
      title: 'โหมดเติมคำ (Context)',
      description: 'Fill in the blanks in real-world sentences to understand context.',
      icon: <Type size={32} />,
      path: '/context',
      color: '#8B5CF6' // violet
    }
  ];

  return (
    <div className="container animate-fade-up">
      <section className="hero-section text-center">
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <h1 className="text-gradient">Master the Oxford 3000™</h1>
          <p className="mt-6 text-xl mx-auto" style={{ color: 'var(--color-neutral)' }}>
            Elevate your English with our interactive learning platform. Choose your practice mode, 
            select your CEFR difficulty level, and start improving your vocabulary today.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center mb-2">Select a Learning Mode</h2>
        <p className="text-center mb-8 mx-auto" style={{ maxWidth: '500px' }}>
          Choose how you want to practice. Whether it's typing from memory, assembling scattered letters, or guessing the right answer.
        </p>
        
        <div className="mode-grid">
          {modes.map((mode) => (
            <Card 
              key={mode.id} 
              className="mode-card flex flex-col"
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
