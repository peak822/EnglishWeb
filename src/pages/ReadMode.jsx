import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { filterWords, THEMES } from '../hooks/useCategories';
import { Search, ChevronLeft, ChevronRight, FileText, Volume2 } from 'lucide-react';
import LevelSelector from '../components/LevelSelector';
import { speakText } from '../utils/audioService';

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
    speakText(word);
  };

  return (
    <div className="container animate-fade-up">
      <div className="read-mode-wrapper">
        <div className="text-center mb-10">
          <h2 className="text-gradient mb-4">Oxford 5000 Vocab Vault</h2>
          <p className="read-mode-subtitle">Explore, search, and master essential Oxford 5000 vocabulary words with IPA and audio pronunciation.</p>
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
            <LevelSelector 
              value={level} 
              onChange={setLevel} 
            />
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
                          className="audio-btn mx-auto"
                          title="Listen to pronunciation"
                        >
                          <Volume2 size={18} />
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
