/**
 * Sintetizador de Audio Local via Web Audio API
 * Gera efeitos leves de acerto, erro, tique-taque e conclusao sem arquivos externos.
 */
(function (global) {
  'use strict';

  let ctx = null;
  let enabled = true;

  function ensureContext() {
    if (!enabled) return null;
    if (!ctx) {
      const AudioCtx = global.AudioContext || global.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type, startOffset, volume) {
    const audio = ensureContext();
    if (!audio) return;
    const now = audio.currentTime + (startOffset || 0);
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume || 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  const SoundFX = {
    isEnabled() {
      return enabled;
    },
    setEnabled(val) {
      enabled = Boolean(val);
    },
    toggle() {
      enabled = !enabled;
      return enabled;
    },
    correct() {
      playTone(523.25, 0.12, 'triangle', 0, 0.08);
      playTone(659.25, 0.14, 'triangle', 0.08, 0.09);
      playTone(783.99, 0.22, 'triangle', 0.16, 0.09);
    },
    wrong() {
      playTone(240, 0.14, 'sawtooth', 0, 0.05);
      playTone(190, 0.22, 'sawtooth', 0.11, 0.05);
    },
    tick() {
      playTone(880, 0.04, 'sine', 0, 0.03);
    },
    click() {
      playTone(440, 0.04, 'sine', 0, 0.03);
    },
    victory() {
      playTone(523.25, 0.14, 'triangle', 0, 0.08);
      playTone(659.25, 0.14, 'triangle', 0.11, 0.08);
      playTone(783.99, 0.14, 'triangle', 0.22, 0.08);
      playTone(1046.5, 0.35, 'triangle', 0.33, 0.1);
    }
  };

  global.SoundFX = SoundFX;
})(window);
