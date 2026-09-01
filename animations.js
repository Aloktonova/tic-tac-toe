/**
 * =============================================================================
 * TIC-TAC-TOE ADVANCED ANIMATION & SOUND ENGINE
 * For: https://github.com/Aloktonova/tic-tac-toe/
 * Theme: Dark Purple Telegram Mini App
 * =============================================================================
 * 
 * This file contains:
 *  - SoundEngine: Procedural SFX + Background Ambient Melody
 *  - ParticleSystem: Canvas 2D particles (dust, confetti, ambient, win-line)
 *  - AnimationController: CSS-driven board animations & transitions
 *  - SettingsManager: Sound toggle + volume control UI
 *  - BackgroundMusic: Generative ambient melody engine
 * 
 * INSTRUCTIONS FOR COPILOT:
 * 1. Save this file as `animations.js` in your repo root (same level as script.js)
 * 2. Add `<script src="animations.js"></script>` in index.html AFTER script.js
 *    OR add the contents to the bottom of script.js
 * 3. Add the CSS from the integration guide to style.css
 * 4. Hook the init call into your existing DOMContentLoaded
 * =============================================================================
 */

(() => {
/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 1: SOUND ENGINE — Procedural SFX (Web Audio API, Zero External Files)  */
/* ═══════════════════════════════════════════════════════════════════════════ */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.masterGain = null;
    this.sfxGain = null;      // SFX channel
    this.musicGain = null;    // Music channel
    this.volume = 0.5;        // 0.0 - 1.0
    this.musicVolume = 0.3;   // Background music volume (separate)
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.reverb = null;
  }

  init() {
    if (this.initialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master gain (overall volume)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);

    // SFX channel
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 1.0;
    this.sfxGain.connect(this.masterGain);

    // Music channel (quieter by default)
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.masterGain);

    // Simple reverb for music
    this.reverb = this.createReverb();
    this.reverb.connect(this.musicGain);

    this.initialized = true;
  }

  createReverb() {
    const convolver = this.ctx.createConvolver();
    const rate = this.ctx.sampleRate;
    const length = rate * 1.5; // 1.5 seconds
    const impulse = this.ctx.createBuffer(2, length, rate);

    for (let ch = 0; ch < 2; ch++) {
      const channel = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channel[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }

  ensureRunning() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.1);
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    if (this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(enabled ? 1 : 0, this.ctx.currentTime, 0.05);
    }
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime, 0.3);
    }
  }

  // ── CLICK: Short crisp tick ──
  playClick() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // ── HOVER: Subtle shimmer ──
  playHover() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3200, t);
    osc.frequency.exponentialRampToValueAtTime(3800, t + 0.03);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // ── INVALID: Low buzz ──
  playInvalid() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.15);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // ── WIN: Triumphant arpeggio ──
  playWin() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const baseTime = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const t = baseTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // ── DRAW: Neutral two-tone ──
  playDraw() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    [440, 330].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.15;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // ── MATCH START: Ascending sparkle ──
  playMatchStart() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const notes = [880, 1100, 1320, 1760];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  // ── COIN: High ding ──
  playCoin() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, t);
    osc.frequency.exponentialRampToValueAtTime(4000, t + 0.1);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // ── TURN SWITCH: Subtle whoosh ──
  playTurnSwitch() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.Q.value = 1;
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // ── COUNTDOWN / TICK: Timer tick ──
  playTick() {
    if (!this.sfxEnabled) return;
    this.ensureRunning();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 2: BACKGROUND MUSIC — Generative Ambient Melody                        */
/* ═══════════════════════════════════════════════════════════════════════════ */
/* 
 * Creates a smooth, relaxing ambient melody using a C Major Pentatonic scale.
 * Notes: C4(261.63), D4(293.66), E4(329.63), G4(392.00), A4(440.00)
 *        C5(523.25), D5(587.33), E5(659.25), G5(783.99), A5(880.00)
 * Very soft, non-intrusive, improves focus during gameplay.
 */

class BackgroundMusic {
  constructor(soundEngine) {
    this.sfx = soundEngine;
    this.playing = false;
    this.nextNoteTime = 0;
    this.noteIndex = 0;
    this.timerID = null;
    this.tempo = 72; // BPM - slow and relaxing
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // s

    // C Major Pentatonic across 2 octaves
    this.scale = [
      261.63, 293.66, 329.63, 392.00, 440.00,   // C4 - A4
      523.25, 587.33, 659.25, 783.99, 880.00,   // C5 - A5
      1046.50                                 // C6
    ];

    // Weighted probabilities for pleasant melody patterns
    this.noteWeights = [2, 2, 3, 2, 2, 3, 2, 2, 1, 1, 1];
    this.currentNote = 5; // Start on C5
    this.previousNote = 5;
  }

  start() {
    if (this.playing || !this.sfx.musicEnabled) return;
    this.playing = true;
    this.nextNoteTime = this.sfx.ctx.currentTime + 0.1;
    this.scheduler();
  }

  stop() {
    this.playing = false;
    if (this.timerID) clearTimeout(this.timerID);
    this.timerID = null;
  }

  scheduler() {
    if (!this.playing) return;
    while (this.nextNoteTime < this.sfx.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    // Use varied rhythm: mostly quarter notes, occasional half notes
    const beatMultiplier = Math.random() < 0.15 ? 2 : 1;
    this.nextNoteTime += secondsPerBeat * beatMultiplier;
  }

  scheduleNote(time) {
    if (!this.sfx.musicEnabled) return;

    // Pick next note (prefer small steps for smooth melody)
    const stepRange = 3;
    let candidates = [];
    for (let i = -stepRange; i <= stepRange; i++) {
      const idx = this.currentNote + i;
      if (idx >= 0 && idx < this.scale.length) {
        const weight = this.noteWeights[idx] * (stepRange + 1 - Math.abs(i));
        for (let w = 0; w < weight; w++) candidates.push(idx);
      }
    }
    this.previousNote = this.currentNote;
    this.currentNote = candidates[Math.floor(Math.random() * candidates.length)] || this.currentNote;
    const freq = this.scale[this.currentNote];

    // Play the note with soft envelope
    const osc = this.sfx.ctx.createOscillator();
    const gain = this.sfx.ctx.createGain();
    const filter = this.sfx.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.5);
    filter.Q.value = 0.5;

    const duration = 60.0 / this.tempo * (Math.random() < 0.15 ? 1.8 : 0.9);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfx.musicGain);

    osc.start(time);
    osc.stop(time + duration);

    // Occasionally add a harmony note (5th interval)
    if (Math.random() < 0.25 && this.currentNote + 2 < this.scale.length) {
      const harmFreq = this.scale[this.currentNote + 2];
      const harmOsc = this.sfx.ctx.createOscillator();
      const harmGain = this.sfx.ctx.createGain();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(harmFreq, time + 0.1);
      harmGain.gain.setValueAtTime(0, time + 0.1);
      harmGain.gain.linearRampToValueAtTime(0.03, time + 0.15);
      harmGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      harmOsc.connect(harmGain);
      harmGain.connect(this.sfx.musicGain);
      harmOsc.start(time + 0.1);
      harmOsc.stop(time + duration);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 3: PARTICLE SYSTEM — Canvas 2D Overlay                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

class ParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.running = false;
    this.dpr = window.devicePixelRatio || 1;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-overlay';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.width = w;
    this.height = h;
  }

  // ── DUST ON TAP ──
  dust(x, y, player) {
    const colors = player === 'x' 
      ? ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc']
      : ['#f472b6', '#f9a8d4', '#db2777', '#fbcfe8'];
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.6;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 1,
        decay: 0.025 + Math.random() * 0.02,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'dust',
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.15
      });
    }
    this.startLoop();
  }

  // ── CONFETTI ON WIN ──
  confetti(x, y) {
    const colors = [
      '#6366f1', '#8b5cf6', '#f472b6', '#22c55e',
      '#eab308', '#06b6d4', '#f97316', '#ec4899'
    ];
    const shapes = ['square', 'circle', 'triangle'];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        life: 1,
        decay: 0.004 + Math.random() * 0.008,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'confetti',
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 3 + Math.random() * 4
      });
    }
    this.startLoop();
  }

  // ── WIN LINE GLOW ──
  winLineGlow(cells) {
    // cells = array of DOM elements (the winning cells)
    cells.forEach((cell, idx) => {
      const rect = cell.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 2;
          this.particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 2 + Math.random() * 4,
            color: ['#22c55e', '#4ade80', '#86efac'][Math.floor(Math.random() * 3)],
            type: 'winGlow',
            rotation: 0,
            rotationSpeed: 0,
            gravity: 0.05
          });
        }
        this.startLoop();
      }, idx * 100);
    });
  }

  // ── AMBIENT BACKGROUND ──
  ambient() {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: this.height + 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.3 + Math.random() * 0.5),
        life: 1,
        decay: 0.002 + Math.random() * 0.003,
        size: 1 + Math.random() * 2,
        color: `rgba(99, 102, 241, ${0.2 + Math.random() * 0.3})`,
        type: 'ambient',
        rotation: 0, rotationSpeed: 0, gravity: 0
      });
    }
    this.startLoop();
  }

  startLoop() {
    if (this.running) return;
    this.running = true;
    this.animate();
  }

  animate() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.running = false;
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      p.rotation += p.rotationSpeed;
      if (p.type === 'confetti') {
        p.wobble += p.wobbleSpeed * 0.016;
        p.vx += Math.sin(p.wobble) * 0.1;
      }
      p.vx *= 0.99;
      p.vy *= 0.99;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      if (p.type === 'ambient' || p.type === 'winGlow') {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'circle' || p.type === 'dust') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'square') {
        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      } else if (p.shape === 'triangle') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size);
        this.ctx.lineTo(-p.size, p.size);
        this.ctx.lineTo(p.size, p.size);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    requestAnimationFrame(() => this.animate());
  }

  clearAmbient() {
    this.particles = this.particles.filter(p => p.type !== 'ambient');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 4: ANIMATION CONTROLLER — CSS-driven Board Animations                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

class AnimationController {
  constructor() {
    this.board = document.getElementById('board');
    this.cells = [];
    this.initHoverTracking();
  }

  // Track mouse position for cell glow effect
  initHoverTracking() {
    document.addEventListener('mousemove', (e) => {
      document.querySelectorAll('.cell').forEach(cell => {
        const rect = cell.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        cell.style.setProperty('--mx', `${x}%`);
        cell.style.setProperty('--my', `${y}%`);
      });
    });
  }

  // Animate mark placement (X or O)
  animateMarkPlacement(cell, player) {
    cell.classList.add('mark-placing');
    // Remove the class after animation completes
    setTimeout(() => {
      cell.classList.remove('mark-placing');
      cell.classList.add('mark-placed');
    }, 50);
  }

  // Animate winning cells
  animateWin(cells) {
    cells.forEach((cell, i) => {
      setTimeout(() => {
        cell.classList.add('winner');
      }, i * 80);
    });
  }

  // Remove win animation
  clearWin() {
    document.querySelectorAll('.cell.winner').forEach(cell => {
      cell.classList.remove('winner');
    });
  }

  // Shake cell for invalid move
  shakeCell(cell) {
    cell.classList.remove('shake');
    void cell.offsetWidth; // force reflow
    cell.classList.add('shake');
    setTimeout(() => cell.classList.remove('shake'), 400);
  }

  // Animate score change
  animateScore(element, newValue) {
    element.classList.add('score-bump');
    setTimeout(() => {
      element.textContent = newValue;
      element.classList.remove('score-bump');
    }, 150);
  }

  // Animate turn indicator
  setTurnIndicator(activePlayerCard, inactivePlayerCard) {
    if (activePlayerCard) {
      activePlayerCard.classList.add('turn-active');
      activePlayerCard.classList.remove('turn-inactive');
    }
    if (inactivePlayerCard) {
      inactivePlayerCard.classList.add('turn-inactive');
      inactivePlayerCard.classList.remove('turn-active');
    }
  }

  // Screen transition
  transitionScreen(fromScreen, toScreen, callback) {
    if (fromScreen) {
      fromScreen.classList.add('screen-exit');
      fromScreen.classList.remove('active');
    }
    setTimeout(() => {
      if (toScreen) {
        toScreen.classList.add('screen-enter');
        toScreen.classList.add('active');
        setTimeout(() => {
          toScreen.classList.remove('screen-enter');
          if (fromScreen) fromScreen.classList.remove('screen-exit');
          if (callback) callback();
        }, 500);
      }
    }, fromScreen ? 200 : 0);
  }

  // Animate board entrance (staggered cells)
  animateBoardEntrance() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
      cell.style.opacity = '0';
      cell.style.transform = 'scale(0.5) translateY(20px)';
      setTimeout(() => {
        cell.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cell.style.opacity = '1';
        cell.style.transform = 'scale(1) translateY(0)';
      }, 50 + i * 60);
    });
    // Clean up transitions after animation
    setTimeout(() => {
      cells.forEach(cell => {
        cell.style.transition = '';
      });
    }, 50 + cells.length * 60 + 600);
  }

  // Animate coin earn
  animateCoinEarn(amount, x, y) {
    const coin = document.createElement('div');
    coin.className = 'floating-coin';
    coin.textContent = `+${amount}`;
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 1200);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 5: SETTINGS MANAGER — Sound Toggle + Volume Slider UI                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

