/**
 * Audio synthesis using Web Audio API for sound effects
 * and Web Speech API for English pronunciation
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  playSuccess: (muted = false) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // Happy chime triad (C5, E5, G5, C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  },

  playError: (muted = false) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // Gentle, friendly 'uh-oh' two-tone (low gentle sine wave, not harsh)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.25);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Audio fallback
    }
  },

  playClick: (muted = false) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  },

  playStar: (muted = false) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const freqs = [880, 1174.66, 1318.51, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } catch {
      // Audio fallback
    }
  },

  playFanfare: (muted = false) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      // Fanfare sequence
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
      const times = [0, 0.12, 0.24, 0.36, 0.52, 0.72];
      const durations = [0.1, 0.1, 0.1, 0.14, 0.18, 0.6];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + times[i]);
        
        gain.gain.setValueAtTime(0.18, now + times[i]);
        gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + durations[i]);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + times[i]);
        osc.stop(now + times[i] + durations[i] + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }
};

/**
 * Speech synthesis with preferred British / US English voices
 */
export function speakEnglish(text: string, rate = 0.85, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = rate; // Slightly slower for primary school kids
  utterance.pitch = 1.05; // Friendly, warm pitch

  const voices = window.speechSynthesis.getVoices();
  // Look for friendly English voices
  const preferredVoice = voices.find(
    v => (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
         (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Fiona'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}
