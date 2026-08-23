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
  Terminal,
  Activity,
  ShieldCheck,
  CheckCircle2
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
          icon: <Type size={26} />,
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
          icon: <Puzzle size={26} />,
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
          icon: <HelpCircle size={26} />,
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
          icon: <Compass size={26} />,
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
          icon: <Volume2 size={26} />,
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
          icon: <Grid size={26} />,
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
          icon: <Zap size={26} />,
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
          icon: <Layers size={26} />,
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
          icon: <FileText size={26} />,
          path: '/pos-guide',
          expTag: 'MANUAL',
          badge: 'GUIDE',
          color: '#38bdf8'
        },
        {
          id: 'syntax',
          title: 'Syntax Tree Mode',
          subtitle: 'Sentence Blueprint Builder',
          description: 'ทำความเข้าใจ Subject, Verb, Object, Prepositional Phrase ด้วยแถบสีและไฮไลต์',
          icon: <Bookmark size={26} />,
          path: '/syntax',
          expTag: '+25 EXP / TREE',
          badge: 'SYNTAX',
          color: '#a855f7'
        },
        {
          id: 'context',
          title: 'Context Clues (Cloze Reading)',
          subtitle: 'Semantic Fill-in Challenge',
          description: 'ฝึกวิเคราะห์บริบทของประโยคเพื่อเลือกคำศัพท์ที่ถูกต้องและเหมาะสมที่สุด',
          icon: <FileText size={26} />,
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
          icon: <BookOpen size={26} />,
          path: '/story-mode',
          expTag: '+50 EXP / STORY',
          badge: 'AI STORY',
          color: '#10b981'
        }
      ]
    }
  ];

  return (
    <div className="container animate-fade-up px-4 py-4 sm:py-6 pb-20 max-w-6xl mx-auto">
      
      {/* 🚀 CYBER STATUS BANNER & COMMAND DECK */}
      <section className="mb-6">
        {/* System Terminal Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-t-lg bg-[rgba(0,255,255,0.05)] border-t border-x border-[rgba(0,255,255,0.25)] font-mono text-[0.7rem] sm:text-xs">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
            <span className="font-bold tracking-widest">SYSTEM STATUS: NEURAL UPLINK ACTIVE</span>
          </div>
          <div className="flex items-center gap-3 text-[rgba(255,255,255,0.6)]">
            <span>SECURE CLEARANCE: LV.{level}</span>
            <span className="hidden sm:inline">TERMINAL PROTOCOL v2.4</span>
          </div>
        </div>

        {/* Cockpit Card */}
        <div className="relative p-4 sm:p-6 bg-[rgba(10,15,30,0.9)] border border-[rgba(0,255,255,0.3)] rounded-b-xl shadow-[0_0_30px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(0,255,255,0.05)] backdrop-blur-md">
          <TechBracket color="var(--color-primary)" size={16} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Commander Profile & Rank */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl bg-[rgba(0,0,0,0.5)] border-2 shadow-[0_0_20px] transition-transform hover:scale-105"
                  style={{ borderColor: rankColor, boxShadow: `0 0 15px ${rankColor}66` }}
                >
                  {rankIcon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-white">
                      Commander
                    </h1>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border"
                      style={{ color: rankColor, borderColor: `${rankColor}88`, backgroundColor: `${rankColor}22` }}
                    >
                      Lv.{level} • {rankTitle}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[rgba(255,255,255,0.6)] mt-1">
                    Neural Experience: <span className="text-[var(--color-primary)] font-bold">{exp}</span> / {nextLevelExp} EXP ({Math.round(expProgress)}%)
                  </div>
                </div>
              </div>

              {/* Reactor EXP Tube */}
              <div>
                <div className="h-3 w-full rounded-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,255,255,0.2)] p-0.5 relative overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-neutral)] to-[var(--color-tertiary)] shadow-[0_0_12px_var(--color-primary)] transition-all duration-500 ease-out"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.4)] text-[#fbbf24] text-xs font-mono font-bold">
                  <Flame size={15} fill="currentColor" />
                  <span>{streakDays} DAYS STREAK</span>
                </div>

                {badges.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[rgba(188,19,254,0.15)] border border-[rgba(188,19,254,0.4)] text-[#e879f9] text-xs font-mono font-bold">
                    <Award size={15} />
                    <span>{badges.length} BADGES UNLOCKED</span>
                  </div>
                )}

                <button
                  onClick={() => setIsVoiceSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.8)] text-xs font-mono transition-all ml-auto"
                >
                  <Settings size={14} />
                  <span>Voice Settings</span>
                </button>
              </div>
            </div>

            {/* Right: Quick Resume & Daily Directive */}
            <div className="flex flex-col justify-between gap-3 p-4 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(0,255,255,0.15)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider mb-2 font-bold">
                  <Activity size={14} />
                  <span>TACTICAL DIRECTIVE</span>
                </div>
                <h2 className="text-sm font-bold text-white mb-1">
                  Resume Training Protocol
                </h2>
                <p className="text-xs text-[rgba(255,255,255,0.6)] font-mono leading-relaxed">
                  Continue your previous mission in {lastProtocol.name} to maximize EXP combos.
                </p>
              </div>

              <button
                onClick={() => handleLaunchMode(lastProtocol.path, lastProtocol.name)}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-lg bg-[var(--color-primary)] hover:bg-[rgba(0,255,255,0.85)] text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>LAUNCH PROTOCOL</span>
                </span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 🎯 CEFR SECURITY CLEARANCE SELECTOR */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] font-bold tracking-wider uppercase">
            <ShieldCheck size={16} />
            <span>CEFR CLEARANCE LEVEL FILTER</span>
          </div>
          <span className="text-[0.7rem] font-mono text-[rgba(255,255,255,0.5)]">
            FILTER TRAINING MATRIX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {cefrLevels.map((lvl) => {
            const isSelected = selectedCefr === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  playCyberSound('hover');
                  setSelectedCefr(lvl.id);
                }}
                className={`flex flex-col p-2.5 rounded-lg border text-left font-mono transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-[rgba(0,255,255,0.15)] border-[var(--color-primary)] shadow-[0_0_15px_rgba(0,255,255,0.3)] scale-[1.02]'
                    : 'bg-[rgba(10,15,30,0.6)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,255,0.3)] text-[rgba(255,255,255,0.7)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: isSelected ? lvl.color : '#ffffff' }}>
                    {lvl.id}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />}
                </div>
                <span className="text-[0.65rem] text-[rgba(255,255,255,0.5)] truncate">
                  {lvl.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🗂️ 4-SECTOR TRAINING MATRIX */}
      <div className="space-y-8">
        {sectors.map((sec) => (
          <section key={sec.id} className="space-y-3">
            
            {/* Sector Header */}
            <div className="flex flex-wrap items-end justify-between gap-2 pb-2 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <div className="text-[0.65rem] font-mono font-bold tracking-widest uppercase" style={{ color: sec.color }}>
                  {sec.code}
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-wide">
                  {sec.title}
                </h2>
                <div className="text-xs font-mono text-[rgba(255,255,255,0.6)]">
                  {sec.subtitle}
                </div>
              </div>
              <div className="text-[0.7rem] font-mono px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)]">
                {sec.modes.length} PROTOCOLS
              </div>
            </div>

            {/* Mode Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {sec.modes.map((mode) => (
                <HoloCard
                  key={mode.id}
                  bracketColor={mode.color}
                  onClick={() => handleLaunchMode(mode.path, mode.title)}
                  className="bg-[rgba(10,15,30,0.85)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,255,255,0.4)] p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                  <div>
                    {/* Top Row: Icon, Badge, EXP */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_0_12px]"
                        style={{ 
                          backgroundColor: `${mode.color}15`, 
                          borderColor: `${mode.color}66`,
                          borderWidth: '1.5px',
                          color: mode.color,
                          boxShadow: `0 0 10px ${mode.color}33`
                        }}
                      >
                        {mode.icon}
                      </div>

                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold tracking-wider uppercase border"
                          style={{ 
                            backgroundColor: `${mode.color}15`, 
                            borderColor: `${mode.color}44`,
                            color: mode.color 
                          }}
                        >
                          {mode.badge}
                        </span>
                        <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.8)]">
                          {mode.expTag}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <h3 className="text-base sm:text-lg font-bold font-sans text-white group-hover:text-[var(--color-primary)] transition-colors">
                      {mode.title}
                    </h3>
                    <div className="text-xs font-mono font-semibold mb-2" style={{ color: mode.color }}>
                      {mode.subtitle}
                    </div>
                    <p className="text-xs text-[rgba(255,255,255,0.65)] font-mono leading-relaxed">
                      {mode.description}
                    </p>
                  </div>

                  {/* Launch Bar */}
                  <div 
                    className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)] text-xs font-mono font-bold tracking-wider"
                    style={{ color: mode.color }}
                  >
                    <span>ENGAGE PROTOCOL</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
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
