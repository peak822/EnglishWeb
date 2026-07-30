import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, BookOpen, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import { POS_LESSONS } from '../data/posLessons';
import { extractPrimaryPOS, POS_MAP } from '../utils/posUtils';
import vocabularyData from '../data/vocabulary.json';

const POSGuide = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const lesson = POS_LESSONS[activeTab];

  // Filter vocabulary words matching active POS
  const matchingWords = useMemo(() => {
    return vocabularyData.filter(word => {
      const pos = extractPrimaryPOS(word.type);
      return pos === POS_MAP[lesson.abbreviation];
    });
  }, [lesson.abbreviation]);

  // Show first 10 example words
  const exampleWords = matchingWords.slice(0, 10);

  const playAudio = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Parse example sentence to highlight bold words
  const renderSentence = (sentence) => {
    const parts = sentence.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span key={i} style={{ 
            color: lesson.color, 
            fontWeight: 'bold',
            textShadow: `0 0 8px ${lesson.color}40`
          }}>
            {word}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="container animate-fade-up max-w-5xl mx-auto px-4 mt-4 md:mt-8">
      {/* Header and Tabs Container */}
      <div className="bg-black/95 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl mb-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-gradient mb-4 text-3xl md:text-5xl font-extrabold tracking-tight">Part of Speech Guide</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
            เรียนรู้ชนิดของคำในภาษาอังกฤษ พร้อมตัวอย่างจากคลัง Oxford 3000
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[var(--color-primary)] scrollbar-track-transparent px-2">
          {POS_LESSONS.map((pos, index) => (
            <button
              key={pos.name}
              onClick={() => setActiveTab(index)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                border: activeTab === index ? `2px solid ${pos.color}` : '2px solid rgba(255,255,255,0.3)',
                background: activeTab === index ? `${pos.color}30` : 'rgba(0,0,0,0.6)',
                color: activeTab === index ? pos.color : '#ffffff',
                fontWeight: activeTab === index ? 'bold' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === index ? `0 0 20px ${pos.color}60` : 'none',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{pos.icon}</span>
              {pos.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Content Card */}
      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        {/* POS Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{lesson.icon}</span>
          <div>
            <h3 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              color: lesson.color,
              textShadow: `0 0 10px ${lesson.color}40`,
              marginBottom: '0.25rem'
            }}>
              {lesson.name}
            </h3>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-neutral)' }}>
              ({lesson.thaiName})
            </span>
          </div>
        </div>

        {/* Definition */}
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0.75rem', 
          padding: '1.25rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ fontSize: '0.75rem', color: lesson.color, fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Definition / ความหมาย
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-secondary)', lineHeight: '1.8', margin: 0 }}>
            {lesson.definition}
          </p>
        </div>

        {/* Tip */}
        <div style={{ 
          background: `${lesson.color}10`, 
          border: `1px solid ${lesson.color}30`,
          borderLeft: `4px solid ${lesson.color}`,
          borderRadius: '0.75rem', 
          padding: '1.25rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ fontSize: '0.75rem', color: lesson.color, fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💡 Tip / เคล็ดลับจำ
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--color-secondary)', lineHeight: '1.8', margin: 0 }}>
            {lesson.tip}
          </p>
        </div>

        {/* Example Sentence */}
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0.75rem', 
          padding: '1.25rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ fontSize: '0.75rem', color: lesson.color, fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Example / ตัวอย่างประโยค
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-secondary)', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>
            "{renderSentence(lesson.exampleSentence)}"
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-neutral)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
            → {lesson.exampleTranslation}
          </p>
        </div>
      </Card>

      {/* Example Words from Oxford 3000 */}
      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-secondary)', margin: 0 }}>
            📚 ตัวอย่างคำศัพท์จาก Oxford 3000
          </h4>
          <span style={{ 
            fontSize: '0.8rem', 
            color: lesson.color, 
            background: `${lesson.color}15`,
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            border: `1px solid ${lesson.color}30`,
            fontWeight: 'bold'
          }}>
            {matchingWords.length} คำ
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="vocab-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-neutral)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Word</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-neutral)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Meaning</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-neutral)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Level</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-neutral)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></th>
              </tr>
            </thead>
            <tbody>
              {exampleWords.map(word => {
                const levelClass = word.level.charAt(0);
                return (
                  <tr key={word.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: lesson.color }}>{word.word}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--color-secondary)' }}>{word.meaning || '—'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span className={`td-level level-${levelClass}`}>{word.level}</span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => playAudio(word.word)}
                        className="audio-btn"
                        title="Listen to pronunciation"
                        style={{ margin: '0 auto' }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {matchingWords.length > 10 && (
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-neutral)' }}>
            แสดง 10 จาก {matchingWords.length} คำ — ดูคำศัพท์ทั้งหมดได้ในโหมด "อ่านคำศัพท์"
          </p>
        )}
      </Card>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button 
          className="ui-btn ui-btn-secondary"
          style={{ padding: '0.75rem 2rem' }}
          onClick={() => navigate('/')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
            กลับหน้าแรก
          </span>
        </button>
      </div>
    </div>
  );
};

export default POSGuide;