class SettingsManager {
  constructor(soundEngine, bgMusic) {
    this.sfx = soundEngine;
    this.music = bgMusic;
    this.panel = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.createSettingsUI();
    this.loadSettings();
    this.initialized = true;
  }

  createSettingsUI() {
    // Check if settings screen already exists in your HTML
    let settingsScreen = document.getElementById('screen-settings');
    if (!settingsScreen) return; // If no settings screen, skip

    if (settingsScreen.querySelector('.sound-settings')) return;

    // Create sound settings section
    const soundSection = document.createElement('div');
    soundSection.className = 'settings-section sound-settings';
    soundSection.innerHTML = `
      <h3>🔊 Sound & Music</h3>

      <div class="setting-row">
        <label class="setting-label">
          <span class="setting-icon">🎵</span>
          <span class="setting-text">Background Music</span>
        </label>
        <label class="toggle-switch">
          <input type="checkbox" id="music-toggle" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <label class="setting-label">
          <span class="setting-icon">🔔</span>
          <span class="setting-text">Sound Effects</span>
        </label>
        <label class="toggle-switch">
          <input type="checkbox" id="sfx-toggle" checked>
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row slider-row">
        <label class="setting-label">
          <span class="setting-icon">🔊</span>
          <span class="setting-text">Master Volume</span>
        </label>
        <div class="slider-container">
          <input type="range" id="master-volume" min="0" max="100" value="50" class="volume-slider">
          <span class="volume-value" id="master-volume-value">50%</span>
        </div>
      </div>

      <div class="setting-row slider-row">
        <label class="setting-label">
          <span class="setting-icon">🎼</span>
          <span class="setting-text">Music Volume</span>
        </label>
        <div class="slider-container">
          <input type="range" id="music-volume" min="0" max="100" value="30" class="volume-slider">
          <span class="volume-value" id="music-volume-value">30%</span>
        </div>
      </div>
    `;

    // Insert at the top of settings screen content
    const firstChild = settingsScreen.querySelector(':scope > .settings-content, :scope > .screen-content, :scope > div');
    if (firstChild && firstChild !== soundSection) {
      firstChild.insertBefore(soundSection, firstChild.firstChild);
    } else {
      settingsScreen.insertBefore(soundSection, settingsScreen.firstChild);
    }

    // Bind events
    this.bindEvents();
  }

