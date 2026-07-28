import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { filterWords, THEMES } from '../hooks/useCategories';
import { Search, ChevronLeft, ChevronRight, FileText, Volume2 } from 'lucide-react';

const ReadMode = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [level, setLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredWords = useMemo(() => {
    const themeFiltered = filterWords(vocabularyData, level);
    return themeFiltered.filter(word => 
      word.word.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, level]);

  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  
  const displayedWords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWords.slice(start, start + itemsPerPage);
  }, [filteredWords, currentPage]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, level]);

  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container animate-fade-up">
      <div className="read-mode-wrapper">
        <div className="text-center mb-10">
          <h2 className="text-gradient mb-4">Reading Mode</h2>
          <p className="read-mode-subtitle">Browse all 3,000 Oxford vocabulary words.</p>
        </div>

        {/* Controls Section */}
        <Card className="read-mode-controls">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
              type="text"
              placeholder="Search word..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select 
              value={level} 
              onChange={(e) => setLevel(e.target.value)}
              className="level-select"
            >
              <option value="all">All Words</option>
              <optgroup label="Difficulty Levels">
                <option value="A1">A1 (Beginner)</option>
                <option value="A2">A2 (Elementary)</option>
                <option value="B1">B1 (Intermediate)</option>
                <option value="B2">B2 (Upper Intermediate)</option>
                <option value="C1">C1 (Advanced)</option>
                <option value="C2">C2 (Proficient)</option>
              </optgroup>
              <optgroup label="Learning Themes">
                {THEMES.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </Card>

        {/* Info bar */}
        <div className="read-mode-info">
          <div>Showing {displayedWords.length} of {filteredWords.length} words</div>
        </div>

        {/* Word Display */}
        {filteredWords.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <p>No words found matching your criteria.</p>
          </div>
        ) : (
          <div className="vocab-table-container">
            <table className="vocab-table">
              <thead>
                <tr>
                  <th>Vocab</th>
                  <th>Part of Speech</th>
                  <th>Meaning</th>
                  <th>คำอ่าน</th>
                  <th>IPA</th>
                  <th>Level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayedWords.map(word => {
                  const levelClass = word.level.charAt(0);
                  
                  return (
                    <tr key={word.id}>
                      <td className="td-word">{word.word}</td>
                      <td className="td-type">{word.type}</td>
                      <td className="td-meaning">{word.meaning || <span className="empty-dash">-</span>}</td>
                      <td className="td-thai-pron" style={{ color: 'var(--color-primary)' }}>{word.thai_pronunciation || <span className="empty-dash">-</span>}</td>
                      <td className="td-ipa">{word.ipa ? `/${word.ipa}/` : <span className="empty-dash">-</span>}</td>
                      <td><span className={`td-level level-${levelClass}`}>{word.level}</span></td>
                      <td className="text-center">
                        <button 
                          onClick={() => playAudio(word.word)}
                          className="p-2 text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <Button 
              variant="secondary" 
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
            >
              <ChevronLeft size={20} />
            </Button>
            
            <div className="pagination-text">
              Page {currentPage} <span>of</span> {totalPages}
            </div>

            <Button 
              variant="secondary" 
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReadMode;
