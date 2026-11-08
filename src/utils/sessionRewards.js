export const calculateReward = ({ mode, nextStreak, hintLevel = 0, revealed = false }) => {
  if (mode === 'typing') return revealed ? 0 : nextStreak >= 3 ? 15 : 10;
  if (mode === 'guess') {
    if (hintLevel >= 2) return 2;
    if (hintLevel === 1) return 5;
    return nextStreak >= 3 ? 15 : 10;
  }
  throw new Error(`Unknown reward mode: ${mode}`);
};
