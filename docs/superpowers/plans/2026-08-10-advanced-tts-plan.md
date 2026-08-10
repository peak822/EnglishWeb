# Advanced Web Speech API Manager Implementation Plan

## Goal
Enhance the existing Web Speech API integration to prioritize high-quality online neural voices (e.g., Microsoft Guy/Jenny Online) and provide a user interface for users to select, test, and save their preferred voice.

## User Review Required
> [!IMPORTANT]
> The Voice Settings will be placed on the Home page (Command Deck area). Are you okay with adding a "Settings ⚙️" button there, or would you prefer it in a global navigation bar?

## Proposed Changes

### Component: Audio Service
Refactor the audio engine to expose voice selection capabilities.

#### [MODIFY] [audioService.js](file:///d:/Drive%20D/Project/English%20Study%20Web/src/utils/audioService.js)
- Add `getAvailableVoices()`: Filters and returns a curated list of high-quality English voices (prioritizing Online/Neural voices).
- Add `setPreferredVoice(voiceURI)`: Saves the user's choice to `localStorage`.
- Add `getPreferredVoice()`: Retrieves the saved choice.
- Update `getBestEnglishVoice()`: Always return the user's preferred voice first. If not set, fallback to the best available online voice.

### Component: UI & Settings
Create a new UI component for voice selection and integrate it into the Home page.

#### [NEW] [VoiceSettings.jsx](file:///d:/Drive%20D/Project/English%20Study%20Web/src/components/VoiceSettings.jsx)
- A modal component that displays a dropdown of available English voices.
- Includes a "Test Voice" button that plays a sample sentence (`"Hello, I am your new voice assistant."`).
- Saves the selected voice using `audioService.setPreferredVoice`.

#### [MODIFY] [Home.jsx](file:///d:/Drive%20D/Project/English%20Study%20Web/src/pages/Home.jsx)
- Add a "Voice Settings" button in the `home-command-deck` section.
- Manage state to open/close the `VoiceSettings` modal.

## Verification Plan
### Manual Verification
- Open the Home page and click "Voice Settings".
- Verify the dropdown populates with available voices.
- Select a voice and click "Test Voice" to ensure it plays correctly.
- Navigate to the Vocabulary or Story mode to verify the selected voice is used globally.
