import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, Star, Award, Loader2 } from 'lucide-react';
import './App.css';

// Hooks
import { useGamification } from './hooks/useGamification';

// Components
import InteractiveBackground from './components/InteractiveBackground';

// Lazy Loaded Pages for Optimal Mobile Performance & Initial Bundle Split
const Home = lazy(() => import('./pages/Home'));
const TypingMode = lazy(() => import('./pages/TypingMode'));
const AssembleMode = lazy(() => import('./pages/AssembleMode'));
const GuessMode = lazy(() => import('./pages/GuessMode'));
const ReadMode = lazy(() => import('./pages/ReadMode'));
const ListeningMode = lazy(() => import('./pages/ListeningMode'));
const ContextMode = lazy(() => import('./pages/ContextMode'));
const SyntaxMode = lazy(() => import('./pages/SyntaxMode'));
const MatchMode = lazy(() => import('./pages/MatchMode'));
const SwipeMode = lazy(() => import('./pages/SwipeMode'));
const POSMode = lazy(() => import('./pages/POSMode'));
const POSGuide = lazy(() => import('./pages/POSGuide'));
const StorySelection = lazy(() => import('./pages/StorySelection'));
const StoryReader = lazy(() => import('./pages/StoryReader'));

// Cyberpunk Neon Loading Indicator
const PageLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 animate-fade-up">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-[rgba(0,255,255,0.2)] border-t-[var(--color-primary)] animate-spin shadow-[0_0_20px_var(--color-primary)]" />
      <Loader2 className="absolute text-[var(--color-primary)] animate-pulse" size={20} />
    </div>
    <span className="text-xs font-mono tracking-widest text-[var(--color-primary)] uppercase">
      Loading System...
    </span>
  </div>
);

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
          <div className="container nav-content">
            {/* Top Row: Logo & Theme on Mobile / Left & Right on Desktop */}
            <div className="nav-main-row">
              <Link to="/" className="nav-logo glitch-hover" data-text="English Study">
                <BookOpen size={22} className="nav-logo-icon" />
                <span className="nav-logo-text">English Study</span>
              </Link>
              
              {/* Theme Selector */}
              <div className="nav-theme-wrap">
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="theme-selector-dropdown"
                  aria-label="Select Theme"
                >
                  <option value="cyberpunk">👾 Cyberpunk</option>
                  <option value="meadow-day">🌿 Meadow Day</option>
                  <option value="milky-way">🌌 Milky Way</option>
                  <option value="sunset-vaporwave">🌅 Sunset</option>
                </select>
              </div>
            </div>

            {/* Gamification Bar (Responsive & Compact) */}
            <div className="nav-gamification-bar">
              <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-xs sm:text-sm whitespace-nowrap">
                <Star size={16} fill="currentColor" />
                <span>Lv.{level}</span>
              </div>

              <div className="nav-exp-progress-wrap">
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_var(--color-primary)]"
                  style={{ width: `${expProgress}%` }}
                />
              </div>

              <div className="text-[0.7rem] sm:text-xs text-[var(--color-neutral)] font-mono whitespace-nowrap font-semibold">
                {exp}/{nextLevelExp} <span className="hidden xs:inline">EXP</span>
              </div>

              {badges.length > 0 && (
                <div className="flex items-center gap-1 text-[var(--color-accent)] pl-1 border-l border-[rgba(255,255,255,0.15)] cursor-help" title={`You have ${badges.length} badges!`}>
                  <Award size={15} />
                  <span className="text-xs font-bold">{badges.length}</span>
                </div>
              )}

              {/* Level Up Notification Pop-up */}
              {recentLevelUp && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg font-bold shadow-[var(--glow-primary)] animate-fade-up whitespace-nowrap z-50 text-xs sm:text-sm">
                  Level Up! 🎉
                </div>
              )}
              {newBadge && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white px-4 py-1.5 rounded-lg font-bold shadow-[var(--glow-accent)] animate-fade-up whitespace-nowrap z-50 text-xs sm:text-sm">
                  New Badge: {newBadge.name} {newBadge.icon}
                </div>
              )}
            </div>

          </div>
        </nav>

        <main className="main-content">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/read" element={<ReadMode />} />
              <Route path="/typing" element={<TypingMode />} />
              <Route path="/assemble" element={<AssembleMode />} />
              <Route path="/guess" element={<GuessMode />} />
              <Route path="/listen" element={<ListeningMode />} />

              <Route path="/context" element={<ContextMode />} />
              <Route path="/syntax" element={<SyntaxMode />} />
              <Route path="/match" element={<MatchMode />} />
              <Route path="/swipe" element={<SwipeMode />} />
              <Route path="/pos" element={<POSMode />} />
              <Route path="/pos-guide" element={<POSGuide />} />
              <Route path="/story-mode" element={<StorySelection />} />
              <Route path="/story-mode/:id" element={<StoryReader />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="footer">
          <p>Discover the Joy of English • Interactive Learning Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

