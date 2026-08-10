import React, { useState, useEffect } from 'react';
import { Settings, Volume2, X, Check } from 'lucide-react';
import { getAvailableVoices, getPreferredVoice, setPreferredVoice, getBestEnglishVoice, getPreferredSpeed, setPreferredSpeed } from '../utils/audioService';
import './VoiceSettings.css';

const VoiceSettings = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState(0.85);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const load = () => {
        const available = getAvailableVoices();
        setVoices(available);
        
        const preferred = getPreferredVoice();
        if (preferred) {
          setSelectedVoiceUri(preferred);
        } else {
          const best = getBestEnglishVoice();
          if (best) setSelectedVoiceUri(best.voiceURI);
        }
        
        setSelectedSpeed(getPreferredSpeed());
      };

      load();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance("Hello! I am your new voice assistant. How do I sound?");
    const voice = voices.find(v => v.voiceURI === selectedVoiceUri);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = selectedSpeed;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setPreferredVoice(selectedVoiceUri);
    setPreferredSpeed(selectedSpeed);
    onClose();
  };

  const onlineVoices = voices.filter(v => v.name.includes('Online') || v.name.includes('Natural') || v.name.includes('Google'));
  const otherVoices = voices.filter(v => !onlineVoices.includes(v));

  return (
    <div className="voice-settings-overlay">
      <div className="voice-settings-modal">
        
        {/* Header */}
        <div className="voice-settings-header">
          <div className="voice-settings-title">
            <Settings size={20} color="#00ffff" />
            <span>ตั้งค่าเสียงพูด (Voice Settings)</span>
          </div>
          <button onClick={onClose} className="voice-settings-close" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="voice-settings-body">
          <p className="voice-settings-info">
            ระบบจะพยายามค้นหาเสียง <strong>Online Neural Voices</strong> ที่มีความเป็นธรรมชาติสูงบนเครื่องของคุณ
          </p>

          <div className="voice-select-wrapper">
            <label className="voice-select-label">เลือกเสียง (Select Voice)</label>
            <select
              value={selectedVoiceUri}
              onChange={(e) => setSelectedVoiceUri(e.target.value)}
              className="voice-select-input"
            >
              {onlineVoices.length > 0 && (
                <optgroup label="🌟 Premium Online Voices">
                  {onlineVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {otherVoices.length > 0 && (
                <optgroup label="Standard Voices">
                  {otherVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
                    </option>
                  ))}
                </optgroup>
              )}
              
              {voices.length === 0 && (
                <option disabled>ไม่พบเสียงในระบบ (Loading...)</option>
              )}
            </select>
          </div>

          <div className="voice-select-wrapper" style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="voice-select-label">ความเร็วเสียง (Voice Speed)</label>
              <span style={{ color: '#00ffff', fontSize: '0.85rem', fontWeight: 'bold' }}>{selectedSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.05" 
              value={selectedSpeed}
              onChange={(e) => setSelectedSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#00ffff', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
              <span>ช้า (Slow)</span>
              <span>ปกติ (Normal)</span>
              <span>เร็ว (Fast)</span>
            </div>
          </div>

          <button
            onClick={handleTestVoice}
            disabled={isPlaying || voices.length === 0}
            className={`voice-test-btn ${isPlaying ? 'playing' : ''}`}
          >
            <Volume2 size={18} className={isPlaying ? 'voice-test-icon' : ''} />
            {isPlaying ? 'กำลังเล่นเสียง...' : 'ทดสอบฟังเสียง (Test Voice)'}
          </button>
        </div>

        {/* Footer */}
        <div className="voice-settings-footer">
          <button onClick={onClose} className="voice-btn-cancel">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="voice-btn-save">
            <Check size={16} />
            บันทึก
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceSettings;
