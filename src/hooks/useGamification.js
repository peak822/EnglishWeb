import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2100,   // Level 7
  2800,   // Level 8
  3600,   // Level 9
  4500,   // Level 10
];

const BADGES = [
  { id: 'first_blood', name: 'First Blood', description: 'Earn your first 10 EXP', requiredExp: 10, icon: '🎯' },
  { id: 'novice', name: 'Novice Learner', description: 'Reach Level 2', requiredLevel: 2, icon: '🌱' },
  { id: 'dedicated', name: 'Dedicated', description: 'Reach Level 5', requiredLevel: 5, icon: '🔥' },
  { id: 'master', name: 'Master', description: 'Reach Level 10', requiredLevel: 10, icon: '👑' },
];

export const getRankTitle = (level) => {
  if (level <= 1) return { title: 'Code Initiate', color: '#38bdf8', icon: '⚡' };
  if (level <= 3) return { title: 'Cyber Scholar', color: '#00f2fe', icon: '🧠' };
  if (level <= 5) return { title: 'Vocab Specialist', color: '#a855f7', icon: '🔮' };
  if (level <= 7) return { title: 'Neural Elite', color: '#ec4899', icon: '💎' };
  if (level <= 9) return { title: 'Cyber Master', color: '#f59e0b', icon: '🔥' };
  return { title: 'Vocab Overlord', color: '#22c55e', icon: '👑' };
};

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const calculateStreak = (saved) => {
  const today = getTodayString();
  if (!saved || !saved.lastActiveDate) {
    return { streakDays: 1, lastActiveDate: today };
  }
  
  if (saved.lastActiveDate === today) {
    return { streakDays: saved.streakDays || 1, lastActiveDate: today };
  }

  const lastDate = new Date(saved.lastActiveDate);
  const currentDate = new Date(today);
  const diffTime = Math.abs(currentDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streakDays: (saved.streakDays || 1) + 1, lastActiveDate: today };
  } else {
    return { streakDays: 1, lastActiveDate: today };
  }
};

export const useGamification = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('english_study_profile');
    const parsed = saved ? JSON.parse(saved) : null;
    const streakInfo = calculateStreak(parsed);

    return {
      exp: parsed?.exp || 0,
      level: parsed?.level || 1,
      badges: parsed?.badges || [],
      streakDays: streakInfo.streakDays,
      lastActiveDate: streakInfo.lastActiveDate
    };
  });

  const [recentLevelUp, setRecentLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    localStorage.setItem('english_study_profile', JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('profile_updated', { detail: profile }));
  }, [profile]);

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      // Prevent infinite loop by checking if the state is actually different
      if (e.detail && (e.detail.exp !== profile.exp || e.detail.streakDays !== profile.streakDays)) {
        setProfile(e.detail);
      }
    };
    window.addEventListener('profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('profile_updated', handleProfileUpdate);
  }, [profile.exp, profile.streakDays]);

  const addExp = useCallback((amount) => {
    setProfile(prev => {
      const newExp = prev.exp + amount;
      const today = getTodayString();
      
      // Calculate level
      let newLevel = 1;
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newExp >= LEVEL_THRESHOLDS[i]) {
          newLevel = i + 1;
          break;
        }
      }
      if (newExp > LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) {
        newLevel = LEVEL_THRESHOLDS.length + Math.floor((newExp - LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) / 1000);
      }

      const leveledUp = newLevel > prev.level;
      if (leveledUp) {
        setRecentLevelUp(true);
        setTimeout(() => setRecentLevelUp(false), 3000);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#00FFFF', '#FF00FF', '#FFFFFF'],
          zIndex: 9999
        });
      }

      // Check for new badges
      let earnedBadges = [...prev.badges];
      let newlyEarned = null;
      BADGES.forEach(badge => {
        if (!earnedBadges.includes(badge.id)) {
          if (
            (badge.requiredExp && newExp >= badge.requiredExp) ||
            (badge.requiredLevel && newLevel >= badge.requiredLevel)
          ) {
            earnedBadges.push(badge.id);
            newlyEarned = badge;
          }
        }
      });

      if (newlyEarned) {
        setNewBadge(newlyEarned);
        setTimeout(() => setNewBadge(null), 4000);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#FF00FF', '#00FFFF'],
          zIndex: 9999
        });
      }

      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        badges: earnedBadges,
        lastActiveDate: today
      };
    });
  }, []);

  const getNextLevelExp = () => {
    if (profile.level < LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[profile.level];
    }
    // Beyond defined levels, add 1000 per level
    const maxDefined = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const extraLevels = profile.level - LEVEL_THRESHOLDS.length;
    return maxDefined + (extraLevels + 1) * 1000;
  };

  const getCurrentLevelBaseExp = () => {
    if (profile.level === 1) return 0;
    if (profile.level <= LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[profile.level - 1];
    }
    const maxDefined = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const extraLevels = profile.level - LEVEL_THRESHOLDS.length;
    return maxDefined + extraLevels * 1000;
  };

  const rankInfo = getRankTitle(profile.level);

  return {
    exp: profile.exp,
    level: profile.level,
    badges: profile.badges,
    streakDays: profile.streakDays || 1,
    rankTitle: rankInfo.title,
    rankColor: rankInfo.color,
    rankIcon: rankInfo.icon,
    addExp,
    recentLevelUp,
    newBadge,
    nextLevelExp: getNextLevelExp(),
    currentLevelBaseExp: getCurrentLevelBaseExp(),
    allBadges: BADGES
  };
};
