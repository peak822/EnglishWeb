import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, Star, Award } from 'lucide-react';
import './App.css';

// Hooks
import { useGamification } from './hooks/useGamification';

// Components
import InteractiveBackground from './components/InteractiveBackground';
import Home from './pages/Home';
import TypingMode from './pages/TypingMode';
import AssembleMode from './pages/AssembleMode';
import GuessMode from './pages/GuessMode';
import ReadMode from './pages/ReadMode';

import ContextMode from './pages/ContextMode';
import SyntaxMode from './pages/SyntaxMode';
import MatchMode from './pages/MatchMode';
import SwipeMode from './pages/SwipeMode';
import POSMode from './pages/POSMode';
import POSGuide from './pages/POSGuide';

function App() {
  const { exp, level, badges, nextLevelExp, currentLevelBaseExp, newBadge, recentLevelUp } = useGamification();
  const [theme, setTheme] = useState('cyberpunk');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const expProgress = Math.max(0, Math.min(100, ((exp - currentLevelBaseExp) / (nextLevelExp - currentLevelBaseExp)) * 100));

  return (
    <Router>
      <InteractiveBackground theme={theme} />
      <div className="app-layout">
        <nav className="nav-bar">
          <div className="container nav-content flex-wrap gap-4 justify-center md:justify-between">
            <Link to="/" className="nav-logo glitch-hover" data-text="English Study">
              <BookOpen size={24} />
              <span>English Study</span>
            </Link>
            
            {/* Right Side: Theme & Gamification */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* Theme Selector */}
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="theme-selector-dropdown"
              >
                <option value="cyberpunk">👾 Cyberpunk</option>
                <option value="meadow-day">🌿 Meadow Day</option>
                <option value="milky-way">🌌 Milky Way</option>
                <option value="sunset-vaporwave">🌅 Sunset Vaporwave</option>
              </select>

              {/* Gamification Bar */}
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 bg-[var(--color-surface)] border border-[rgba(255,255,255,0.1)] px-4 py-2 rounded-full relative">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold">
                <Star size={18} fill="currentColor" />
                <span>Lv. {level}</span>
              </div>
              <div className="w-24 sm:w-32 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                  style={{ width: `${expProgress}%` }}
                />
              </div>
              <div className="text-xs text-[var(--color-neutral)] font-medium hidden sm:block">
                {exp} / {nextLevelExp} EXP
              </div>
              {badges.length > 0 && (
                <div className="flex items-center gap-1 ml-2 text-[var(--color-accent)] cursor-help" title={`You have ${badges.length} badges!`}>
                  <Award size={18} />
                  <span className="text-sm font-bold">{badges.length}</span>
                </div>
              )}

              {/* Level Up Notification Pop-up */}
              {recentLevelUp && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-bold shadow-[var(--glow-primary)] animate-fade-up whitespace-nowrap z-50">
                  Level Up! 🎉
                </div>
              )}
              {newBadge && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold shadow-[var(--glow-accent)] animate-fade-up whitespace-nowrap z-50">
                  New Badge: {newBadge.name} {newBadge.icon}
                </div>
              )}
            </div>
            </div>
            {/* Removed nav-links as they are accessible from Home */}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read" element={<ReadMode />} />
            <Route path="/typing" element={<TypingMode />} />
            <Route path="/assemble" element={<AssembleMode />} />
            <Route path="/guess" element={<GuessMode />} />

            <Route path="/context" element={<ContextMode />} />
            <Route path="/syntax" element={<SyntaxMode />} />
            <Route path="/match" element={<MatchMode />} />
            <Route path="/swipe" element={<SwipeMode />} />
            <Route path="/pos" element={<POSMode />} />
            <Route path="/pos-guide" element={<POSGuide />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Discover the Joy of English • Interactive Learning Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
