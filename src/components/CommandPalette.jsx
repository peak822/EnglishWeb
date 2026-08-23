import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
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
    <div className="cyber-modal-backdrop align-top" onClick={onClose}>
      <div 
        className="cyber-command-palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <TechBracket color="var(--color-primary)" size={16} />

        {/* Header / Input Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(0,255,255,0.25)', background: 'rgba(0,255,255,0.04)' }}>
          <Terminal size={20} style={{ color: 'var(--color-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type command, protocol name, or shortcut..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontFamily: 'var(--font-family-mono)', fontSize: '0.95rem' }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          )}
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-family-mono)', letterSpacing: '0.08em', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(0,255,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(0,255,255,0.3)' }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="custom-scrollbar" style={{ overflowY: 'auto', padding: '0.5rem', maxHeight: '55vh' }}>
          {allItems.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontFamily: 'var(--font-family-mono)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '0.85rem',
                    background: isSelected ? 'rgba(0, 255, 255, 0.15)' : 'transparent',
                    color: isSelected ? 'var(--color-primary)' : '#ffffff',
                    border: isSelected ? '1px solid rgba(0, 255, 255, 0.3)' : '1px solid transparent',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)' }}>
                      {item.icon}
                    </span>
                    <span style={{ fontWeight: isSelected ? '700' : '500' }}>{item.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight size={14} style={{ opacity: isSelected ? 1 : 0, transform: isSelected ? 'translateX(2px)' : 'none', transition: 'all 0.2s ease' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer HUD info */}
        <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid rgba(0,255,255,0.15)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-family-mono)', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span style={{ color: 'var(--color-primary)' }}>CYBER-HUD TERMINAL v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
