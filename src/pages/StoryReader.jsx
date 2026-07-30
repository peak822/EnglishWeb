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
    <div className="container animate-fade-up max-w-4xl mx-auto pb-24 px-4">
      
      {/* Header Container */}
      <Card className="p-4 md:p-6 mb-8">
        {/* Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={() => navigate('/story-mode')}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'var(--color-neutral)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s'
            }}
            className="hover:bg-[rgba(255,255,255,0.1)] hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
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
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', margin: '0.5rem 0' }}>
            {story.title}
          </h1>
          <div style={{ color: 'var(--color-neutral)', fontSize: '0.9rem' }}>
            {story.genre} • {story.readTime}
          </div>
        </div>
      </Card>

      {/* Story Content */}
      <Card className="p-6 md:p-10 leading-loose text-lg md:text-xl text-white/90">
        {renderInteractiveText(story.content)}
      </Card>

      {/* Word Details Modal/Drawer */}
      {selectedWord && (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-lg z-[100] animate-[slideUp_0.3s_ease-out]">
          <Card className="p-6 border border-[var(--color-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(0,255,255,0.1)]">
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
