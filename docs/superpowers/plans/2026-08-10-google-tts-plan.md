# Google TTS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Web Speech API and Youdao API with a 100% free Google Translate TTS integration supporting both short vocabulary and long stories via a text chunking queue.

**Architecture:** We will heavily refactor `src/utils/audioService.js`. The complex `SpeechSynthesis` logic will be replaced with a simplified `Audio` queue system. We will create a robust chunking algorithm that splits long text at punctuation boundaries and ensures no chunk exceeds 200 characters, avoiding Google TTS limits. 

**Tech Stack:** JavaScript (ES6+), HTML5 Audio API.

## Global Constraints
- Must be 100% free. No API keys or paid services.
- Must handle both short and long text without truncation.
- Code should be clean and independent of `window.speechSynthesis`.

---

### Task 1: Create Text Chunking Utility

**Files:**
- Create: `tools/testAudioChunker.js` (for unit testing)
- Modify: `src/utils/audioService.js` (replacing existing `splitIntoSentences`)

**Interfaces:**
- Consumes: Raw text string.
- Produces: `chunkTextForGoogleTTS(text)` returning an array of string chunks (each <= 200 chars).

- [ ] **Step 1: Write a testing script for the chunker**

```javascript
// tools/testAudioChunker.js
import { chunkTextForGoogleTTS } from '../src/utils/audioService.js';

const longText = "This is a very long text. It has multiple sentences! Some sentences are extremely long and might need to be split by words if they somehow exceed the two hundred character limit set by the Google TTS engine. But usually, punctuation is enough.";

const chunks = chunkTextForGoogleTTS(longText);
let allPass = true;
chunks.forEach((chunk, index) => {
    if (chunk.length > 200) {
        console.error(`FAIL: Chunk ${index} exceeds 200 characters: ${chunk.length}`);
        allPass = false;
    }
});
if (chunks.join(' ') !== longText.replace(/\s+/g, ' ').trim()) {
    console.error("FAIL: Content mismatch after chunking.");
    allPass = false;
}

if (allPass) console.log("PASS: Chunker works correctly.");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tools/testAudioChunker.js` (Note: You may need to run this via a simple require/ESM setup or just run it natively if Node version supports it, but it should fail since `chunkTextForGoogleTTS` doesn't exist).

- [ ] **Step 3: Write minimal implementation in `audioService.js`**

Replace `splitIntoSentences` in `src/utils/audioService.js` with:

```javascript
/**
 * Split text into chunks <= 200 characters for Google TTS
 */
export const chunkTextForGoogleTTS = (text) => {
  if (!text) return [];
  const maxLen = 200;
  
  // Clean text
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return [clean];

  const chunks = [];
  // Match sentences ending with . ! ? or ; :
  const sentences = clean.match(/[^.!?;:]+[.!?;:]+|[^.!?;:]+/g) || [clean];

  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (!sentence) continue;

    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      // Split by words if a single sentence is too long
      const words = sentence.split(' ');
      let currentChunk = '';
      for (const word of words) {
        if ((currentChunk + ' ' + word).trim().length <= maxLen) {
          currentChunk = (currentChunk + ' ' + word).trim();
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = word;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    }
  }
  return chunks;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tools/testAudioChunker.js` (If using package.json type="module", it should run. If not, temporarily rename to .mjs or adjust syntax to verify).
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/audioService.js tools/testAudioChunker.js
git commit -m "feat: add chunkTextForGoogleTTS utility"
```

### Task 2: Implement Google TTS Queue System

**Files:**
- Modify: `src/utils/audioService.js`

**Interfaces:**
- Consumes: `chunkTextForGoogleTTS`
- Produces: `speakText(text, options)`, `speakStory(fullText, options)`, `stopSpeech()`, `isSpeaking()`

- [ ] **Step 1: Replace global state in `audioService.js`**

Remove `activeUtterances`, `cachedVoices`, `keepAliveTimer`, `loadVoices`, `getBestEnglishVoice`.
Define new state variables:

```javascript
let currentAudio = null;
let currentStorySessionId = 0;
let storyPlaybackState = {
  isPlaying: false,
  sessionId: 0,
  chunks: [],
  currentIndex: 0,
  options: null,
};
```

- [ ] **Step 2: Update `stopSpeech` and `isSpeaking`**

```javascript
export const stopSpeech = () => {
  currentStorySessionId++;
  storyPlaybackState.isPlaying = false;
  storyPlaybackState.sessionId = currentStorySessionId;
  storyPlaybackState.chunks = [];
  storyPlaybackState.currentIndex = 0;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch (e) {}
  }
};

