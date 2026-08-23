import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Terminal, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Type, 
  Puzzle, 
  HelpCircle, 
  Grid, 
  Zap, 
  Layers, 
  Compass, 
  Bookmark, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { playCyberSound } from '../utils/cyberSound';
import { useCyberSound } from '../hooks/useCyberSound';
import TechBracket from './TechBracket';

export const CommandPalette = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useCyberSound();

  const navigationCommands = useMemo(() => [
    { id: 'home', title: 'Mission Control (Home)', category: 'Navigation', icon: <Terminal size={18} />, path: '/', shortcut: 'H' },
    { id: 'typing', title: 'Typing Mode (Speed Hack)', category: 'Core Combat', icon: <Type size={18} />, path: '/typing', shortcut: 'T' },
    { id: 'assemble', title: 'Assemble Mode (Anagrams)', category: 'Core Combat', icon: <Puzzle size={18} />, path: '/assemble', shortcut: 'A' },
    { id: 'guess', title: 'Guess Mode (Clue Quiz)', category: 'Core Combat', icon: <HelpCircle size={18} />, path: '/guess', shortcut: 'G' },
    { id: 'read', title: 'Oxford 5000 Vocab Bank', category: 'Core Combat', icon: <Compass size={18} />, path: '/read', shortcut: 'R' },
    { id: 'listen', title: 'Listening Mode (Audio Decrypt)', category: 'Reflex & Sensory', icon: <Volume2 size={18} />, path: '/listen', shortcut: 'L' },
    { id: 'match', title: 'Match Mode (3D Memory Pairs)', category: 'Reflex & Sensory', icon: <Grid size={18} />, path: '/match', shortcut: 'M' },
    { id: 'swipe', title: 'Swipe Mode (Speed Reflex)', category: 'Reflex & Sensory', icon: <Zap size={18} />, path: '/swipe', shortcut: 'S' },
    { id: 'syntax', title: 'Syntax Tree Mode (Grammar Graph)', category: 'Linguistics', icon: <Sparkles size={18} />, path: '/syntax', shortcut: 'X' },
    { id: 'pos', title: 'Part of Speech Trainer', category: 'Linguistics', icon: <Layers size={18} />, path: '/pos', shortcut: 'P' },
    { id: 'pos-guide', title: 'POS Tactical Field Guide', category: 'Linguistics', icon: <BookOpen size={18} />, path: '/pos-guide', shortcut: 'F' },
    { id: 'story-mode', title: 'Story Mode (Holo-Novels)', category: 'Simulations', icon: <Bookmark size={18} />, path: '/story-mode', shortcut: 'N' },
  ], []);

  const actionCommands = useMemo(() => [
    { 
      id: 'toggle-audio', 
      title: isMuted ? 'Unmute Cyber Sound Engine' : 'Mute Cyber Sound Engine', 
      category: 'System Control', 
      icon: isMuted ? <Volume2 size={18} /> : <VolumeX size={18} />, 
      action: () => toggleMute() 
    },
    { 
      id: 'theme-cyberpunk', 
      title: 'Switch Theme: Cyberpunk Neon', 
      category: 'System Control', 
      icon: <Moon size={18} />, 
      action: () => onThemeChange && onThemeChange('cyberpunk') 
    },
    { 
      id: 'theme-meadow', 
      title: 'Switch Theme: Meadow Day', 
      category: 'System Control', 
      icon: <Sun size={18} />, 
      action: () => onThemeChange && onThemeChange('meadow-day') 
    },
    { 
      id: 'theme-milkyway', 
      title: 'Switch Theme: Milky Way Deep Cosmos', 
      category: 'System Control', 
      icon: <Moon size={18} />, 
      action: () => onThemeChange && onThemeChange('milky-way') 
    },
    { 
      id: 'theme-sunset', 
      title: 'Switch Theme: Sunset Vaporwave', 
      category: 'System Control', 
      icon: <Sun size={18} />, 
      action: () => onThemeChange && onThemeChange('sunset-vaporwave') 
    },
  ], [isMuted, toggleMute, onThemeChange]);

  const allItems = useMemo(() => {
    const list = [...navigationCommands, ...actionCommands];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q) ||
      (item.shortcut && item.shortcut.toLowerCase() === q)
    );
  }, [navigationCommands, actionCommands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      playCyberSound('hover');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeItem = (item) => {
    if (!item) return;
    playCyberSound('click');
    if (item.path) {
      navigate(item.path);
      onClose();
    } else if (item.action) {
      item.action();
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      playCyberSound('hover');
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playCyberSound('hover');
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        executeItem(allItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[rgba(5,5,18,0.75)] backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="cyber-command-palette relative w-full max-w-2xl bg-[var(--color-surface,rgba(10,15,30,0.95))] border border-[var(--color-primary)] rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.25)] overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <TechBracket color="var(--color-primary)" size={16} />

        {/* Header / Input Field */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(0,255,255,0.2)] bg-[rgba(0,255,255,0.03)]">
          <Terminal size={20} className="text-[var(--color-primary)] animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type command, protocol name, or shortcut..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-secondary,#fff)] font-mono text-sm sm:text-base placeholder-[rgba(255,255,255,0.4)]"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="text-[var(--color-neutral)] hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
          <span className="hidden sm:inline-block text-[0.65rem] font-mono tracking-wider px-2 py-0.5 rounded bg-[rgba(0,255,255,0.1)] text-[var(--color-primary)] border border-[rgba(0,255,255,0.3)]">
            ESC TO CLOSE
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-[rgba(255,255,255,0.05)] custom-scrollbar">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[var(--color-neutral)] uppercase tracking-wider">
              No tactical protocols found matching "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 font-mono text-xs sm:text-sm ${
                    isSelected 
                      ? 'bg-[rgba(0,255,255,0.15)] text-[var(--color-primary)] shadow-[0_0_10px_rgba(0,255,255,0.2)] translate-x-1' 
                      : 'text-[var(--color-secondary,#fff)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isSelected ? 'text-[var(--color-primary)] animate-pulse' : 'text-[rgba(255,255,255,0.6)]'}`}>
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] text-[rgba(255,255,255,0.4)] uppercase">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.2)]">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight size={14} className={`transition-transform duration-200 ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer HUD info */}
        <div className="px-4 py-2 border-t border-[rgba(0,255,255,0.15)] bg-[rgba(0,0,0,0.4)] flex items-center justify-between text-[0.7rem] font-mono text-[rgba(255,255,255,0.5)]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="text-[var(--color-primary)]">CYBER-HUD TERMINAL v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
