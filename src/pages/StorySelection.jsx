import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Card from '../components/Card';
import storiesData from '../data/stories.json';

const StorySelection = () => {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="text-center mb-10">
        <h2 className="text-gradient mb-4">Short Story Reading</h2>
        <p style={{ color: 'var(--color-neutral)', maxWidth: '600px', margin: '0 auto' }}>
          Choose a story to read. Click on any word in the story to see its meaning from the Oxford 3000 vocabulary list.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {storiesData.map(story => {
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

export default StorySelection;
