import React, { useState, useEffect } from 'react';
import { Settings, Volume2, X, Check } from 'lucide-react';
import { getAvailableVoices, getPreferredVoice, setPreferredVoice, getBestEnglishVoice } from '../utils/audioService';

const VoiceSettings = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load voices
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
      };

      load();
      // Handle late voice loading
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Stop current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance("Hello! I am your new voice assistant. How do I sound?");
    const voice = voices.find(v => v.voiceURI === selectedVoiceUri);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = 'en-US';
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setPreferredVoice(selectedVoiceUri);
    onClose();
  };

  // Group voices by Natural/Standard for better UI
  const onlineVoices = voices.filter(v => v.name.includes('Online') || v.name.includes('Natural') || v.name.includes('Google'));
  const otherVoices = voices.filter(v => !onlineVoices.includes(v));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-2 text-white font-bold">
            <Settings size={20} className="text-[#38bdf8]" />
            <h2>ตั้งค่าเสียงคนพูด (Voice Settings)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            ระบบจะพยายามค้นหาเสียง <strong>Online Neural Voices</strong> ที่มีความเป็นธรรมชาติสูงบนเครื่องของคุณ 
            (เช่น Microsoft Guy หรือ Google US)
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              เลือกเสียง (Select Voice)
            </label>
            <select
              value={selectedVoiceUri}
              onChange={(e) => setSelectedVoiceUri(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-3 outline-none focus:border-[#38bdf8] transition-colors"
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

          <div className="pt-2">
            <button
              onClick={handleTestVoice}
              disabled={isPlaying || voices.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#334155] hover:bg-[#475569] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              <Volume2 size={18} className={isPlaying ? "text-[#38bdf8] animate-pulse" : ""} />
              {isPlaying ? 'กำลังเล่นเสียง...' : 'ทดสอบฟังเสียง (Test Voice)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334155] bg-[#0f172a] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg shadow-lg shadow-[#0ea5e9]/20 transition-all active:scale-95"
          >
            <Check size={16} />
            บันทึก
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceSettings;
