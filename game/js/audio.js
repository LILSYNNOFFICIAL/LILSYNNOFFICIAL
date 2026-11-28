// Audio: LIL SYNN music playlist (random, no back-to-back repeats, mood-aware, lazy) + synthesized SFX.
// Graph: music <audio> -> musicGain -> master -> out ; sfx oscillators -> sfxGain -> master -> out.
// Music and SFX are independently switchable and the player's choice is never overridden.

export class AudioSystem {
  constructor(settings) {
    this.s = settings; this.ctx = null; this.tracks = []; this.history = [];
    this.mood = 'explore'; this.curTrack = null; this.el = null; this.src = null;
    this.suspended = false; this.fails = 0; this.started = false; this.lastMoodChange = 0;
    this.onTrack = null; this.onState = null; this.dimmed = false;
  }
  async loadManifest(url) {
    try { const r = await fetch(url); const j = await r.json(); this.tracks = j.tracks || []; } catch (e) { this.tracks = []; }
  }
  // Must be called from a user gesture (browser autoplay rules).
  unlock() {
    if (!this.ctx) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      this.ctx = new A();
      this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.connect(this.master);
      this.sfxGain = this.ctx.createGain(); this.sfxGain.connect(this.master);
      this.duck = this.ctx.createGain(); this.duck.connect(this.musicGain);
      this.el = new Audio(); this.el.preload = 'none'; this.el.crossOrigin = 'anonymous';
      try { this.src = this.ctx.createMediaElementSource(this.el); this.src.connect(this.duck); } catch (e) { this.src = null; }
      this.el.addEventListener('ended', () => this.next());
      this.el.addEventListener('error', () => { if (!this.el.getAttribute('src')) return; this.fails++; if (this.fails < 4) setTimeout(() => this.next(), 400); });
      this.el.addEventListener('playing', () => { this.fails = 0; });
      this.apply();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  }
  apply() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, s = this.s;
    this.master.gain.setTargetAtTime(s.master, t, 0.03);
    this.musicGain.gain.setTargetAtTime(s.musicOn ? s.music * 0.9 : 0, t, 0.03);
    this.sfxGain.gain.setTargetAtTime(s.sfxOn ? s.sfx : 0, t, 0.03);
    if (!this.src && this.el) this.el.volume = s.musicOn ? s.master * s.music : 0; // fallback path
    // Music OFF: stop downloading/playing entirely; ON: resume the playlist.
    if (!s.musicOn) { if (this.el && !this.el.paused) this.el.pause(); }
    else if (this.started && !this.suspended && this.el && this.el.paused) this.resume();
    this._st2();
  }
  pick(mood, any) {
    const rot = this.tracks.filter(t => t.rotation !== false); // rotation:false = selector-only songs
    let pool = any ? rot : rot.filter(t => t.mood === mood); if (!pool.length) pool = rot.length ? rot : this.tracks;
    if (pool.length > 1 && this.curTrack) pool = pool.filter(t => t.file !== this.curTrack.file); // never the same song twice in a row
    if (!pool.length) return null;
    const recent = this.history.slice(-Math.min(3, pool.length - 1));
    const fresh = pool.filter(t => !recent.includes(t.file));
    const list = fresh.length ? fresh : pool.filter(t => t.file !== this.history[this.history.length - 1]);
    return (list.length ? list : pool)[Math.floor(Math.random() * (list.length || pool.length))];
  }
  start(mood = 'explore') { this.started = true; this.mood = mood; if (!this.curTrack) this.next(); else this.resume(); }
  next(any) {
    if (!this.el || !this.started) return;
    const t = this.repeat || this.pick(this.mood, any); if (!t) return; this.el.loop = !!this.repeat;
    this.curTrack = t; this.history.push(t.file); if (this.history.length > 20) this.history.shift();
    this.el.src = t.file; // lazy: the file is only fetched when it is about to play
    if (this.s.musicOn && !this.suspended) { this.fadeIn(); this.el.play().catch(() => {}); }
    this.onTrack && this.onTrack(t); this._st2();
  }
  _st2() { this.onState && this.onState(); }
  playing() { return !!(this.el && this.started && this.s.musicOn && !this.el.paused); }
  // ---- player controls (HUD, pause menu, N / M / B keys) ----
  skip() { if (!this.el) return; this.started = true; this.s.musicOn = true; this.next(true); this.apply(); this._st2(); } // next random song, no immediate repeat
  togglePlay() { this.s.musicOn = !this.s.musicOn; if (this.s.musicOn) this.started = true; this.apply(); this._st2(); return this.s.musicOn; } // pause keeps the position; play resumes it (persisted as Music on/off)
  replay() { if (!this.el || !this.curTrack) { this.skip(); return; } this.s.musicOn = true; try { this.el.currentTime = 0; } catch (e) {} this.apply(); if (this.el.paused && !this.suspended) { this.fadeIn(); this.el.play().catch(() => {}); } this._st2(); }
  // Song Selector (JUNE23): one chosen song loops and overrides the random rotation until MESS clears it.
  setRepeat(t) { this.repeat = t || null; if (!this.el) return; this.el.loop = !!t; if (t) { this.started = true; this.s.musicOn = true; this.curTrack = t; this.history.push(t.file); this.el.src = t.file; if (!this.suspended) { this.fadeIn(); this.el.play().catch(() => {}); } this.onTrack && this.onTrack(t); this.apply(); } this._st2(); }
  // pause menu: keep the music audible (quieter) so the player can use the music controls there
  dim(on) { this.dimmed = on; if (!this.ctx) return; const g = this.duck.gain, t = this.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(Math.max(0.0001, g.value), t); g.linearRampToValueAtTime(on ? 0.3 : 1, t + 0.4); }
  resume() { if (!this.el || !this.s.musicOn || this.suspended) return; if (!this.el.getAttribute('src')) { this.next(); return; } this.fadeIn(); this.el.play().catch(() => {}); }
  fadeIn() { if (!this.ctx) return; const g = this.duck.gain, t = this.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(0.0001, t); g.linearRampToValueAtTime(this.dimmed ? 0.3 : 1, t + 1.5); }
  // Context-sensitive: crossfade to a track of the new mood (held at least 20 s to avoid ping-pong).
  setMood(m) {
    if (m === this.mood || this.repeat) return; const now = performance.now();
    if (now - this.lastMoodChange < 20000 && this.curTrack) return;
    this.mood = m; this.lastMoodChange = now;
    if (!this.started || !this.el || !this.curTrack || this.curTrack.mood === m) return;
    const g = this.duck.gain, t = this.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 1.6);
    setTimeout(() => this.next(), 1650);
  }
  // Cutscenes/pause: gameplay music must not play over them.
  suspend(fade = 1) {
    this.suspended = true; if (!this.el || !this.ctx) return;
    const g = this.duck.gain, t = this.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + fade);
    clearTimeout(this._st); this._st = setTimeout(() => { if (this.suspended) this.el.pause(); }, fade * 1000 + 50);
  }
  unsuspend() { this.suspended = false; this.resume(); }

  // ---------------- synthesized SFX ----------------
  _tone(type, f0, f1, dur, vol, when = 0, opts = {}) {
    const c = this.ctx; if (!c || !this.s.sfxOn) return;
    const t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    if (opts.detune) o.detune.value = opts.detune;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (opts.attack || 0.008)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (opts.filter) { const f = c.createBiquadFilter(); f.type = opts.filter; f.frequency.value = opts.ff || 1200; f.Q.value = opts.q || 1; o.connect(f); node = f; }
    if (opts.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = opts.vib; lg.gain.value = f0 * 0.02; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); }
    node.connect(g).connect(this.sfxGain); o.start(t); o.stop(t + dur + 0.05);
  }
  _noise(dur, vol, when = 0, ff = 1800, type = 'bandpass', q = 0.8, sweepTo) {
    const c = this.ctx; if (!c || !this.s.sfxOn) return;
    if (!this._nb) { const n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this._nb = b; }
    const t = c.currentTime + when, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this._nb; f.type = type; f.frequency.setValueAtTime(ff, t); if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur); f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.sfxGain); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  play(name, x = {}) {
    if (!this.ctx || !this.s.sfxOn) return;
    const P = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C major pentatonic
    switch (name) {
      case 'sonic': { const f = P[Math.floor(Math.random() * P.length)]; this._tone('sine', f, f, 0.18, 0.16); this._tone('triangle', f * 2, f * 2, 0.12, 0.05, 0.0); this._tone('sine', f * 1.5, f * 1.5, 0.16, 0.06, 0.07); break; }
      case 'star': this._tone('triangle', 1318, 2637, 0.2, 0.1); this._tone('sine', 1760, 1760, 0.25, 0.06, 0.05); this._noise(0.15, 0.05, 0, 6000, 'highpass'); break;
      case 'cello': { const b = 98; this._tone('sawtooth', b, b, 1.4, 0.14, 0, { filter: 'lowpass', ff: 900, attack: 0.12, vib: 5 }); this._tone('sawtooth', b * 1.5, b * 1.5, 1.3, 0.08, 0.05, { filter: 'lowpass', ff: 1200, attack: 0.15, vib: 5.5 }); this._tone('sine', b * 2, b * 2, 1.2, 0.08, 0.1); break; }
      case 'impact': this._noise(0.12, 0.12, 0, 2400); this._tone('sine', 1400, 700, 0.1, 0.06); break;
      case 'heart': this._tone('triangle', 1046, 1568, 0.16, 0.12); this._tone('sine', 2093, 2093, 0.2, 0.05, 0.06); break;
      case 'absorb': { const i = x.i || 0; const f = P[i % P.length] * (1 + Math.floor(i / P.length)); this._tone('sine', f, f * 1.01, 0.3, 0.12); this._tone('triangle', f * 2, f * 2, 0.2, 0.04, 0.03); this._noise(0.25, 0.03, 0, 8000, 'highpass'); break; }
      case 'absorbDone': [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this._tone('sine', f, f, 0.7, 0.08, i * 0.06)); break;
      case 'hurt': this._tone('sine', 220, 90, 0.25, 0.22); this._noise(0.15, 0.1, 0, 900, 'lowpass'); break;
      case 'crack': this._noise(0.18, 0.18, 0, 3000, 'highpass'); this._tone('square', 1200, 300, 0.12, 0.04); break;
      case 'jump': this._noise(0.18, 0.06, 0, 600, 'bandpass', 1, 2200); this._tone('sine', 330, 520, 0.12, 0.05); break;
      case 'land': this._tone('sine', 120, 60, 0.12, 0.16); this._noise(0.1, 0.05, 0, 500, 'lowpass'); break;
      case 'step': this._noise(0.05, 0.025, 0, 1200 + Math.random() * 600, 'bandpass', 2); break;
      case 'purify': [659.25, 830.6, 987.8, 1318.5].forEach((f, i) => this._tone('triangle', f, f, 0.5, 0.07, i * 0.05)); this._noise(0.5, 0.04, 0, 7000, 'highpass'); break;
      case 'enemyHit': this._tone('square', 500, 260, 0.08, 0.05, 0, { filter: 'lowpass', ff: 1500 }); break;
      case 'pack': [392, 523.25, 659.25].forEach((f, i) => this._tone('sine', f, f * 1.02, 0.6, 0.09, i * 0.08)); break;
      case 'heal': [523.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this._tone('sine', f, f, 0.5, 0.08, i * 0.07)); break;
      case 'switch': this._tone('triangle', 880, 1320, 0.07, 0.07); this._tone('triangle', 1320, 1760, 0.07, 0.05, 0.06); break;
      case 'click': this._tone('triangle', 1200, 900, 0.05, 0.06); break;
      case 'chest': this._noise(0.4, 0.05, 0, 400, 'lowpass'); [784, 988, 1175, 1568].forEach((f, i) => this._tone('triangle', f, f, 0.5, 0.07, 0.2 + i * 0.08)); break;
      case 'meow': this._tone('sine', 650, 1000, 0.12, 0.08, 0, { filter: 'bandpass', ff: 1400, q: 2 }); this._tone('sine', 1000, 520, 0.3, 0.08, 0.12, { filter: 'bandpass', ff: 1200, q: 2 }); break;
      case 'hiss': this._noise(0.6, 0.12, 0, 5000, 'highpass'); break;
      case 'bell': this._tone('sine', 1760, 1760, 0.8, 0.08); this._tone('sine', 2637, 2637, 0.6, 0.04); break;
      case 'cue': this._tone('sine', 988, 988, 0.15, 0.05); this._tone('sine', 1318, 1318, 0.25, 0.05, 0.1); break;
      case 'melody': { // strange melody (foreshadowing): something gentle bending out of tune
        const m = [659.25, 783.99, 739.99, 587.33, 554.37, 493.88]; m.forEach((f, i) => this._tone('triangle', f, f * (i > 3 ? 0.97 : 1), 0.55, 0.05, i * 0.42, { vib: 6, attack: 0.05 })); break; }
      case 'portal': this._tone('sine', 110, 113, 2.5, 0.08, 0, { attack: 0.5 }); this._tone('sine', 165, 168, 2.5, 0.05, 0, { attack: 0.6 }); break;
      case 'shadow': this._tone('sawtooth', 73.4, 69, 2.4, 0.1, 0, { filter: 'lowpass', ff: 500, attack: 0.4, detune: -10 }); this._tone('sawtooth', 110, 104, 2.4, 0.07, 0.1, { filter: 'lowpass', ff: 600, attack: 0.5, detune: 12 }); this._noise(2.0, 0.04, 0, 300, 'lowpass', 1, 2000); break;
      case 'unstable': for (let i = 0; i < 6; i++) this._noise(0.12, 0.08, i * 0.18 + Math.random() * 0.05, 1500 + Math.random() * 3000, 'bandpass', 3); this._tone('sine', 220, 55, 2.0, 0.1); break;
      case 'whoosh': this._noise(1.2, 0.12, 0, 300, 'bandpass', 1.2, 5000); break;
      case 'code': [784, 1046, 1318, 1568, 2093].forEach((f, i) => this._tone('triangle', f, f, 0.35, 0.07, i * 0.07)); break;
      case 'nope': this._tone('triangle', 440, 330, 0.18, 0.08); this._tone('triangle', 330, 262, 0.22, 0.08, 0.15); break;
      case 'swing': this._noise(0.16, 0.09, 0, 900, 'bandpass', 1.4, 3200); this._tone('triangle', 660, 990, 0.1, 0.05); break;
      case 'drum': this._tone('sine', 150, 70, 0.3, 0.25); this._noise(0.12, 0.08, 0, 1800, 'bandpass', 1); this._tone('triangle', 784, 784, 0.25, 0.04, 0.02); break;
      case 'roll': this._noise(0.35, 0.07, 0, 500, 'bandpass', 1, 1600); break;
      case 'splash': this._noise(0.5, 0.14, 0, 1200, 'bandpass', 0.8, 400); this._noise(0.3, 0.05, 0.05, 5000, 'highpass'); break;
      case 'bubble': this._tone('sine', 400 + Math.random() * 300, 900, 0.08, 0.04); break;
      case 'pearl': [880, 1108.7, 1318.5, 1760].forEach((f, i) => this._tone('sine', f, f, 0.6, 0.07, i * 0.08)); break;
      case 'grab': this._noise(0.1, 0.06, 0, 2500, 'bandpass', 2); this._tone('sine', 300, 420, 0.08, 0.05); break;
      case 'gasp': this._noise(0.25, 0.07, 0, 2200, 'bandpass', 1, 900); break;
      case 'seal': this._tone('sine', 880, 55, 2.2, 0.12, 0, { attack: 0.05 }); this._noise(1.4, 0.12, 0, 4000, 'lowpass', 1, 200); [440, 330, 220].forEach((f, i) => this._tone('triangle', f, f * 0.98, 0.9, 0.06, 0.6 + i * 0.3)); break;
      case 'bump': this._tone('sine', 300, 180, 0.12, 0.08); break;
    }
  }
}