  bindEvents() {
    const musicToggle = document.getElementById('music-toggle');
    const sfxToggle = document.getElementById('sfx-toggle');
    const masterVol = document.getElementById('master-volume');
    const musicVol = document.getElementById('music-volume');

    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        this.sfx.setMusicEnabled(e.target.checked);
        if (e.target.checked) this.music.start();
        else this.music.stop();
        this.saveSettings();
      });
    }

    if (sfxToggle) {
      sfxToggle.addEventListener('change', (e) => {
        this.sfx.setSfxEnabled(e.target.checked);
        this.saveSettings();
      });
    }

    if (masterVol) {
      masterVol.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        this.sfx.setVolume(val);
        document.getElementById('master-volume-value').textContent = `${e.target.value}%`;
        this.saveSettings();
      });
    }

    if (musicVol) {
      musicVol.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        this.sfx.setMusicVolume(val);
        document.getElementById('music-volume-value').textContent = `${e.target.value}%`;
        this.saveSettings();
      });
    }
  }

  saveSettings() {
    const settings = {
      musicEnabled: document.getElementById('music-toggle')?.checked ?? true,
      sfxEnabled: document.getElementById('sfx-toggle')?.checked ?? true,
      masterVolume: parseInt(document.getElementById('master-volume')?.value ?? 50),
      musicVolume: parseInt(document.getElementById('music-volume')?.value ?? 30)
    };
    localStorage.setItem('ttt_sound_settings', JSON.stringify(settings));
  }

  loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('ttt_sound_settings'));
      if (!saved) return;

      const musicToggle = document.getElementById('music-toggle');
      const sfxToggle = document.getElementById('sfx-toggle');
      const masterVol = document.getElementById('master-volume');
      const musicVol = document.getElementById('music-volume');

      if (musicToggle) {
        musicToggle.checked = saved.musicEnabled;
        this.sfx.setMusicEnabled(saved.musicEnabled);
      }
      if (sfxToggle) {
        sfxToggle.checked = saved.sfxEnabled;
        this.sfx.setSfxEnabled(saved.sfxEnabled);
      }
      if (masterVol) {
        masterVol.value = saved.masterVolume;
        document.getElementById('master-volume-value').textContent = `${saved.masterVolume}%`;
        this.sfx.setVolume(saved.masterVolume / 100);
      }
      if (musicVol) {
        musicVol.value = saved.musicVolume;
        document.getElementById('music-volume-value').textContent = `${saved.musicVolume}%`;
        this.sfx.setMusicVolume(saved.musicVolume / 100);
      }
    } catch (e) {}
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PART 6: GLOBAL INITIALIZATION                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

const sfx = new SoundEngine();
const particles = new ParticleSystem();
const anim = new AnimationController();
let bgMusic = null;
let settingsMgr = null;

function initAnimations() {
  bgMusic = new BackgroundMusic(sfx);
  settingsMgr = new SettingsManager(sfx, bgMusic);
  if (window.TTTAnimations) {
    window.TTTAnimations.bgMusic = bgMusic;
    window.TTTAnimations.settingsMgr = settingsMgr;
  }

  // Initialize sound on first user interaction (browser policy)
  const initSound = () => {
    sfx.init();
    settingsMgr.init();
    // Start background music if enabled
    if (sfx.musicEnabled) {
      bgMusic.start();
    }
    document.removeEventListener('click', initSound);
    document.removeEventListener('touchstart', initSound);
  };

  document.addEventListener('click', initSound, { once: true });
  document.addEventListener('touchstart', initSound, { once: true });

}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Export for use in script.js
window.TTTAnimations = {
  sfx,
  particles,
  anim,
  bgMusic,
  settingsMgr,
  initAnimations
};
})();
