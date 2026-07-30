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
    <div className="container animate-fade-up max-w-5xl mx-auto px-4">
      <Card className="p-6 md:p-8 mb-10 text-center">
        <h2 className="text-gradient mb-4">Short Story Reading</h2>
        <p className="text-[var(--color-neutral)] max-w-2xl mx-auto text-lg">
          Choose a story to read. Click on any word in the story to see its meaning from the Oxford 3000 vocabulary list.
        </p>
      </Card>

      {!selectedLevel ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className="ui-card hover-glow p-8 cursor-pointer flex flex-col items-center text-center gap-4"
                onClick={() => setSelectedLevel(category.id)}
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
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredStories.map(story => {
          const levelClass = story.level.charAt(0);
          return (
            <Card 
              key={story.id} 
              className="ui-card hover-glow p-6 cursor-pointer flex flex-col h-full"
              onClick={() => navigate(`/story-mode/${story.id}`)}
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

      <div className="text-center mb-8">
        <Card className="inline-block p-4 md:p-8">
          {selectedLevel ? (
            <button 
              className="ui-btn ui-btn-secondary"
              style={{ padding: '0.75rem 2rem' }}
              onClick={() => setSelectedLevel(null)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <ArrowLeft size={18} />
                กลับไปเลือกระดับ (Back to Levels)
              </span>
            </button>
          ) : (
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
          )}
        </Card>
      </div>
    </div>
  );
};

export default StorySelection;
