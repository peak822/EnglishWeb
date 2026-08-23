import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, Star, Award, Loader2, Volume2, VolumeX, Terminal, Sparkles } from 'lucide-react';
import './App.css';

// Hooks
import { useGamification } from './hooks/useGamification';
import { useCyberSound } from './hooks/useCyberSound';

// Components
import InteractiveBackground from './components/InteractiveBackground';
import CommandPalette from './components/CommandPalette';
import TechBracket from './components/TechBracket';

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
      INITIALIZING NEURAL LINK...
    </span>
  </div>
);

function App() {
  const { exp, level, badges, nextLevelExp, currentLevelBaseExp, newBadge, recentLevelUp } = useGamification();
  const { isMuted, toggleMute, playSound } = useCyberSound();
  const [theme, setTheme] = useState('cyberpunk');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const expProgress = Math.max(0, Math.min(100, ((exp - currentLevelBaseExp) / (nextLevelExp - currentLevelBaseExp)) * 100));

  return (
    <Router>
      <InteractiveBackground theme={theme} />
      <div className="app-layout">
        {/* Cyber Visor Top Navigation */}
        <nav className="nav-bar cyber-visor-header">
          <div className="container nav-content">
            {/* Top Row: Logo & Quick HUD Controls */}
            <div className="nav-main-row">
              <Link 
                to="/" 
                className="nav-logo glitch-hover flex items-center gap-2 group" 
                data-text="English Study"
                onClick={() => playSound('click')}
              >
                <div className="relative p-1.5 rounded-lg bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] shadow-[0_0_10px_rgba(0,255,255,0.2)] group-hover:scale-105 transition-transform">
                  <BookOpen size={20} className="nav-logo-icon text-[var(--color-primary)]" />
                </div>
                <div className="flex flex-col">
                  <span className="nav-logo-text font-sans font-bold tracking-wider text-sm sm:text-base">
                    ENGLISH <span className="text-[var(--color-primary)]">STUDY</span>
                  </span>
                  <span className="text-[0.6rem] font-mono text-[var(--color-primary)] tracking-widest uppercase opacity-75">
                    NEURAL TERMINAL
                  </span>
                </div>
              </Link>
              
              {/* HUD Control Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Command Palette Trigger Button */}
                <button
                  onClick={() => {
                    playSound('click');
                    setIsCommandPaletteOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(0,255,255,0.08)] hover:bg-[rgba(0,255,255,0.18)] border border-[rgba(0,255,255,0.3)] text-[var(--color-primary)] text-xs font-mono transition-all shadow-[0_0_10px_rgba(0,255,255,0.15)]"
                  title="Open HUD Command Palette (Ctrl+K)"
                  aria-label="Open Command Palette"
                >
                  <Terminal size={14} />
                  <span className="hidden md:inline">HUD</span>
                  <span className="text-[0.65rem] opacity-75 font-semibold hidden sm:inline">Ctrl+K</span>
                </button>

                {/* Audio Engine Mute Toggle */}
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isMuted 
                      ? 'bg-[rgba(255,0,85,0.1)] border-[rgba(255,0,85,0.3)] text-[rgba(255,255,255,0.5)] hover:text-white' 
                      : 'bg-[rgba(0,255,255,0.1)] border-[rgba(0,255,255,0.3)] text-[var(--color-primary)] shadow-[0_0_8px_rgba(0,255,255,0.2)]'
                  }`}
                  title={isMuted ? 'Unmute Cyber Sound Engine' : 'Mute Cyber Sound Engine'}
                  aria-label="Toggle Cyber Sound"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Theme Selector */}
                <div className="nav-theme-wrap">
                  <select 
                    value={theme}
                    onChange={(e) => {
                      playSound('click');
                      setTheme(e.target.value);
                    }}
                    className="theme-selector-dropdown text-xs"
                    aria-label="Select Theme"
                  >
                    <option value="cyberpunk">👾 Cyberpunk</option>
                    <option value="meadow-day">🌿 Meadow</option>
                    <option value="milky-way">🌌 Milky Way</option>
                    <option value="sunset-vaporwave">🌅 Sunset</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gamification Energy Reactor Bar */}
            <div className="nav-gamification-bar cyber-reactor-bar">
              <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-xs sm:text-sm whitespace-nowrap">
                <Star size={15} fill="currentColor" className="animate-pulse" />
                <span className="font-mono tracking-wider">LV.{level}</span>
              </div>

              {/* Reactor Core Energy Tube */}
              <div className="nav-exp-progress-wrap relative overflow-hidden bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,255,0.2)] rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-neutral)] rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_var(--color-primary)] relative"
                  style={{ width: `${expProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <div className="text-[0.7rem] sm:text-xs text-[var(--color-secondary)] font-mono whitespace-nowrap font-semibold">
                {exp}/{nextLevelExp} <span className="text-[var(--color-primary)] hidden xs:inline">EXP</span>
              </div>

              {badges.length > 0 && (
                <div className="flex items-center gap-1 text-[var(--color-neutral)] pl-1.5 border-l border-[rgba(255,255,255,0.15)] cursor-help" title={`Badges Unlocked: ${badges.length}`}>
                  <Award size={15} />
                  <span className="text-xs font-mono font-bold">{badges.length}</span>
                </div>
              )}

              {/* Notifications */}
              {recentLevelUp && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-black px-4 py-1.5 rounded-lg font-bold shadow-[0_0_20px_var(--color-primary)] animate-fade-up whitespace-nowrap z-50 text-xs sm:text-sm font-mono tracking-wider border border-white">
                  ⚡ LEVEL UP! LEVEL {level} REACHED
                </div>
              )}
              {newBadge && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--color-neutral)] text-white px-4 py-1.5 rounded-lg font-bold shadow-[0_0_20px_var(--color-neutral)] animate-fade-up whitespace-nowrap z-50 text-xs sm:text-sm font-mono tracking-wider border border-white">
                  🏆 BADGE UNLOCKED: {newBadge.name}
                </div>
              )}
            </div>

          </div>
        </nav>

        {/* Global Floating HUD Command Palette */}
        <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          currentTheme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
        />

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
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[rgba(255,255,255,0.6)]">
            <Sparkles size={14} className="text-[var(--color-primary)]" />
            <span>ENGLISH STUDY NEURAL TERMINAL • MISSION READINESS ACTIVE</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
