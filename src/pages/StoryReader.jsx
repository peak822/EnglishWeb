import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, X } from 'lucide-react';
import Card from '../components/Card';
import storiesData from '../data/stories.json';
import vocabularyData from '../data/vocabulary.json';

const StoryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWord, setSelectedWord] = useState(null);

  const story = useMemo(() => storiesData.find(s => s.id === id), [id]);

  if (!story) {
    return (
      <div className="container text-center py-20">
        <h2>Story not found</h2>
        <button className="ui-btn ui-btn-primary mt-4" onClick={() => navigate('/story-mode')}>
          Back to Stories
        </button>
      </div>
    );
  }

  // Handle word click
  const handleWordClick = (rawWord) => {
    // Remove punctuation
    const cleanWord = rawWord.replace(/[.,!?;:'"]/g, '').toLowerCase();
    
    // Find in vocabulary
    const dictEntry = vocabularyData.find(w => w.word.toLowerCase() === cleanWord);
    
    if (dictEntry) {
      setSelectedWord(dictEntry);
    } else {
      // Fallback if word not in Oxford 3000
      setSelectedWord({
        word: cleanWord,
        notFound: true
      });
    }
  };

  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Render text with clickable words
  const renderInteractiveText = (text) => {
    // Split text by spaces but keep punctuation attached for rendering
    const words = text.split(/(\s+)/);
    
    return words.map((wordStr, index) => {
      // If it's just whitespace, render it as is
      if (!wordStr.trim()) {
        return <span key={index}>{wordStr}</span>;
      }
      
      return (
        <span 
          key={index}
          onClick={() => handleWordClick(wordStr)}
          style={{ 
            cursor: 'pointer',
            transition: 'color 0.2s, textShadow 0.2s',
          }}
          className="hover:text-[var(--color-primary)] hover:drop-shadow-[0_0_5px_var(--color-primary)]"
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--color-primary)';
            e.target.style.textShadow = '0 0 5px var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'inherit';
            e.target.style.textShadow = 'none';
          }}
        >
          {wordStr}
        </span>
      );
    });
  };

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/story-mode')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-neutral)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem'
          }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--color-primary)',
          background: 'rgba(0, 255, 255, 0.1)',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem',
          display: 'inline-block'
        }}>
          Level {story.level}
        </span>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
          {story.title}
        </h1>
        <div style={{ color: 'var(--color-neutral)', fontSize: '0.9rem' }}>
          {story.genre} • {story.readTime}
        </div>
      </div>

      {/* Story Content */}
      <Card style={{ padding: '2.5rem', lineHeight: '2', fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)' }}>
        {renderInteractiveText(story.content)}
      </Card>

      {/* Word Details Modal/Drawer */}
      {selectedWord && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '500px',
          zIndex: 100,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <Card style={{ padding: '1.5rem', border: '1px solid var(--color-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>
                  {selectedWord.word}
                </h3>
                {!selectedWord.notFound && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral)' }}>{selectedWord.type}</span>
                    {selectedWord.ipa && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral)', fontStyle: 'italic' }}>/{selectedWord.ipa}/</span>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => playAudio(selectedWord.word)}
                  className="audio-btn"
                  title="Listen to pronunciation"
                >
                  <Volume2 size={20} />
                </button>
                <button 
                  onClick={() => setSelectedWord(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-neutral)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {!selectedWord.notFound ? (
              <>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-secondary)', margin: '0 0 1rem 0' }}>
                  {selectedWord.meaning || 'ไม่มีคำแปล'}
                </p>
                {selectedWord.thai_pronunciation && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral)', margin: 0 }}>
                    คำอ่าน: {selectedWord.thai_pronunciation}
                  </p>
                )}
              </>
            ) : (
              <p style={{ fontSize: '1rem', color: 'var(--color-neutral)', margin: 0, fontStyle: 'italic' }}>
                Word not found in core vocabulary list.
              </p>
            )}
          </Card>
        </div>
      )}

    </div>
  );
};

export default StoryReader;
