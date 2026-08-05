import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft, ArrowRight, Sparkles, Award, Zap, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import storiesData from '../data/stories.json';

const StorySelection = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const categories = [
    { 
      id: 'A1', 
      title: 'A1 Beginner', 
      titleThai: 'ระดับเริ่มต้น',
      description: 'ประโยคสั้น ศัพท์พื้นฐานในชีวิตประจำวัน',
      icon: Sparkles, 
      color: '#4ade80',
      badgeClass: 'level-card-a1',
      activePillClass: 'active-A1'
    },
    { 
      id: 'A2', 
      title: 'A2 Elementary', 
      titleThai: 'ระดับต้น',
      description: 'บทสนทนาและการสื่อสารในสถานการณ์ทั่วไป',
      icon: BookOpen, 
      color: '#2dd4bf',
      badgeClass: 'level-card-a2',
      activePillClass: 'active-A2'
    },
    { 
      id: 'B1', 
      title: 'B1 Intermediate', 
      titleThai: 'ระดับกลาง',
      description: 'เนื้อเรื่องเชื่อมโยง การแก้ปัญหาและการทำงาน',
      icon: Award, 
      color: '#38bdf8',
      badgeClass: 'level-card-b1',
      activePillClass: 'active-B1'
    },
    { 
      id: 'B2', 
      title: 'B2 Upper Intermediate', 
      titleThai: 'ระดับกลางสูง',
      description: 'บทความวิเคราะห์ การเจรจาต่อรอง และศัพท์เชิงลึก',
      icon: Zap, 
      color: '#c084fc',
      badgeClass: 'level-card-b2',
      activePillClass: 'active-B2'
    }
  ];

  const getStoryCount = (levelId) => {
    return storiesData.filter(story => story.level.startsWith(levelId)).length;
  };

  const currentCategory = categories.find(c => c.id === selectedLevel);

  const filteredStories = selectedLevel 
    ? storiesData.filter(story => story.level.startsWith(selectedLevel))
    : [];

  return (
    <div className="container animate-fade-up max-w-6xl mx-auto px-4 py-4">
      {/* Header Banner */}
      <div className="cyber-glass-card p-6 md:p-8 mb-8 text-center border-cyan-500/30">
        <h2 className="text-gradient text-2xl md:text-3xl font-extrabold mb-3 tracking-wide">
          Short Story Reading
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          ฝึกอ่านบทความภาษาอังกฤษตามระดับความยาก คลิกที่คำศัพท์เพื่อดูความหมายและคำอ่าน Oxford 5000 ได้ทันที
        </p>
      </div>

      {!selectedLevel ? (
        /* LEVEL SELECTION VIEW (2x2 Grid) */
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 px-1">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-cyan-400" size={22} />
                เลือกระดับความยาก (Select CEFR Level)
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                เลือกบทเรียนที่เหมาะสมกับระดับของคุณเพื่อการเรียนรู้ที่มีประสิทธิภาพ
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              ทั้งหมด {storiesData.length} บทความ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map(category => {
              const Icon = category.icon;
              const count = getStoryCount(category.id);
              return (
                <div
                  key={category.id}
                  className={`cyber-glass-card ${category.badgeClass} p-6 cursor-pointer flex flex-col justify-between group`}
                  onClick={() => setSelectedLevel(category.id)}
                >
                  <div>
                    {/* Top Row: Icon & Count Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                        style={{ 
                          background: `${category.color}1a`,
                          border: `1px solid ${category.color}40`,
                          color: category.color,
                          boxShadow: `0 0 16px ${category.color}20`
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                        style={{
                          background: `${category.color}15`,
                          color: category.color,
                          border: `1px solid ${category.color}35`
                        }}
                      >
                        {count} บทความ
                      </span>
                    </div>

                    {/* Level Title & Thai Subtitle */}
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      {category.title}
                    </h3>
                    <div 
                      className="text-xs font-semibold tracking-wide mb-3"
                      style={{ color: category.color }}
                    >
                      {category.titleThai}
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {category.description}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div 
                    className="flex items-center justify-between pt-3 border-t border-slate-800 text-sm font-semibold transition-all"
                    style={{ color: category.color }}
                  >
                    <span>เลือกหมวดนี้ (Select)</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* STORY SELECTION VIEW */
        <div>
          {/* Top Control Bar with Quick Level Switcher */}
          <div className="cyber-glass-card p-4 md:p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                className="ui-btn ui-btn-secondary text-sm py-2 px-3 flex items-center gap-2"
                onClick={() => setSelectedLevel(null)}
              >
                <ArrowLeft size={16} />
                <span>เลือกระดับ (Levels)</span>
              </button>
              
              <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

              {currentCategory && (
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: currentCategory.color, boxShadow: `0 0 8px ${currentCategory.color}` }}
                  ></span>
                  <span className="font-bold text-white text-base">
                    {currentCategory.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({filteredStories.length} บทความ)
                  </span>
                </div>
              )}
            </div>

            {/* Quick Level Switcher Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold mr-1">สลับระดับ:</span>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`story-level-pill ${selectedLevel === cat.id ? cat.activePillClass : ''}`}
                  onClick={() => setSelectedLevel(cat.id)}
                >
                  {cat.id}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredStories.map(story => {
              const levelPrefix = story.level.substring(0, 2);
              const matchingCat = categories.find(c => c.id === levelPrefix) || categories[0];

              return (
                <div 
                  key={story.id} 
                  className={`cyber-glass-card ${matchingCat.badgeClass} p-5 cursor-pointer flex flex-col justify-between group`}
                  onClick={() => navigate(`/story-mode/${story.id}`)}
                >
                  <div>
                    {/* Badges Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {story.genre}
                      </span>
                      <span 
                        className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider"
                        style={{
                          background: `${matchingCat.color}20`,
                          color: matchingCat.color,
                          border: `1px solid ${matchingCat.color}45`
                        }}
                      >
                        {story.level}
                      </span>
                    </div>
                    
                    {/* Titles */}
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1 leading-snug">
                      {story.title}
                    </h4>
                    
                    {story.titleThai && (
                      <p className="text-xs text-cyan-200/75 mb-4 line-clamp-1 font-medium">
                        {story.titleThai}
                      </p>
                    )}
                  </div>
                  
                  {/* Card Footer: Read Time & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="text-cyan-400" />
                      <span>{story.readTime}</span>
                    </div>

                    <div 
                      className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform"
                      style={{ color: matchingCat.color }}
                    >
                      <span>เริ่มอ่าน</span>
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Global Back Button */}
      <div className="text-center mb-8">
        <button 
          className="ui-btn ui-btn-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl"
          onClick={() => {
            if (selectedLevel) {
              setSelectedLevel(null);
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
