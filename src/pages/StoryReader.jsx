import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Square, X, Languages, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import Card from '../components/Card';
import storiesData from '../data/stories.json';
import { lookupWord } from '../utils/wordLookup';
import { useGamification } from '../hooks/useGamification';
import { speakText, speakStory, stopSpeech } from '../utils/audioService';

const StoryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addExp } = useGamification();

  const [selectedWord, setSelectedWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingFullStory, setIsPlayingFullStory] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const story = useMemo(() => storiesData.find(s => s.id === id), [id]);

  // Clean up speech synthesis and reset states on story change or unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    setShowTranslation(false);
    setIsPlayingFullStory(false);
    setIsCompleted(false);
    stopSpeech();
  }, [id]);

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
    const result = lookupWord(rawWord);
    if (result) {
      setSelectedWord(result);
    }
  };

  // Play pronunciation for a single word
  const playAudio = (word) => {
    if (word) {
      setIsPlayingFullStory(false);
      speakText(word);
    }
  };

  // Toggle full story narration
  const toggleFullStoryAudio = () => {
    if (isPlayingFullStory) {
      stopSpeech();
      setIsPlayingFullStory(false);
    } else {
      setIsPlayingFullStory(true);
      speakStory(story.content, {
        onEnd: () => setIsPlayingFullStory(false),
        onError: () => setIsPlayingFullStory(false)
      });
    }
  };

  // Handle completion reward
  const handleFinishStory = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    addExp(20);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00FFFF', '#FF00FF', '#10B981']
    });
  };

  // Render text with clickable words
  const renderInteractiveText = (text) => {
    // Split text by spaces but keep whitespace attached for rendering
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
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'rgba(0, 255, 255, 0.25)',
            display: 'inline-block'
          }}
          className="hover:text-[var(--color-primary)] hover:drop-shadow-[0_0_5px_var(--color-primary)] active:text-[var(--color-primary)]"
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
        <div style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
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

          {/* Full Story Narration Control */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={toggleFullStoryAudio}
              className={`ui-btn ${isPlayingFullStory ? 'ui-btn-accent' : 'ui-btn-primary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '9999px' }}
            >
              {isPlayingFullStory ? (
                <>
                  <Square size={18} />
                  <span>⏹️ หยุดฟังเสียง (Stop Audio)</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>🔊 ฟังเสียงทั้งบทความ (Read Aloud)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Story Content */}
      <Card className="p-6 md:p-10 leading-loose text-lg md:text-xl text-white/90">
        {renderInteractiveText(story.content)}
      </Card>

      {/* Bottom Action Bar */}
      <div className="story-action-bar">
        {/* Toggle Translation Button */}
        <button
          onClick={() => setShowTranslation(prev => !prev)}
          className={`ui-btn ${showTranslation ? 'ui-btn-accent' : 'ui-btn-primary'}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem'
          }}
        >
          <Languages size={20} />
          <span>{showTranslation ? 'ซ่อนคำแปล (Hide Translation)' : 'แปลบทความ (Show Translation)'}</span>
        </button>

        {/* EXP Reward Button */}
        <button
          onClick={handleFinishStory}
          disabled={isCompleted}
          className={`story-btn-exp ${isCompleted ? 'completed' : ''}`}
          style={{ fontSize: '0.95rem' }}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={20} />
              <span>อ่านจบแล้ว (+20 EXP ได้รับแล้ว)</span>
            </>
          ) : (
            <>
              <Sparkles size={20} color="#FFD700" />
              <span>อ่านจบแล้ว (+20 EXP)</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Thai Translation Card */}
      {showTranslation && (
        <Card className="story-translation-box animate-fade-up p-6 md:p-10">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            paddingBottom: '0.75rem', 
            marginBottom: '1.25rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
          }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #FF00FF, #00FFFF)', 
              color: '#FFFFFF', 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '4px',
              letterSpacing: '1px'
            }}>
              THAI
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                คำแปลภาษาไทย
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-secondary)', margin: 0 }}>
                {story.titleThai || story.title}
              </h3>
            </div>
          </div>
          <p style={{ lineHeight: '2', fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.95)', whiteSpace: 'pre-line' }}>
            {story.contentThai}
          </p>
        </Card>
      )}

      {/* Word Details Modal/Drawer */}
      {selectedWord && (
        <div 
          className="mobile-safe-drawer animate-[slideUp_0.3s_ease-out]"
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))'
          }}
        >
          <Card className="p-6 border border-[var(--color-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(0,255,255,0.1)]">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', margin: 0, fontWeight: 'bold' }}>
                    {selectedWord.word}
                  </h3>
                  {selectedWord.level && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(0,255,255,0.1)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(0,255,255,0.2)'
                    }}>
                      {selectedWord.level}
                    </span>
                  )}
                </div>

                {!selectedWord.notFound && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    {selectedWord.type && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral)' }}>{selectedWord.type}</span>
                    )}
                    {selectedWord.ipa && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral)', fontStyle: 'italic' }}>/{selectedWord.ipa}/</span>
                    )}
                    {selectedWord.note && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-primary)',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px'
                      }}>
                        {selectedWord.note}
                      </span>
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
                <p style={{ fontSize: '1.2rem', color: 'var(--color-secondary)', margin: '0 0 0.75rem 0', fontWeight: '500' }}>
                  {selectedWord.meaning || 'ไม่มีคำแปล'}
                </p>
                {selectedWord.thai_pronunciation && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral)', margin: 0 }}>
                    คำอ่าน: <span style={{ color: 'var(--color-primary)' }}>{selectedWord.thai_pronunciation}</span>
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
