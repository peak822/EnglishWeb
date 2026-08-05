/**
 * Resilient Audio & Speech Service
 * 
 * Features:
 * 1. Garbage Collection (GC) Protection: Keeps global references so browser doesn't drop speech mid-way.
 * 2. Asynchronous Voice Loader: Detects and selects natural English voices (en-US / en-GB).
 * 3. Chrome Queue Unstuck: Auto-resumes paused synthesis and prevents cancel-speak race conditions.
 * 4. Multi-Sentence Story Chunking: Splits long stories to bypass browser ~200-char / 15s TTS limits.
 * 5. Dual-Engine Audio Fallback: Automatically falls back to HTML5 Audio if Web Speech is blocked/unavailable.
 */

// Retain active utterances to prevent V8/WebKit garbage collection
const activeUtterances = new Set();
let currentAudio = null;
let cachedVoices = [];
let isVoicesLoaded = false;
let storyPlaybackState = {
  isPlaying: false,
  sentences: [],
  currentIndex: 0,
  options: null,
};

// Initialize voice list
const loadVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length > 0) {
      cachedVoices = voices;
      isVoicesLoaded = true;
    }
    return voices;
  } catch (e) {
    console.warn('Error loading voices:', e);
    return [];
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Find the most natural English voice available
 */
export const getBestEnglishVoice = () => {
  const voices = cachedVoices.length > 0 ? cachedVoices : loadVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for preferred high-quality English voices
  const preferredNames = [
    'Google US English',
    'Microsoft Natural',
    'Microsoft Jenny Online',
    'Microsoft Guy Online',
    'Microsoft Aria Online',
    'Samantha',
    'Alex',
    'Victoria',
    'Karen',
    'Daniel'
  ];

  for (const name of preferredNames) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
    if (found) return found;
  }

  // 2. Look for any US English voice
  const usVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
  if (usVoice) return usVoice;

  // 3. Look for any English voice
  const anyEnVoice = voices.find(v => v.lang.startsWith('en'));
  if (anyEnVoice) return anyEnVoice;

  return voices[0] || null;
};

/**
 * Stop any active audio and speech synthesis
 */
export const stopSpeech = () => {
  storyPlaybackState.isPlaying = false;
  storyPlaybackState.sentences = [];
  storyPlaybackState.currentIndex = 0;
  storyPlaybackState.options = null;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch (e) {
      // ignore
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  activeUtterances.clear();
};

/**
 * Play audio via online fallback (HTML5 Audio)
 */
export const playFallbackAudio = (text, options = {}) => {
  return new Promise((resolve) => {
    if (!text || text.trim() === '') {
      resolve();
      return;
    }

    stopSpeech();

    const cleanText = text.trim();
    // Primary fallback: High quality US English pronunciation dictionary CDN
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&type=2`;
    
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    if (options.rate) {
      audio.playbackRate = options.rate;
    }

    audio.onended = () => {
      currentAudio = null;
      if (options.onEnd) options.onEnd();
      resolve();
    };

    audio.onerror = () => {
      // Secondary fallback: Google TTS
      const googleFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      const fallbackAudio = new Audio(googleFallbackUrl);
      currentAudio = fallbackAudio;
      
      fallbackAudio.onended = () => {
        currentAudio = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      fallbackAudio.onerror = (err) => {
        currentAudio = null;
        if (options.onError) options.onError(err);
        resolve(); // resolve gracefully so UI doesn't crash
      };

      fallbackAudio.play().catch(e => {
        currentAudio = null;
        if (options.onError) options.onError(e);
        resolve();
      });
    };

    audio.play().catch(err => {
      // In case autoplay is blocked or network failed
      console.warn('Fallback audio play failed:', err);
      if (options.onError) options.onError(err);
      resolve();
    });
  });
};

/**
 * Speak a single word or short text with Web Speech API and auto fallback
 */
export const speakText = (text, options = {}) => {
  if (!text || text.trim() === '') return;

  const cleanText = text.replace(/^[.,!?;:'"“”‘’()[\]{}—–\s]+|[.,!?;:'"“”‘’()[\]{}—–\s]+$/g, '').trim();
  if (!cleanText) return;

  // If force fallback requested or SpeechSynthesis is not supported
  if (options.forceFallback || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playFallbackAudio(cleanText, options);
    return;
  }

  stopSpeech();

  // Web Speech API execution with GC protection & voice selection
  setTimeout(() => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;

      const bestVoice = getBestEnglishVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // GC Protection: keep reference in Set until utterance completes
      activeUtterances.add(utterance);

      let hasFinished = false;

      const cleanup = () => {
        if (!hasFinished) {
          hasFinished = true;
          activeUtterances.delete(utterance);
        }
      };

      utterance.onend = () => {
        cleanup();
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (event) => {
        cleanup();
        // If error is not a user cancel, attempt fallback
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          console.warn('SpeechSynthesis error, falling back to audio CDN:', event.error);
          playFallbackAudio(cleanText, options);
        } else if (options.onError) {
          options.onError(event);
        }
      };

      window.speechSynthesis.speak(utterance);

      // Heartbeat resume in case browser pauses speech
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.warn('SpeechSynthesis invocation failed, falling back:', err);
      playFallbackAudio(cleanText, options);
    }
  }, 20);
};

/**
 * Split text into natural sentence chunks
 */
export const splitIntoSentences = (text) => {
  if (!text) return [];
  // Match sentence ending punctuation followed by space or newline
  const rawSentences = text.match(/[^.!?\n]+[.!?]+|[^.!?\n]+/g) || [text];
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

/**
 * Speak full story or article sequentially sentence-by-sentence
 */
export const speakStory = (fullText, options = {}) => {
  if (!fullText || fullText.trim() === '') return;

  stopSpeech();

  const sentences = splitIntoSentences(fullText);
  if (sentences.length === 0) return;

  storyPlaybackState.isPlaying = true;
  storyPlaybackState.sentences = sentences;
  storyPlaybackState.currentIndex = 0;
  storyPlaybackState.options = options;

  const playNextSentence = () => {
    if (!storyPlaybackState.isPlaying) return;

    if (storyPlaybackState.currentIndex >= storyPlaybackState.sentences.length) {
      storyPlaybackState.isPlaying = false;
      if (options.onEnd) options.onEnd();
      return;
    }

    const currentSentence = storyPlaybackState.sentences[storyPlaybackState.currentIndex];
    if (options.onSentenceStart) {
      options.onSentenceStart(currentSentence, storyPlaybackState.currentIndex, storyPlaybackState.sentences.length);
    }

    speakText(currentSentence, {
      rate: options.rate || 0.9,
      onEnd: () => {
        if (!storyPlaybackState.isPlaying) return;
        storyPlaybackState.currentIndex++;
        // Brief natural pause between sentences (150ms)
        setTimeout(playNextSentence, 150);
      },
      onError: (err) => {
        if (!storyPlaybackState.isPlaying) return;
        storyPlaybackState.currentIndex++;
        setTimeout(playNextSentence, 150);
      }
    });
  };

  playNextSentence();
};

/**
 * Check if audio or speech is currently active
 */
export const isSpeaking = () => {
  if (storyPlaybackState.isPlaying) return true;
  if (currentAudio && !currentAudio.paused) return true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