export const isSpeaking = () => {
  return storyPlaybackState.isPlaying || (currentAudio && !currentAudio.paused);
};
```

- [ ] **Step 3: Implement `speakText` for single chunks**

```javascript
export const speakText = (text, options = {}) => {
  if (!text || text.trim() === '') return;
  const cleanText = text.trim();

  if (!options.isStoryPart) {
    stopSpeech();
  }

  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
  
  const audio = new Audio(audioUrl);
  currentAudio = audio;
  if (options.rate) audio.playbackRate = options.rate;

  audio.onended = () => {
    currentAudio = null;
    if (options.onEnd) options.onEnd();
  };

  audio.onerror = (err) => {
    console.warn('Google TTS audio play failed:', err);
    currentAudio = null;
    if (options.onError) options.onError(err);
  };

  audio.play().catch(err => {
    console.warn('Google TTS Audio blocked or failed:', err);
    currentAudio = null;
    if (options.onError) options.onError(err);
  });
};
```

- [ ] **Step 4: Implement `speakStory` queue**

```javascript
export const speakStory = (fullText, options = {}) => {
  if (!fullText || fullText.trim() === '') return;
  stopSpeech();

  const chunks = chunkTextForGoogleTTS(fullText);
  if (chunks.length === 0) return;

  const thisSessionId = currentStorySessionId;
  storyPlaybackState.isPlaying = true;
  storyPlaybackState.sessionId = thisSessionId;
  storyPlaybackState.chunks = chunks;
  storyPlaybackState.currentIndex = 0;
  storyPlaybackState.options = options;

  const playNextChunk = () => {
    if (!storyPlaybackState.isPlaying || storyPlaybackState.sessionId !== thisSessionId) {
      return;
    }

    if (storyPlaybackState.currentIndex >= storyPlaybackState.chunks.length) {
      storyPlaybackState.isPlaying = false;
      if (options.onEnd) options.onEnd();
      return;
    }

    const currentChunk = storyPlaybackState.chunks[storyPlaybackState.currentIndex];
    
    // Optional callback for UI updates
    if (options.onSentenceStart) {
      options.onSentenceStart(currentChunk, storyPlaybackState.currentIndex, storyPlaybackState.chunks.length);
    }

    speakText(currentChunk, {
      isStoryPart: true,
      rate: options.rate || 1.0,
      onEnd: () => {
        if (!storyPlaybackState.isPlaying || storyPlaybackState.sessionId !== thisSessionId) return;
        storyPlaybackState.currentIndex++;
        // Play next chunk immediately without extra delay to maintain natural flow
        playNextChunk();
      },
      onError: (err) => {
        if (!storyPlaybackState.isPlaying || storyPlaybackState.sessionId !== thisSessionId) return;
        storyPlaybackState.currentIndex++;
        playNextChunk();
      }
    });
  };

  playNextChunk();
};
```

- [ ] **Step 5: Verify build & Commit**
Run `npm run build` or start dev server to verify no syntax errors.
```bash
git add src/utils/audioService.js
git commit -m "feat: implement Google TTS queue for speakText and speakStory"
```

### Task 3: UI Verification (Manual)

- [ ] **Step 1: Open Development Server**
Run `npm run dev` in the terminal.

- [ ] **Step 2: Test short word pronunciation**
Navigate to `POSMode` or vocabulary lists. Click the audio button next to a word. Verify that the Google Translate TTS voice is played immediately.

- [ ] **Step 3: Test long story playback**
Navigate to `StoryReader`. Click the "Play full story" button. Verify that the story plays continuously.

- [ ] **Step 4: Test stop functionality**
While a story is playing, click "Stop Audio". Verify playback halts immediately and does not resume.
