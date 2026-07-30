import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft, Star, Award, Zap } from 'lucide-react';
import Card from '../components/Card';
import storiesData from '../data/stories.json';

const StorySelection = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const categories = [
    { id: 'A1', title: 'A1 Beginner', icon: Star, color: '#4ade80' },
    { id: 'A2', title: 'A2 Elementary', icon: BookOpen, color: '#2dd4bf' },
    { id: 'B1', title: 'B1 Intermediate', icon: Award, color: '#3b82f6' },
    { id: 'B2', title: 'B2 Upper Intermediate', icon: Zap, color: '#8b5cf6' }
  ];

  const filteredStories = selectedLevel 
    ? storiesData.filter(story => story.level.startsWith(selectedLevel))
    : [];

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card style={{ padding: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 className="text-gradient mb-4">Short Story Reading</h2>
        <p style={{ color: 'var(--color-neutral)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Choose a story to read. Click on any word in the story to see its meaning from the Oxford 3000 vocabulary list.
        </p>
      </Card>

      {!selectedLevel ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                style={{ 
                  padding: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem'
                }}
                onClick={() => setSelectedLevel(category.id)}
                className="ui-card hover-glow"
              >
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '50%', 
                  background: `${category.color}20`,
                  color: category.color
                }}>
                  <Icon size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                  {category.title}
                </h3>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }}>
            <button 
              className="ui-btn ui-btn-secondary"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setSelectedLevel(null)}
            >
              <ArrowLeft size={16} />
              กลับไปเลือกระดับ (Back to Levels)
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {filteredStories.map(story => {
          const levelClass = story.level.charAt(0);
          return (
            <Card 
              key={story.id} 
              style={{ 
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onClick={() => navigate(`/story-mode/${story.id}`)}
              className="ui-card hover-glow"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)',
                  background: 'rgba(0, 255, 255, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {story.genre}
                </span>
                <span className={`td-level level-${levelClass}`} style={{ margin: 0, padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                  {story.level}
                </span>
              </div>
              
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: 'var(--color-secondary)',
                marginBottom: '0.5rem',
                flexGrow: 1
              }}>
                {story.title}
              </h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'var(--color-neutral)',
                fontSize: '0.875rem'
              }}>
                <Clock size={14} />
                <span>{story.readTime}</span>
              </div>
            </Card>
          );
        })}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Card style={{ 
          display: 'inline-block', 
          padding: '1.5rem 3rem'
        }}>
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
        </Card>
      </div>
    </div>
  );
};

export default StorySelection;
