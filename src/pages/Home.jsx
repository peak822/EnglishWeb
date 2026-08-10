import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Volume2, 
  Grid, 
  Zap, 
  HelpCircle, 
  Type, 
  Puzzle, 
  ArrowRight, 
  Flame, 
  Award, 
  Sparkles, 
  Compass,
  Layers,
  FileText,
  Bookmark,
  Settings
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useGamification } from '../hooks/useGamification';
import VoiceSettings from '../components/VoiceSettings';

const Home = () => {
  const navigate = useNavigate();
  const { exp, level, rankTitle, rankColor, rankIcon, streakDays, badges, nextLevelExp, currentLevelBaseExp } = useGamification();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
  }, []);

  const expProgress = Math.max(0, Math.min(100, ((exp - currentLevelBaseExp) / (nextLevelExp - currentLevelBaseExp)) * 100));

  const domains = [
    {
      id: 'reading',
      title: 'ทักษะการอ่านและการทำความเข้าใจ',
      subtitle: 'Reading & Comprehension',
      icon: '📖',
      color: '#10b981',
      modes: [
        {
          id: 'story-mode',
          title: 'อ่านบทความสั้น',
          subtitle: 'Interactive Short Stories',
          description: 'ฝึกอ่านบทความภาษาอังกฤษเพลินๆ พร้อมแตะคำศัพท์เพื่อดูความหมายและฟังเสียงได้ทันที',
          icon: <BookOpen size={28} />,
          path: '/story-mode',
          tag: '📖 Reading',
          color: '#10b981'
        },
        {
          id: 'read',
          title: 'คลังคำศัพท์ Oxford 5000',
          subtitle: 'Vocabulary Browser',
          description: 'ค้นหาและเปิดดูคลังคำศัพท์ 5,000 คำหลักที่จำเป็นที่สุด พร้อมคำแปลและระดับความยาก A1-C1',
          icon: <Compass size={28} />,
          path: '/read',
          tag: '📚 Vocab Bank',
          color: '#38bdf8'
        }
      ]
    },
    {
      id: 'listening',
      title: 'ทักษะการฟังและการออกเสียง',
      subtitle: 'Listening & Pronunciation',
      icon: '🎧',
      color: '#4ade80',
      modes: [
        {
          id: 'listen',
          title: 'ทายคำจากการฟัง',
          subtitle: 'Audio Recognition Drill',
          description: 'ฝึกหูให้คุ้นเคยกับสำเนียงเจ้าของภาษา ฟังเสียงอ่านคำศัพท์แล้วทายตัวสะกดและความหมาย',
          icon: <Volume2 size={28} />,
          path: '/listen',
          tag: '🎧 Audio Test',
          color: '#4ade80'
        }
      ]
    },
    {
      id: 'vocabulary',
      title: 'คลังคำศัพท์และความจำไว',
      subtitle: 'Vocabulary & Reflexes',
      icon: '⚡',
      color: '#00f2fe',
      modes: [
        {
          id: 'match',
          title: 'เกมจับคู่คำศัพท์ (Match)',
          subtitle: '3D Memory Matching',
          description: 'ท้าทายความจำ! แตะเปิดการ์ด 3D เพื่อจับคู่คำศัพท์ภาษาอังกฤษกับความหมายภาษาไทยให้เร็วที่สุด',
          icon: <Grid size={28} />,
          path: '/match',
          tag: '⚡ 3D Flip',
          color: '#00f2fe'
        },
        {
          id: 'swipe',
          title: 'โหมดปัดการ์ดด่วน (Swipe)',
          subtitle: 'Speed Reflex Swipe',
          description: 'ทดสอบสัญชาตญาณความไว ปัดขวาเมื่อคำแปลถูกต้อง และปัดซ้ายเมื่อผิด ทำคอมโบต่อเนื่อง!',
          icon: <Zap size={28} />,
          path: '/swipe',
          tag: '⚡ Reflex Drill',
          color: '#f59e0b'
        },
        {
          id: 'guess',
          title: 'ทายคำศัพท์ (Guess)',
          subtitle: 'Hint-Based Guessing',
          description: 'ฝึกนึกคำศัพท์จากคำใบ้ เช่น ความหมาย ชนิดของคำ และความยาวตัวอักษร',
          icon: <HelpCircle size={28} />,
          path: '/guess',
          tag: '🔍 Clues',
          color: '#fbbf24'
        },
        {
          id: 'typing',
          title: 'พิมพ์คำศัพท์ (Typing)',
          subtitle: 'Speed Typing & Recall',
          description: 'ฝึกพิมพ์คำศัพท์จากความจำตามระดับและคำแปลภาษาไทย เพิ่มความจำของกล้ามเนื้อมือ',
          icon: <Type size={28} />,
          path: '/typing',
          tag: '✍️ Typing Drill',
          color: '#ec4899'
        },
        {
          id: 'assemble',
          title: 'ประกอบคำศัพท์ (Assemble)',
          subtitle: 'Letter Scramble Puzzle',
          description: 'เรียงตัวอักษรที่สลับตำแหน่งให้กลายเป็นคำศัพท์ที่ถูกต้อง ช่วยจำตัวสะกดได้อย่างแม่นยำ',
          icon: <Puzzle size={28} />,
          path: '/assemble',
          tag: '🧩 Anagram',
          color: '#a855f7'
        }
      ]
    },
    {
      id: 'grammar',
      title: 'ไวยากรณ์และโครงสร้างประโยค',
      subtitle: 'Grammar & Structure',
      icon: '📐',
      color: '#c084fc',
      modes: [
        {
          id: 'pos',
          title: 'ฝึกจำแนก Part of Speech',
          subtitle: 'Rapid Fire Word Class Quiz',
          description: 'ฝึกสัญชาตญาณจำแนกคำศัพท์ 7 ชนิด (Noun, Verb, Adj ฯลฯ) พร้อมระบบคอมโบและเสียงเอฟเฟกต์',
          icon: <Layers size={28} />,
          path: '/pos',
          tag: '⚡ Speed Grammar',
          color: '#e879f9'
        },
        {
          id: 'pos-guide',
          title: 'คู่มือ 7 Parts of Speech',
          subtitle: 'Grammar Cheat Sheet',
          description: 'สรุปหน้าที่ ตำแหน่งในประโยค และข้อสังเกตของคำทั้ง 7 ชนิด เข้าใจง่ายพร้อมตัวอย่าง',
          icon: <FileText size={28} />,
          path: '/pos-guide',
          tag: '📚 Cheat Sheet',
          color: '#38bdf8'
        },
        {
          id: 'syntax',
          title: 'วิเคราะห์โครงสร้างประโยค (Syntax)',
          subtitle: 'Sentence Blueprint Builder',
          description: 'ทำความเข้าใจ Subject, Verb, Object, Prepositional Phrase ด้วยแถบสีและไฮไลต์',
          icon: <Bookmark size={28} />,
          path: '/syntax',
          tag: '🧩 Syntax Master',
          color: '#a855f7'
        },
        {
          id: 'context',
          title: 'เติมคำในช่องว่าง (Context Clues)',
          subtitle: 'Cloze Reading Challenge',
          description: 'ฝึกวิเคราะห์บริบทของประโยคเพื่อเลือกคำศัพท์ที่ถูกต้องและเหมาะสมที่สุด',
          icon: <FileText size={28} />,
          path: '/context',
          tag: '📝 Context Mastery',
          color: '#c084fc'
        }
      ]
    }
  ];

  const renderCardContent = (mode) => (
    <div 
      className="home-mode-card"
      style={{ '--card-color': mode.color }}
      onClick={() => navigate(mode.path)}
    >
      <div className="home-mode-top">
        <div 
          className="home-mode-icon-box"
          style={{ 
            color: mode.color, 
            background: `${mode.color}1a`,
            border: `1.5px solid ${mode.color}55`
          }}
        >
          {mode.icon}
        </div>
        <span 
          className="home-mode-tag"
          style={{ 
            color: mode.color, 
            background: `${mode.color}15`,
            border: `1px solid ${mode.color}40`
          }}
        >
          {mode.tag}
        </span>
      </div>

      <h3 className="home-mode-title">{mode.title}</h3>
      <div className="text-xs font-semibold mb-2" style={{ color: mode.color }}>
        {mode.subtitle}
      </div>
      <p className="home-mode-desc">{mode.description}</p>

      <div className="home-mode-action" style={{ color: mode.color }}>
        <span>เข้าสู่โหมดฝึก</span>
        <ArrowRight size={18} className="home-mode-action-arrow" />
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-up" style={{ maxWidth: '1180px', padding: '1rem 1rem 4rem 1rem' }}>
      
      {/* 🚀 CYBERPUNK COMMAND DECK */}
      <section className="home-command-deck">
        
        {/* Profile & EXP Hub */}
        <div className="home-deck-card" style={{ '--card-accent': rankColor }}>
          <div className="home-profile-header">
            <div className="home-avatar-wrap">
              <div className="home-avatar-circle" style={{ color: rankColor, borderColor: rankColor }}>
                <span className="text-2xl sm:text-3xl">{rankIcon}</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg sm:text-xl font-extrabold text-white">Commander</span>
                  <span className="home-rank-badge" style={{ color: rankColor, borderColor: rankColor, background: `${rankColor}1a` }}>
                    Lv.{level} • {rankTitle}
                  </span>
                </div>
                <div className="text-xs text-[#94a3b8] mt-0.5">
                  ความก้าวหน้าสู่เลเวลถัดไป
                </div>
              </div>
            </div>

            {/* Streak & Badges */}
            <div className="flex items-center gap-2">
              <div className="home-streak-badge">
                <Flame size={16} fill="#f59e0b" />
                <span>{streakDays} วันต่อเนื่อง</span>
              </div>
              {badges.length > 0 && (
                <div className="flex items-center gap-1 bg-[rgba(168,85,247,0.15)] border border-[rgba(168,85,247,0.4)] px-2.5 py-1 rounded-full text-[#c084fc] font-bold text-xs">
                  <Award size={15} />
                  <span>{badges.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* EXP Bar */}
          <div className="home-exp-track">
            <div className="home-exp-fill" style={{ width: `${expProgress}%` }} />
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-[#94a3b8]">
            <span style={{ color: '#00f2fe' }}>{exp} EXP</span>
            <span>เป้าหมาย {nextLevelExp} EXP ({Math.round(expProgress)}%)</span>
          </div>
          
          <button 
            onClick={() => setIsVoiceSettingsOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#334155]/50 hover:bg-[#334155] border border-[#475569] text-slate-300 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Settings size={16} />
            ตั้งค่าเสียงพูด (Voice Settings)
          </button>
        </div>

        {/* Spotlight Card */}
        <div className="home-deck-card" style={{ '--card-accent': '#f59e0b' }}>
          <div className="home-spotlight-beacon">
            <span className="beacon-dot" />
            <span>⚡ โหมดเด่นแนะนำวันนี้ (Daily Spotlight)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">Rapid Fire POS: แยกแยะชนิดของคำ</h3>
          <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">
            ฝึกจำแนก Noun, Verb, Adj, Adv ด้วยความเร็วสูง สร้างสัญชาตญาณไวยากรณ์อัตโนมัติ พร้อม UI สุดล้ำ!
          </p>
          <button 
            className="home-spotlight-btn"
            onClick={() => navigate('/pos')}
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm">
              <Sparkles size={16} className="text-[#fbbf24]" />
              <span>เริ่มฝึกโหมดแนะนำ</span>
            </span>
            <ArrowRight size={16} />
          </button>
        </div>

      </section>

      {/* 🗂️ 4 SKILL-BASED DOMAIN SECTIONS */}
      {domains.map((domain) => (
        <section key={domain.id} className="home-domain-section">
          
          {/* Domain Section Header */}
          <div className="home-domain-header">
            <div className="home-domain-title-wrap">
              <div 
                className="home-domain-icon"
                style={{ 
                  background: `${domain.color}1a`, 
                  border: `1.5px solid ${domain.color}66`
                }}
              >
                <span>{domain.icon}</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {domain.title}
                </h2>
                <div className="text-xs font-medium text-[#94a3b8]">
                  {domain.subtitle}
                </div>
              </div>
            </div>

            <div className="home-domain-count">
              {domain.modes.length} โหมดการฝึก
            </div>
          </div>

          {/* Mode Cards Grid */}
          <div className="home-mode-grid">
            {domain.modes.map((mode) => (
              isTouchDevice ? (
                <div key={mode.id}>
                  {renderCardContent(mode)}
                </div>
              ) : (
                <Tilt
                  key={mode.id}
                  glareEnable={true}
                  glareMaxOpacity={0.12}
                  glareColor={mode.color}
                  glarePosition="all"
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  scale={1.02}
                  transitionSpeed={2000}
                >
                  {renderCardContent(mode)}
                </Tilt>
              )
            ))}
          </div>

        </section>
      ))}

      <VoiceSettings 
        isOpen={isVoiceSettingsOpen} 
        onClose={() => setIsVoiceSettingsOpen(false)} 
      />

    </div>
  );
};

export default Home;
