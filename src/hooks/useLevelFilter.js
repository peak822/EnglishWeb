import { useSearchParams } from 'react-router-dom';
import { readLevelFilter, CEFR_LEVELS } from '../utils/levelSelection.js';

export const useLevelFilter = () => {
  const [params, setParams] = useSearchParams();
  const level = readLevelFilter(params.toString());

  const setLevel = value => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('level');
      next.delete('theme');
      if (CEFR_LEVELS.includes(value)) next.set('level', value);
      else if (value.startsWith('theme_')) next.set('theme', value);
      return next;
    });
  };

  return [level, setLevel];
};
