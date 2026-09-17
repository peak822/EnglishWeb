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
  Settings,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { playCyberSound } from '../utils/cyberSound';
import HoloCard from '../components/HoloCard';
import TechBracket from '../components/TechBracket';
import VoiceSettings from '../components/VoiceSettings';

const Home = () => {
  const navigate = useNavigate();
  const { 
    exp, 
    level, 
    rankTitle, 
    rankColor, 
    rankIcon, 
    streakDays, 
    badges, 
    nextLevelExp, 
    currentLevelBaseExp 
  } = useGamification();

  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [selectedCefr, setSelectedCefr] = useState('ALL');
  const [lastProtocol, setLastProtocol] = useState({ name: 'Typing Mode', path: '/typing' });

  useEffect(() => {
    try {
      const savedProtocol = localStorage.getItem('cyber_last_protocol');
      if (savedProtocol) {
        setLastProtocol(JSON.parse(savedProtocol));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLaunchMode = (path, name) => {
    try {
      localStorage.setItem('cyber_last_protocol', JSON.stringify({ name, path }));
    } catch (e) {
      // ignore
    }
    playCyberSound('click');
    navigate(path);
  };

  const expProgress = Math.max(0, Math.min(100, ((exp - currentLevelBaseExp) / (nextLevelExp - currentLevelBaseExp)) * 100));

  const cefrLevels = [
    { id: 'ALL', label: 'All Levels', desc: '5,000 Words', color: '#00ffff' },
    { id: 'A1', label: 'A1 Cadet', desc: 'Beginner (800+)', color: '#10b981' },
    { id: 'A2', label: 'A2 Scout', desc: 'Elementary (1,000+)', color: '#38bdf8' },
    { id: 'B1', label: 'B1 Specialist', desc: 'Intermediate (1,200+)', color: '#a855f7' },
    { id: 'B2', label: 'B2 Commander', desc: 'Upper-Inter (1,100+)', color: '#f59e0b' },
    { id: 'C1', label: 'C1 Master', desc: 'Advanced (900+)', color: '#ff0055' },
  ];

  const sectors = [
    {
      id: 'sector-alpha',
      code: 'SECTOR ALPHA',
      title: 'Core Combat & Recall',
      subtitle: 'ทักษะการพิมพ์ ปริศนาตัวอักษร และการจำแนกคำศัพท์หลัก',
      color: '#00ffff',
      modes: [
        {
          id: 'typing',
          title: 'Typing Mode (Speed Hack)',
          subtitle: 'Speed Typing & Motor Memory',
          description: 'ฝึกพิมพ์คำศัพท์จากความจำตามระดับและคำแปลภาษาไทย เร่ง Speed WPM และความแม่นยำ',
          icon: <Type size={24} />,
          path: '/typing',
          expTag: '+15 EXP / WORD',
          badge: 'SPEED',
          color: '#00ffff'
        },
        {
          id: 'assemble',
          title: 'Assemble Mode (Data Puzzle)',
          subtitle: 'Letter Anagram Deconstruction',
          description: 'เรียงตัวอักษรที่สลับตำแหน่งให้กลายเป็นคำศัพท์ที่ถูกต้อง ช่วยจำตัวสะกดได้อย่างแม่นยำ',
          icon: <Puzzle size={24} />,
          path: '/assemble',
          expTag: '+20 EXP / WORD',
          badge: 'ANAGRAM',
          color: '#a855f7'
        },
        {
          id: 'guess',
          title: 'Guess Mode (Cyber Quiz)',
          subtitle: 'Hint & Clue Deduction',
          description: 'ฝึกนึกคำศัพท์จากคำใบ้ ความหมาย ชนิดของคำ และความยาวตัวอักษร พร้อมระบบคอมโบ',
          icon: <HelpCircle size={24} />,
          path: '/guess',
          expTag: '+15 EXP / WORD',
          badge: 'QUIZ',
          color: '#fbbf24'
        },
        {
          id: 'read',
          title: 'Oxford 5000 Vocab Bank',
          subtitle: 'Neural Vocabulary Vault',
          description: 'ค้นหาและเปิดดูคลังคำศัพท์ 5,000 คำหลักที่จำเป็นที่สุด พร้อมคำแปลและระดับ A1-C1',
          icon: <Compass size={24} />,
          path: '/read',
          expTag: '+5 EXP / WORD',
          badge: 'DATABASE',
          color: '#38bdf8'
        }
      ]
    },
    {
      id: 'sector-beta',
      code: 'SECTOR BETA',
      title: 'Sensory & Rapid Reflex',
      subtitle: 'ทักษะการฟัง สัญชาตญาณความไว และการจับคู่ความจำ 3D',
      color: '#ff00ff',
      modes: [
        {
          id: 'listen',
          title: 'Listening Mode (Audio Decrypt)',
          subtitle: 'Speech Synthesis Ear Drill',
          description: 'ฝึกหูให้คุ้นเคยกับสำเนียงเจ้าของภาษา ฟังเสียงอ่านคำศัพท์แล้วทายตัวสะกดและความหมาย',
          icon: <Volume2 size={24} />,
          path: '/listen',
          expTag: '+20 EXP / WORD',
          badge: 'AUDIO',
          color: '#4ade80'
        },
        {
          id: 'match',
          title: 'Match Mode (3D Memory Matrix)',
          subtitle: 'Tactile Card Pairing',
          description: 'ท้าทายความจำ! แตะเปิดการ์ด 3D เพื่อจับคู่คำศัพท์ภาษาอังกฤษกับความหมายภาษาไทยให้เร็วที่สุด',
          icon: <Grid size={24} />,
          path: '/match',
          expTag: '+30 EXP / SET',
          badge: '3D FLIP',
          color: '#00f2fe'
        },
        {
          id: 'swipe',
          title: 'Swipe Mode (Speed Reflex)',
          subtitle: 'Rapid True/False Instinct',
          description: 'ทดสอบสัญชาตญาณความไว ปัดขวาเมื่อคำแปลถูกต้อง และปัดซ้ายเมื่อผิด ทำคอมโบต่อเนื่อง!',
          icon: <Zap size={24} />,
          path: '/swipe',
          expTag: '+10 EXP / COMBO',
          badge: 'REFLEX',
          color: '#f59e0b'
        }
      ]
    },
    {
      id: 'sector-gamma',
      code: 'SECTOR GAMMA',
      title: 'Deep Linguistics & Grammar',
      subtitle: 'เจาะลึกไวยากรณ์ ชนิดของคำ และโครงสร้าง Syntax Tree',
      color: '#bc13fe',
      modes: [
        {
          id: 'pos',
          title: 'Part of Speech Trainer',
          subtitle: 'Rapid Word Anatomy Drill',
          description: 'ฝึกสัญชาตญาณจำแนกคำศัพท์ 7 ชนิด (Noun, Verb, Adj ฯลฯ) พร้อมระบบคอมโบและเสียงเอฟเฟกต์',
          icon: <Layers size={24} />,
          path: '/pos',
          expTag: '+15 EXP / WORD',
          badge: 'GRAMMAR',
          color: '#e879f9'
        },
        {
          id: 'pos-guide',
          title: 'POS Tactical Field Guide',
          subtitle: 'Interactive Grammar Blueprint',
          description: 'สรุปหน้าที่ ตำแหน่งในประโยค และข้อสังเกตของคำทั้ง 7 ชนิด เข้าใจง่ายพร้อมตัวอย่าง',
          icon: <FileText size={24} />,
          path: '/pos-guide',
          expTag: 'MANUAL',
          badge: 'GUIDE',
          color: '#38bdf8'
        },
        {
          id: 'syntax',
          title: 'Syntax Structure Mode',
          subtitle: 'Sentence Assembly Drill',
          description: 'ฝึกจัดเรียงคำศัพท์ในประโยคให้ถูกต้องตามโครงสร้างไวยากรณ์และความหมายภาษาไทย',
          icon: <Bookmark size={24} />,
          path: '/syntax',
          expTag: '+25 EXP / SENTENCE',
          badge: 'SYNTAX',
          color: '#a855f7'
        },
        {
          id: 'context',
          title: 'Context Clues (Cloze Reading)',
          subtitle: 'Semantic Fill-in Challenge',
          description: 'ฝึกวิเคราะห์บริบทของประโยคเพื่อเลือกคำศัพท์ที่ถูกต้องและเหมาะสมที่สุด',
          icon: <FileText size={24} />,
          path: '/context',
          expTag: '+20 EXP / WORD',
          badge: 'CONTEXT',
          color: '#c084fc'
        }
      ]
    },
    {
      id: 'sector-delta',
      code: 'SECTOR DELTA',
      title: 'Holo-Simulations & Stories',
      subtitle: 'อ่านบทความและเรื่องราวจำลองพร้อมระบบคลิกดูคำแปลทันที',
      color: '#10b981',
      modes: [
        {
          id: 'story-mode',
          title: 'Interactive Holo-Stories',
          subtitle: 'Contextual Scenario Reader',
          description: 'ฝึกอ่านบทความภาษาอังกฤษเพลินๆ พร้อมแตะคำศัพท์เพื่อดูความหมายและฟังเสียงได้ทันที',
          icon: <BookOpen size={24} />,
          path: '/story-mode',
          expTag: '+50 EXP / STORY',
          badge: 'AI STORY',
          color: '#10b981'
        }
      ]
    }
  ];

  return (
    <div className="cyber-hub-wrap animate-fade-up">
      
      {/* 🚀 CYBER STATUS STRIP & COCKPIT */}
      <section style={{ marginBottom: '2.5rem' }}>
        {/* Status Strip Header */}
        <div className="cyber-status-strip">
          <div className="cyber-status-live">
            <span className="status-beacon-dot" />
            <span>SYSTEM STATUS: NEURAL UPLINK ACTIVE</span>
          </div>
          <div className="cyber-status-info">
            <span>SECURE CLEARANCE: LV.{level}</span>
            <span>TERMINAL PROTOCOL v2.4</span>
          </div>
        </div>

        {/* Cockpit Panel */}
        <div className="cyber-cockpit-panel" style={{ '--card-accent': rankColor }}>
          <TechBracket color="var(--color-primary)" size={16} />

          {/* Left: Commander Profile & Rank */}
          <div className="cyber-commander-left">
            <div className="cyber-profile-row">
              <div className="cyber-avatar-box" style={{ borderColor: rankColor, color: rankColor }}>
                <span>{rankIcon}</span>
              </div>
              
              <div className="cyber-profile-meta">
                <div className="cyber-profile-name">
                  <span>Commander</span>
                  <span 
                    className="cyber-rank-chip"
                    style={{ color: rankColor, borderColor: `${rankColor}88`, backgroundColor: `${rankColor}22` }}
                  >
                    Lv.{level} • {rankTitle}
                  </span>
                </div>
                <div className="cyber-exp-subtext">
                  Neural Experience: <strong style={{ color: 'var(--color-primary)' }}>{exp}</strong> / {nextLevelExp} EXP ({Math.round(expProgress)}%)
                </div>
              </div>
            </div>

            {/* Reactor EXP Tube */}
            <div className="cyber-reactor-tube">
              <div className="cyber-reactor-fill" style={{ width: `${expProgress}%` }} />
            </div>

            {/* Status Chips */}
            <div className="cyber-chips-row">
              <div className="cyber-streak-chip">
                <Flame size={15} fill="currentColor" />
                <span>{streakDays} DAYS STREAK</span>
              </div>

              {badges.length > 0 && (
                <div className="cyber-badge-chip">
                  <Award size={15} />
                  <span>{badges.length} BADGES UNLOCKED</span>
                </div>
              )}

              <button
                onClick={() => setIsVoiceSettingsOpen(true)}
                className="cyber-voice-btn"
              >
                <Settings size={14} />
                <span>Voice Settings</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Launch & Tactical Directive */}
          <div className="cyber-directive-right">
            <div>
              <div className="cyber-directive-title">
                <Activity size={14} />
                <span>TACTICAL DIRECTIVE</span>
              </div>
              <h3 className="cyber-directive-heading">
                Resume Training Protocol
              </h3>
              <p className="cyber-directive-desc">
                Continue your previous mission in {lastProtocol.name} to maximize EXP combos.
              </p>
            </div>

            <button
              onClick={() => handleLaunchMode(lastProtocol.path, lastProtocol.name)}
              className="cyber-launch-btn group"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={15} />
                <span>LAUNCH PROTOCOL</span>
              </span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* 🎯 CEFR SECURITY CLEARANCE SELECTOR */}
      <section className="cefr-matrix-section">
        <div className="cefr-matrix-head">
          <div className="cefr-matrix-title">
            <ShieldCheck size={16} />
            <span>CEFR CLEARANCE LEVEL FILTER</span>
          </div>
          <span className="cefr-matrix-count">
            FILTER TRAINING MATRIX
          </span>
        </div>

        <div className="cefr-chips-grid">
          {cefrLevels.map((lvl) => {
            const isSelected = selectedCefr === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  playCyberSound('hover');
                  setSelectedCefr(lvl.id);
                }}
                className={`cefr-chip-btn ${isSelected ? 'active' : ''}`}
              >
                <div className="cefr-chip-top">
                  <span style={{ color: isSelected ? lvl.color : '#ffffff' }}>
                    {lvl.id}
                  </span>
                  {isSelected && <span className="status-beacon-dot" style={{ width: '6px', height: '6px' }} />}
                </div>
                <span className="cefr-chip-desc">
                  {lvl.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🗂️ 4-SECTOR TRAINING MATRIX */}
      <div>
        {sectors.map((sec) => (
          <section key={sec.id} className="cyber-sector-group">
            
            {/* Sector Header */}
            <div className="cyber-sector-head">
              <div>
                <div className="cyber-sector-code" style={{ color: sec.color }}>
                  {sec.code}
                </div>
                <h2 className="cyber-sector-title">
                  {sec.title}
                </h2>
                <div className="cyber-sector-subtitle">
                  {sec.subtitle}
                </div>
              </div>
              <div className="cyber-sector-badge">
                {sec.modes.length} PROTOCOLS
              </div>
            </div>

            {/* Mode Cards Grid */}
            <div className="cyber-sector-grid">
              {sec.modes.map((mode) => (
                <HoloCard
                  key={mode.id}
                  bracketColor={mode.color}
                  style={{ '--card-accent': mode.color }}
                  onClick={() => handleLaunchMode(mode.path, mode.title)}
                >
                  <div>
                    {/* Top Row: Icon, Badge, EXP */}
                    <div className="holo-card-top">
                      <div 
                        className="holo-icon-box"
                        style={{ 
                          backgroundColor: `${mode.color}18`, 
                          borderColor: `${mode.color}66`,
                          borderWidth: '1.5px',
                          borderStyle: 'solid',
                          color: mode.color,
                          boxShadow: `0 0 12px ${mode.color}33`
                        }}
                      >
                        {mode.icon}
                      </div>

                      <div className="holo-badges-wrap">
                        <span 
                          className="holo-tag-badge"
                          style={{ 
                            backgroundColor: `${mode.color}15`, 
                            borderColor: `${mode.color}44`,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: mode.color 
                          }}
                        >
                          {mode.badge}
                        </span>
                        <span className="holo-exp-pill">
                          {mode.expTag}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <h3 className="holo-card-title">
                      {mode.title}
                    </h3>
                    <div className="holo-card-subtitle" style={{ color: mode.color }}>
                      {mode.subtitle}
                    </div>
                    <p className="holo-card-desc">
                      {mode.description}
                    </p>
                  </div>

                  {/* Launch Bar */}
                  <div 
                    className="holo-card-action"
                    style={{ color: mode.color }}
                  >
                    <span>ENGAGE PROTOCOL</span>
                    <ArrowRight size={16} className="holo-card-action-arrow" />
                  </div>
                </HoloCard>
              ))}
            </div>

          </section>
        ))}
      </div>

      <VoiceSettings 
        isOpen={isVoiceSettingsOpen} 
        onClose={() => setIsVoiceSettingsOpen(false)} 
      />

    </div>
  );
};

export default Home;
