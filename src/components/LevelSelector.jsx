import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { THEMES } from '../hooks/useCategories';

const LevelSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (value === 'all') return 'All Words';
    
    const difficultyMap = {
      'A1': 'A1 (Beginner)',
      'A2': 'A2 (Elementary)',
      'B1': 'B1 (Intermediate)',
      'B2': 'B2 (Upper Intermediate)',
      'C1': 'C1 (Advanced)'
    };
    
    if (difficultyMap[value]) return difficultyMap[value];
    
    const theme = THEMES.find(t => t.id === value);
    if (theme) return theme.name;
    
    return value;
  };

  const Option = ({ val, label }) => (
    <button
      type="button"
      className={`custom-select-option ${value === val ? 'selected' : ''}`}
      onClick={() => handleSelect(val)}
      aria-pressed={value === val}
    >
      <span>{label}</span>
      {value === val && <Check size={16} className="text-[var(--color-primary)]" />}
    </button>
  );

  return (
    <div className="custom-select-container" ref={dropdownRef} onKeyDown={event => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }}>
      <button 
        type="button"
        ref={triggerRef}
        className={`custom-select-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{getDisplayValue()}</span>
        <ChevronDown size={18} className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown animate-fade-up">
          <Option val="all" label="All Words" />
          
          <div className="custom-select-group">Difficulty Levels</div>
          <Option val="A1" label="A1 (Beginner)" />
          <Option val="A2" label="A2 (Elementary)" />
          <Option val="B1" label="B1 (Intermediate)" />
          <Option val="B2" label="B2 (Upper Intermediate)" />
          <Option val="C1" label="C1 (Advanced)" />
          
          <div className="custom-select-group">Learning Themes</div>
          {THEMES.map(theme => (
            <Option key={theme.id} val={theme.id} label={theme.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LevelSelector;
