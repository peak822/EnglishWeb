const isValidDay = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const createDefaultProfile = (today) => ({
  exp: 0,
  level: 1,
  badges: [],
  streakDays: 1,
  lastActiveDate: today,
});

export const parseStoredProfile = (raw, today) => {
  const fallback = createDefaultProfile(today);
  if (raw == null) return { profile: fallback, invalidRaw: null };

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { profile: fallback, invalidRaw: raw };
    }

    const profile = { ...fallback, ...parsed };
    const valid = typeof profile.exp === 'number' && Number.isFinite(profile.exp) && profile.exp >= 0 &&
      Number.isInteger(profile.level) && profile.level >= 1 &&
      Array.isArray(profile.badges) && profile.badges.every(badge => typeof badge === 'string') &&
      Number.isInteger(profile.streakDays) && profile.streakDays >= 1 &&
      isValidDay(profile.lastActiveDate);
    return valid
      ? { profile: {
        exp: profile.exp,
        level: profile.level,
        badges: profile.badges,
        streakDays: profile.streakDays,
        lastActiveDate: profile.lastActiveDate,
      }, invalidRaw: null }
      : { profile: fallback, invalidRaw: raw };
  } catch {
    return { profile: fallback, invalidRaw: raw };
  }
};

const calendarDay = (value) => isValidDay(value)
  ? Date.parse(`${value}T00:00:00Z`) / 86_400_000
  : null;

const dayDifference = (today, previous) => {
  const currentDay = calendarDay(today);
  const previousDay = calendarDay(previous);
  return currentDay === null || previousDay === null ? null : currentDay - previousDay;
};

export const currentStreak = (profile, today) => {
  const difference = dayDifference(today, profile.lastActiveDate);
  return difference === 0 || difference === 1 ? profile.streakDays : 1;
};

export const advanceStreak = (profile, today) => {
  const difference = dayDifference(today, profile.lastActiveDate);
  return {
    ...profile,
    streakDays: difference === 0 ? profile.streakDays : difference === 1 ? profile.streakDays + 1 : 1,
    lastActiveDate: today,
  };
};

export const levelForExp = (exp) => {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
  if (exp >= 5500) return 10 + Math.floor((exp - 4500) / 1000);
  for (let index = thresholds.length - 1; index >= 0; index--) {
    if (exp >= thresholds[index]) return index + 1;
  }
  return 1;
};

export const awardExp = (profile, amount, today, badgeRules = []) => {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 ||
    !Number.isFinite(profile.exp + amount)) {
    return { profile, leveledUp: false, newBadge: null };
  }

  const exp = profile.exp + amount;
  const level = levelForExp(exp);
  const badges = [...profile.badges];
  let newBadge = null;
  for (const badge of badgeRules) {
    if (badges.includes(badge.id)) continue;
    if ((badge.requiredExp && exp >= badge.requiredExp) ||
      (badge.requiredLevel && level >= badge.requiredLevel)) {
      badges.push(badge.id);
      newBadge = badge;
    }
  }

  return {
    profile: { ...advanceStreak(profile, today), exp, level, badges },
    leveledUp: level > profile.level,
    newBadge,
  };
};
