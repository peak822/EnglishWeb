import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import storiesData from '../data/stories.json';

const StorySelection = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  }, []);

  const categories = [
    { 
      id: 'A1', 
      title: 'A1 Beginner', 
      titleThai: 'ระดับเริ่มต้น (Beginner)',
      description: 'ประโยคสั้น ศัพท์พื้นฐานในชีวิตประจำวัน ไวยากรณ์เข้าใจง่าย',
      icon: Sparkles, 
      color: '#4ade80',
      levelClass: 'story-level-a1',
      activePillClass: 'active-A1'
    },
    { 
      id: 'A2', 
      title: 'A2 Elementary', 
      titleThai: 'ระดับต้น (Elementary)',
      description: 'บทสนทนาและการสื่อสารในสถานการณ์ทั่วไป กิจวัตรและการเดินทาง',
      icon: BookOpen, 
      color: '#2dd4bf',
      levelClass: 'story-level-a2',
      activePillClass: 'active-A2'
    },
    { 
      id: 'B1', 
      title: 'B1 Intermediate', 
      titleThai: 'ระดับกลาง (Intermediate)',
      description: 'เนื้อเรื่องเชื่อมโยง การแก้ปัญหา การทำงาน และสถานการณ์สังคม',
      icon: Award, 
      color: '#38bdf8',
      levelClass: 'story-level-b1',
      activePillClass: 'active-B1'
    },
    { 
      id: 'B2', 
      title: 'B2 Upper Intermediate', 
      titleThai: 'ระดับกลางสูง (Upper Intermediate)',
      description: 'บทความวิเคราะห์ การเจรจาต่อรอง การจัดการชีวิต และศัพท์เชิงลึก',
      icon: Zap, 
      color: '#c084fc',
      levelClass: 'story-level-b2',
      activePillClass: 'active-B2'
    },
    { 
      id: 'C1', 
      title: 'C1 Advanced', 
      titleThai: 'ระดับสูง (Advanced)',
      description: 'บทความวิเคราะห์เชิงลึก ปรัชญา การเจรจาขั้นสูง และโครงสร้างภาษาที่สละสลวย',
      icon: ShieldCheck, 
      color: '#f43f5e',
      levelClass: 'story-level-c1',
      activePillClass: 'active-C1'
    }
  ];

  const getStoryCount = (levelId) => {
    return storiesData.filter(story => story.level.startsWith(levelId)).length;
  };

  const currentCategory = categories.find(c => c.id === selectedLevel);

  // Filter stories by selected level and search term
  const filteredStories = useMemo(() => {
    if (!selectedLevel) return [];
    
    return storiesData.filter(story => {
      const matchLevel = story.level.startsWith(selectedLevel);
      if (!matchLevel) return false;
      
      if (!searchTerm.trim()) return true;
      
      const query = searchTerm.toLowerCase().trim();
      const titleEn = (story.title || '').toLowerCase();
      const titleTh = (story.titleThai || '').toLowerCase();
      return titleEn.includes(query) || titleTh.includes(query);
    });
  }, [selectedLevel, searchTerm]);

  // Reset search term when switching levels
  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    setSearchTerm('');
  };

  const renderLevelCard = (category) => {
    const Icon = category.icon;
    const count = getStoryCount(category.id);

    const cardInner = (
      <div 
        className={`story-level-card ${category.levelClass}`}
        onClick={() => handleSelectLevel(category.id)}
      >
        <div>
          {/* Top Row: Icon & Count Badge */}
          <div className="story-level-top">
            <div 
              className="story-level-icon-box"
              style={{ 
                background: `${category.color}18`,
                border: `1.5px solid ${category.color}50`,
                color: category.color,
                boxShadow: `0 0 16px ${category.color}25`
              }}
            >
              <Icon size={26} />
            </div>

            <span 
              className="story-level-count-badge"
              style={{
                background: `${category.color}15`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              {count} บทความ
            </span>
          </div>

          {/* Level Title & Thai Subtitle */}
          <h3 className="story-level-title">
            {category.title}
          </h3>
          <div 
            className="story-level-thai-title"
            style={{ color: category.color }}
          >
            {category.titleThai}
          </div>

          {/* Description */}
          <p className="story-level-desc">
            {category.description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div 
          className="story-level-action"
          style={{ color: category.color }}
        >
          <span>เลือกหมวดนี้ (Select Level)</span>
          <ArrowRight size={18} className="story-level-action-arrow transform transition-transform duration-200" />
        </div>
      </div>
    );

    if (isTouchDevice) {
      return (
        <div key={category.id} style={{ height: '100%' }}>
          {cardInner}
        </div>
      );
    }

    return (
      <Tilt
        key={category.id}
        tiltMaxAngleX={7}
        tiltMaxAngleY={7}
        perspective={1200}
        scale={1.02}
        transitionSpeed={800}
        style={{ height: '100%' }}
      >
        {cardInner}
      </Tilt>
    );
  };

  return (
    <div className="story-selection-wrap animate-fade-up">
      
      {/* 🌟 Header Hero Banner */}
      <div className="story-hero-banner">
        <h2 className="story-hero-title">
          Short Story Reading
        </h2>
        <p className="story-hero-subtitle">
          ฝึกอ่านบทความภาษาอังกฤษเพลินๆ ตามระดับความยาก CEFR พร้อมแตะคำศัพท์เพื่อดูความหมาย คำอ่าน และฟังเสียง Oxford 5000 ได้ทันที
        </p>
      </div>

      {!selectedLevel ? (
        /* 🎴 LEVEL SELECTION VIEW (2x2 Grid) */
        <div>
          <div className="story-section-header">
            <div className="story-section-title-wrap">
              <h3>
                <Sparkles className="text-cyan-400" size={22} />
                เลือกระดับความยาก (Select CEFR Level)
              </h3>
              <p className="story-section-desc">
                เลือกบทเรียนที่เหมาะสมกับระดับของคุณเพื่อการฝึกฝนภาษาอังกฤษอย่างมีประสิทธิภาพ
              </p>
            </div>
            <span className="story-total-count-pill">
              ทั้งหมด {storiesData.length} บทความ
            </span>
          </div>

          <div className="story-level-grid">
            {categories.map(category => renderLevelCard(category))}
          </div>
        </div>
      ) : (
        /* 📚 STORY CATALOG VIEW (3-Column Grid + Search) */
        <div>
          {/* Top Controls & Navigation Bar */}
          <div className="story-catalog-controls">
            
            <div className="story-catalog-topbar">
              {/* Left: Back to levels & Current Level Title */}
              <div className="story-catalog-left">
                <button 
                  className="ui-btn ui-btn-secondary text-sm py-2 px-3 flex items-center gap-2"
                  onClick={() => {
                    setSelectedLevel(null);
                    setSearchTerm('');
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>เลือกระดับ (Levels)</span>
                </button>

                {currentCategory && (
                  <div className="story-level-badge-indicator">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: currentCategory.color, 
                        boxShadow: `0 0 8px ${currentCategory.color}` 
                      }}
                    ></span>
                    <span className="font-bold text-white">
                      {currentCategory.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({filteredStories.length} จาก {getStoryCount(currentCategory.id)} บท)
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Quick Level Switcher Pills */}
              <div className="story-pills-wrap">
                <span className="text-xs text-slate-400 font-semibold mr-1">สลับระดับ:</span>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`story-level-pill ${selectedLevel === cat.id ? cat.activePillClass : ''}`}
                    onClick={() => handleSelectLevel(cat.id)}
                  >
                    {cat.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrated Real-Time Search Bar */}
            <div className="story-search-wrap">
              <Search size={17} className="story-search-icon" />
              <input
                type="text"
                placeholder={`ค้นหาบทความในระดับ ${currentCategory?.id || ''} (ค้นหาด้วยชื่อภาษาอังกฤษ หรือ คำแปลไทย)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="story-search-input"
              />
              {searchTerm && (
                <button
                  className="story-search-clear"
                  onClick={() => setSearchTerm('')}
                  title="ล้างข้อความค้นหา"
                >
                  <X size={15} />
                </button>
              )}
            </div>

          </div>

          {/* Stories 3-Column Grid */}
          <div className="story-catalog-grid">
            {filteredStories.length > 0 ? (
              filteredStories.map(story => {
                const levelPrefix = story.level.substring(0, 2);
                const matchingCat = categories.find(c => c.id === levelPrefix) || categories[0];

                return (
                  <div 
                    key={story.id} 
                    className={`story-card ${matchingCat.levelClass}`}
                    onClick={() => navigate(`/story-mode/${story.id}`)}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="story-card-top">
                        <span className="story-genre-tag">
                          {story.genre}
                        </span>
                        <span 
                          className="story-level-badge"
                          style={{
                            background: `${matchingCat.color}18`,
                            color: matchingCat.color,
                            border: `1px solid ${matchingCat.color}45`
                          }}
                        >
                          {story.level}
                        </span>
                      </div>
                      
                      {/* Story Titles */}
                      <div className="story-card-body">
                        <h4 className="story-card-title">
                          {story.title}
                        </h4>
                        
                        {story.titleThai && (
                          <p className="story-card-thai-title">
                            {story.titleThai}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Footer: Read Time & Action */}
                    <div className="story-card-footer">
                      <div className="story-read-time">
                        <Clock size={14} className="text-cyan-400" />
                        <span>{story.readTime}</span>
                      </div>

                      <div 
                        className="story-read-action"
                        style={{ color: matchingCat.color }}
                      >
                        <span>เริ่มอ่าน</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Search Results State */
              <div className="story-empty-state">
                <BookOpen size={40} className="mx-auto text-slate-500 mb-3" />
                <h4 className="text-white text-base font-bold mb-1">
                  ไม่พบบทความที่ตรงกับ "{searchTerm}"
                </h4>
                <p className="text-slate-400 text-xs mb-4">
                  ลองเปลี่ยนคำค้นหา หรือค้นหาด้วยชื่อภาษาอังกฤษ/ไทยคำอื่น
                </p>
                <button
                  className="ui-btn ui-btn-primary text-xs py-1.5 px-4"
                  onClick={() => setSearchTerm('')}
                >
                  ล้างการค้นหา
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Bottom Navigation Button */}
      <div className="text-center mt-4 mb-8">
        <button 
          className="ui-btn ui-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl"
          onClick={() => {
            if (selectedLevel) {
              setSelectedLevel(null);
              setSearchTerm('');
            } else {
              navigate('/');
            }
          }}
        >
          <ArrowLeft size={16} />
          <span>{selectedLevel ? 'กลับไปเลือกระดับ (Back to Levels)' : 'กลับหน้าแรก (Back Home)'}</span>
        </button>
      </div>

    </div>
  );
};

export default StorySelection;
