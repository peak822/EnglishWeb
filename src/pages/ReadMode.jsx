import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import vocabularyData from '../data/vocabulary.json';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const ReadMode = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [level, setLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredWords = useMemo(() => {
    return vocabularyData.filter(word => {
      const matchSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLevel = level === 'all' || word.level === level;
      return matchSearch && matchLevel;
    });
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
              <option value="all">All Levels</option>
              <option value="A1">A1 (Beginner)</option>
              <option value="A2">A2 (Elementary)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper Intermediate)</option>
              <option value="C1">C1 (Advanced)</option>
              <option value="C2">C2 (Proficient)</option>
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
