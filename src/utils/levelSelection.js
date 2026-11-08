import { THEMES } from '../hooks/useCategories.js';

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const readCefr = (search, allowedLevels = CEFR_LEVELS) => {
  const value = new URLSearchParams(search).get('level');
  return value && CEFR_LEVELS.includes(value) && allowedLevels.includes(value) ? value : 'all';
};

export const readLevelFilter = search => {
  const params = new URLSearchParams(search);
  const theme = params.get('theme');
  if (THEMES.some(item => item.id === theme)) return theme;
  return readCefr(search);
};

export const withCefr = (path, level) => {
  if (!CEFR_LEVELS.includes(level)) return path;
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  params.set('level', level);
  params.delete('theme');
  return `${pathname}?${params}`;
};

export const hasContent = (level, counts) => level === 'all' || (counts[level] ?? 0) > 0;
