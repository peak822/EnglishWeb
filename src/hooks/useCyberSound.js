import { useState, useCallback } from 'react';
import { playCyberSound, isAudioMuted, toggleAudioMute, setAudioMuted } from '../utils/cyberSound';

export const useCyberSound = () => {
  const [isMuted, setIsMuted] = useState(isAudioMuted());

  const toggle = useCallback(() => {
    const nextState = toggleAudioMute();
    setIsMuted(nextState);
    if (!nextState) {
      playCyberSound('click');
    }
    return nextState;
  }, []);

  const play = useCallback((type, options) => {
    playCyberSound(type, options);
  }, []);

  return {
    isMuted,
    toggleMute: toggle,
    setMuted: (val) => {
      setAudioMuted(val);
      setIsMuted(val);
    },
    playSound: play,
  };
};

export default useCyberSound;
