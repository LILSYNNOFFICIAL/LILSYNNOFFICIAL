// Data-driven multi-phase boss engine. Shadow Man is the recurring boss; each world teaches a new pattern set.
// A phase runs its pattern sequence IN ORDER (learnable). Surviving the whole sequence makes him stagger:
// DASH into him while he staggers to land a hit. Enough hits ends the phase.
import * as THREE from 'three';
import { makePeacockFeather } from './characters.js';
import { glowTexture } from './world.js';

const ph = (seq, hits, stun, speed = 1) => ({ seq, hits, stun, speed });
export const BOSSES = {
  prologue: { dmg: 1, aura: 0x5a1aa8, phases: [ph(['orbs', 'fan'], 1, 3.6, 0.8), ph(['orbs', 'fan'], 1, 3.2, 0.9), ph(['orbs', 'ring', 'fan'], 1, 3.0, 1)] },
  0: { dmg: 1, aura: 0x5a1aa8, phases: [ph(['orbs', 'fan'], 2, 2.8), ph(['orbs', 'ring', 'fan'], 2, 2.6, 1.05), ph(['hands', 'orbs', 'fan', 'ring'], 2, 2.4, 1.1)] },
  1: { dmg: 1, aura: 0xff2fa8, phases: [ph(['orbs', 'hands'], 2, 2.6), ph(['ring', 'hands', 'fan'], 2, 2.4, 1.1), ph(['summon', 'orbs', 'hands', 'ring'], 3, 2.2, 1.15)] },
  2: { dmg: 1, aura: 0xffb040, phases: [ph(['fan', 'ring'], 2, 2.5, 1.05), ph(['dashAt', 'fan', 'orbs'], 2, 2.3, 1.1), ph(['dashAt', 'ring', 'dashAt', 'fan'], 3, 2.1, 1.2)] },
  3: { dmg: 1, aura: 0xff6a2a, phases: [ph(['orbs', 'sweep'], 2, 2.4, 1.1), ph(['sweep', 'hands', 'orbs'], 3, 2.2, 1.15), ph(['rain', 'sweep', 'fan', 'dashAt'], 3, 2.0, 1.2)] },
  4: { dmg: 2, aura: 0x29e0ff, phases: [ph(['rain', 'ring'], 2, 2.3, 1.1), ph(['rain', 'sweep', 'dashAt'], 3, 2.1, 1.2), ph(['rain', 'hands', 'sweep', 'orbs'], 3, 1.9, 1.25)] },
  5: { dmg: 2, aura: 0xff8a2a, phases: [ph(['summon', 'hands'], 2, 2.2, 1.15), ph(['hands', 'ring', 'fan', 'orbs'], 3, 2.0, 1.2), ph(['summon', 'sweep', 'hands', 'dashAt'], 3, 1.8, 1.3)] },
  6: { dmg: 2, aura: 0x3a6bff, phases: [ph(['orbs', 'rain', 'fan'], 3, 2.1, 1.2), ph(['sweep', 'dashAt', 'hands'], 3, 1.9, 1.25), ph(['rain', 'ring', 'sweep', 'orbs', 'fan'], 3, 1.7, 1.3)] },
  7: { dmg: 2, aura: 0xb070ff, phases: [ph(['dashAt', 'ring', 'orbs'], 3, 2.0, 1.25), ph(['sweep', 'rain', 'hands'], 3, 1.8, 1.3), ph(['summon', 'dashAt', 'sweep', 'fan', 'ring'], 4, 1.6, 1.35)] },
  8: { dmg: 2, aura: 0x00ffd0, final: true, phases: [ph(['orbs', 'fan', 'ring'], 3, 1.9, 1.3), ph(['hands', 'sweep', 'dashAt'], 3, 1.7, 1.35), ph(['rain', 'summon', 'fan', 'sweep'], 4, 1.6, 1.4), ph(['ring', 'hands', 'dashAt', 'rain', 'sweep', 'fan'], 4, 1.5, 1.45)] },
};
const HINTS = { orbs: 'Shadow orbs: keep moving, DASH through them', fan: 'Feather fan: JUMP over the blades', ring: 'Shock ring: JUMP as it reaches you', hands: 'Shadow hands: get off the red circles', sweep: 'Sweeping beam: JUMP it like a jump rope', summon: 'Wisps: stomp or dash them', rain: 'Shadow rain: watch the circles', dashAt: 'Charge: side-step the red line' };

export class Boss {
  constructor(scene, rig, cfg, arena, ctx) {
    this.scene = scene; this.rig = rig; this.cfg = cfg; this.A = arena; this.ctx = ctx;
    this.C = arena.center; this.R = arena.radius;
    this.pos = new THREE.Vector3(this.C.x, 0, this.C.z - 6);
    this.phase = 0; this.hits = 0; this.state = 'idle'; this.t = 0; this.si = 0; this.pat = null; this.dead = false; this.active = false;
    this.total = cfg.phases.reduce((a, p) => a + p.hits, 0); this.done = 0;
    this.orbs = []; this.blades = []; this.rings = []; this.hands = []; this.drops = []; this.minions = []; this.beam = null; this.seen = new Set();
    this.ang = 0; this.charge = null;
    this.group = new THREE.Group(); scene.add(this.group);
    if (rig.aura) rig.aura.color.set(cfg.aura);
    this.orbGeo = new THREE.SphereGeometry(0.28, 12, 10);
    this.orbMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: cfg.aura, emissiveIntensity: 2.2, roughness: 0.2 });
    this.teleMat = new THREE.MeshBasicMaterial({ color: 0xff2a4a, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    this.stars = [];
    for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffd23a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(0.45); s.visible = false; this.group.add(s); this.stars.push(s); }
  }
  get P() { return this.ctx.P; }
  get hp() { return 1 - this.done / this.total; }
  start() { this.active = true; this.state = 'intro'; this.t = 0; }
  clearHazards() {
    for (const l of [this.orbs, this.blades, this.rings, this.hands, this.drops]) { l.forEach(o => this.group.remove(o.m)); l.length = 0; }
    this.minions.forEach(m => this.group.remove(m.m)); this.minions.length = 0;
    if (this.beam) { this.group.remove(this.beam.m); this.beam = null; }
    this.charge = null;
  }
  dispose() { this.clearHazards(); this.scene.remove(this.group); }
  resetAfterDeath() { this.clearHazards(); if (!this.dead) { this.state = 'pattern'; this.si = 0; this.beginPattern(); } }
  get ph() { return this.cfg.phases[this.phase]; }
  beginPattern() {
    const name = this.ph.seq[this.si]; this.pat = { name, t: 0, k: 0, n: 0 };
    if (!this.seen.has(name)) { this.seen.add(name); this.ctx.toast(HINTS[name], 2.2); }
  }
  tele(x, z, r) { const m = new THREE.Mesh(new THREE.RingGeometry(r * 0.85, r, 32), this.teleMat.clone()); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.05, z); this.group.add(m); return m; }
  toPlayer() { return this.P.pos.clone().sub(this.pos).setY(0); }

  // ---------------- patterns ----------------
  runPattern(dt) {
    const p = this.pat, sp = this.ph.speed, ph = this.phase, P = this.P; p.t += dt * sp;
    switch (p.name) {
      case 'orbs': {
        const volleys = 3 + ph, gap = 1.05 - ph * 0.12;
        if (p.k < volleys && p.t >= p.k * gap) {
          p.k++; const hand = this.pos.clone().add(new THREE.Vector3(0, 3.2, 0)); const tgt = P.pos.clone().add(new THREE.Vector3(P.vel.x * 0.35, 1, P.vel.z * 0.35));
          const n = Math.min(4, 1 + ph + (this.cfg.final ? 1 : 0)); const to = this.toPlayer();
          for (let i = 0; i < n; i++) { const side = new THREE.Vector3(-to.z, 0, to.x).normalize().multiplyScalar((i - (n - 1) / 2) * 1.7); this.spawnOrb(hand, tgt.clone().add(side), (8 + ph * 2) * sp, ph >= 1); }
        }
        return p.t > volleys * gap + 0.6;
      }
      case 'fan': {
        const waves = 1 + ph, gap = 0.75;
        if (p.t < 0.8) return false; // telegraph: feather raised
        if (p.k < waves && p.t - 0.8 >= p.k * gap) {
          p.k++; const full = ph >= 2;
          this.spawnFan(full ? 16 : 7 + ph * 2, full ? Math.PI * 2 : Math.PI * (0.55 + ph * 0.2), (9 + ph) * sp, p.k * 0.13);
          this.ctx.sfx('boss'); this.ctx.shake(0.15);
        }
        return p.t > 0.8 + waves * gap + 0.8;
      }
      case 'ring': {
        const n = 1 + ph, gap = 1.0;
        if (p.t < 0.6) return false;
        if (p.k < n && p.t - 0.6 >= p.k * gap) {
          p.k++; const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 6, 64), new THREE.MeshStandardMaterial({ color: this.cfg.aura, emissive: this.cfg.aura, emissiveIntensity: 3 }));
          m.rotation.x = Math.PI / 2; m.position.set(this.pos.x, 0.3, this.pos.z); this.group.add(m); this.rings.push({ m, r: 1, c: this.pos.clone(), v: (8 + ph) * sp });
          this.ctx.sfx('boss'); this.ctx.shake(0.25);
        }
        return p.t > 0.6 + n * gap + 1.6;
      }
      case 'hands': {
        const n = 3 + ph * 2, gap = 0.5;
        if (p.k < n && p.t >= p.k * gap) { p.k++; const x = P.pos.x, z = P.pos.z; this.hands.push({ m: this.tele(x, z, 1.3), x, z, t: 0, fired: false }); }
        return p.t > n * gap + 1.6;
      }
      case 'sweep': {
        if (!this.beam) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(this.R * 2.2, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: this.cfg.aura, emissive: this.cfg.aura, emissiveIntensity: 3.5 }));
          m.position.set(this.pos.x, 0.45, this.pos.z); this.group.add(m);
          this.beam = { m, a: Math.atan2(this.toPlayer().x, this.toPlayer().z) + Math.PI / 2, dir: Math.random() < 0.5 ? 1 : -1, warm: 0.8 };
          m.material.opacity = 0.3; m.material.transparent = true;
        }
        const b = this.beam; const spd = (1.5 + ph * 0.35) * sp;
        if (b.warm > 0) { b.warm -= dt; b.m.material.opacity = 0.3 + (0.8 - b.warm) * 0.8; }
        else { b.a += b.dir * spd * dt; b.m.material.opacity = 1; p.n += spd * dt; }
        b.m.position.set(this.pos.x, 0.45, this.pos.z); b.m.rotation.y = b.a;
        const turns = ph >= 2 ? 2 : 1.25;
        if (p.n >= Math.PI * turns) { this.group.remove(b.m); this.beam = null; return true; }
        return false;
      }
      case 'summon': {
        if (p.k === 0) { p.k = 1; const n = 2 + ph; for (let i = 0; i < n; i++) this.spawnMinion(i / n * Math.PI * 2); this.ctx.sfx('boss'); }
        return p.t > 1.4;
      }
      case 'rain': {
        const n = 6 + ph * 3;
        if (p.k < n && p.t >= p.k * 0.18) {
          p.k++; let x, z; if (p.k % 3 === 1) { x = P.pos.x; z = P.pos.z; } else { const a = Math.random() * Math.PI * 2, r = Math.random() * (this.R - 2); x = this.C.x + Math.cos(a) * r; z = this.C.z + Math.sin(a) * r; }
          const m = new THREE.Mesh(this.orbGeo, this.orbMat); m.position.set(x, 14, z); m.scale.setScalar(1.6); this.group.add(m);
          this.drops.push({ m, tele: this.tele(x, z, 1.1), x, z, t: 0 });
        }
        return p.t > n * 0.18 + 1.8;
      }
      case 'dashAt': {
        const reps = 1 + Math.floor(ph / 2);
        if (!this.charge) {
          if (p.k >= reps) return p.t > 0.4;
          const dir = this.toPlayer().normalize(); const len = this.R * 2;
          const line = new THREE.Mesh(new THREE.PlaneGeometry(1.6, len), this.teleMat.clone()); line.rotation.x = -Math.PI / 2; line.rotation.z = -Math.atan2(dir.x, dir.z);
          line.position.set(this.pos.x + dir.x * len / 2, 0.05, this.pos.z + dir.z * len / 2); this.group.add(line);
          this.charge = { dir, line, t: 0, go: false }; p.k++;
        }
        const c = this.charge; c.t += dt * sp;
        if (!c.go) { c.line.material.opacity = 0.3 + Math.sin(c.t * 20) * 0.2; if (c.t > 0.85) { c.go = true; c.t = 0; this.ctx.sfx('dash'); } }
        else {
          this.pos.addScaledVector(c.dir, 24 * sp * dt);
          const off = this.pos.clone().sub(this.C).setY(0);
          if (off.length() > this.R - 1.5 || c.t > 1.2) { off.setLength(Math.min(off.length(), this.R - 1.5)); this.pos.set(this.C.x + off.x, 0, this.C.z + off.z); this.group.remove(c.line); this.charge = null; p.t = 0; this.ctx.shake(0.3); }
        }
        return false;
      }
    }
    return true;
  }
  spawnOrb(from, target, speed, homing) {
    const g = new THREE.Group(); g.add(new THREE.Mesh(this.orbGeo, this.orbMat));
    const T = this.ctx.TEX.orb; const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: T || glowTexture(), color: T ? 0xffffff : this.cfg.aura, transparent: true, depthWrite: false, blending: T ? THREE.NormalBlending : THREE.AdditiveBlending }));
    spr.scale.setScalar(1.35); g.add(spr); g.position.copy(from); this.group.add(g);
    this.orbs.push({ m: g, v: target.clone().sub(from).normalize().multiplyScalar(speed), life: 5, speed, homing }); this.ctx.sfx('orb');
  }
  spawnFan(n, spread, speed, offset) {
    const base = Math.atan2(this.P.pos.x - this.pos.x, this.P.pos.z - this.pos.z) + offset;
    for (let i = 0; i < n; i++) {
      const a = spread >= Math.PI * 2 ? (i / n) * Math.PI * 2 + offset : base - spread / 2 + spread * (n === 1 ? 0.5 : i / (n - 1));
      const f = makePeacockFeather(0.9); f.rotation.set(Math.PI / 2, 0, 0); const h = new THREE.Group(); h.add(f); f.position.set(0, 0, -0.45);
      h.position.set(this.pos.x, 0.5, this.pos.z); h.rotation.y = a + Math.PI; this.group.add(h);
      this.blades.push({ m: h, v: new THREE.Vector3(Math.sin(a), 0, Math.cos(a)).multiplyScalar(speed), life: 4 });
    }
  }
  spawnMinion(a) {
    const g = new THREE.Group(); const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), new THREE.MeshStandardMaterial({ color: 0x100020, emissive: this.cfg.aura, emissiveIntensity: 2.5, flatShading: true }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.ctx.TEX.wisp || glowTexture(), transparent: true, depthWrite: false, color: this.ctx.TEX.wisp ? 0xffffff : this.cfg.aura })); halo.scale.setScalar(1.5);
    g.add(core, halo); g.position.set(this.pos.x + Math.cos(a) * 2.5, 1, this.pos.z + Math.sin(a) * 2.5); this.group.add(g);
    this.minions.push({ m: g, core, life: 14 });
  }

  // ---------------- main update ----------------
  update(dt, t) {
    const P = this.P, ctx = this.ctx; let mode = 'idle';
    if (!this.active) { this.rig.animate(t, dt, { mode: 'idle', speed: 0 }); this.rig.root.position.copy(this.pos); this.rig.root.lookAt(P.pos.x, 0, P.pos.z); return; }
    this.t += dt;
    if (this.state === 'intro') { if (this.t > 2.8) { this.state = 'pattern'; this.si = 0; this.beginPattern(); } }
    else if (this.state === 'pattern') {
      const nm = this.pat.name; mode = nm === 'fan' || nm === 'ring' || nm === 'summon' ? 'feather' : nm === 'orbs' || nm === 'rain' ? 'throw' : nm === 'dashAt' ? 'dash' : 'idle';
      if (!this.charge) { // drift around the arena
        this.ang += dt * (0.3 + this.phase * 0.12);
        const Rr = 7 + this.phase; const goal = new THREE.Vector3(this.C.x + Math.sin(this.ang) * Rr, 0, this.C.z + Math.cos(this.ang) * Rr * 0.7 - 2);
        if (this.pat.name !== 'sweep') this.pos.lerp(goal, Math.min(1, dt * 1.2));
      }
      if (this.runPattern(dt)) {
        this.si++;
        if (this.si >= this.ph.seq.length) { this.state = 'stunned'; this.t = 0; ctx.toast('He staggers! DASH into him!', 1.4); ctx.sfx('stomp'); }
        else this.beginPattern();
      }
    } else if (this.state === 'stunned') {
      mode = 'stunned';
      if (this.t > this.ph.stun) { this.state = 'pattern'; this.si = 0; this.t = 0; this.beginPattern(); }
    } else if (this.state === 'hit') {
      mode = 'hurt';
      if (this.t > 0.9) {
        if (this.hits >= this.ph.hits) {
          this.hits = 0; this.phase++;
          if (this.phase >= this.cfg.phases.length) { this.state = 'dying'; this.t = 0; this.dead = true; this.clearHazards(); ctx.onDefeated(); return; }
          this.state = 'roar'; this.t = 0; ctx.toast(`PHASE ${this.phase + 1} / ${this.cfg.phases.length}`, 2); ctx.sfx('boss'); ctx.shake(0.6);
          const away = P.pos.clone().sub(this.pos).setY(0).normalize(); P.vel.set(away.x * 14, 7, away.z * 14); P.knock = 0.4;
          this.clearHazards();
        } else { this.state = 'pattern'; this.si = 0; this.t = 0; this.beginPattern(); }
      }
    } else if (this.state === 'roar') { mode = 'feather'; if (this.t > 1.5) { this.state = 'pattern'; this.si = 0; this.t = 0; this.beginPattern(); } }

    // body contact / landing hits
    const pd = Math.hypot(P.pos.x - this.pos.x, P.pos.z - this.pos.z);
    if (pd < 1.35 && P.pos.y < 3.8 && ctx.canHurt()) {
      if (this.state === 'stunned' && P.dashT > 0) {
        this.hits++; this.done++; this.state = 'hit'; this.t = 0; ctx.sfx('hit'); ctx.shake(0.5); ctx.burst(this.pos.clone().setY(2.5), 0xffffff, 26, 7, 0.5);
        P.dashT = 0; const away = P.pos.clone().sub(this.pos).setY(0).normalize(); P.vel.set(away.x * 10, 6, away.z * 10); P.knock = 0.3; ctx.onBossHit();
      } else if (this.state !== 'stunned' && this.state !== 'hit' && this.state !== 'intro') ctx.hurt(this.pos, this.cfg.dmg);
    }
    this.stars.forEach((s, i) => { s.visible = this.state === 'stunned'; const a = t * 4 + i * 2.1; s.position.set(this.pos.x + Math.cos(a) * 0.7, 4.3, this.pos.z + Math.sin(a) * 0.7); });
    this.rig.root.position.copy(this.pos);
    const to = this.toPlayer(); this.rig.root.rotation.y = Math.atan2(to.x, to.z);
    this.rig.animate(t, dt, { mode, speed: 0.6 });
    this.updateHazards(dt);
  }

  updateHazards(dt) {
    const P = this.P, ctx = this.ctx, dmg = this.cfg.dmg; const center = P.pos.clone(); center.y += 0.9;
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const o = this.orbs[i]; o.life -= dt;
      if (o.homing) { const want = center.clone().sub(o.m.position).normalize().multiplyScalar(o.speed); o.v.lerp(want, Math.min(1, dt * 0.6)); }
      o.m.position.addScaledVector(o.v, dt); const dd = o.m.position.distanceTo(center);
      let kill = o.life <= 0 || o.m.position.y < 0.1;
      if (!kill && P.dashT > 0 && dd < 1.1) { kill = true; ctx.sfx('stomp'); }
      else if (!kill && dd < 0.7) { kill = true; ctx.hurt(o.m.position, 1); }
      if (kill) { ctx.burst(o.m.position, this.cfg.aura, 6, 3); this.group.remove(o.m); this.orbs.splice(i, 1); }
    }
    for (let i = this.blades.length - 1; i >= 0; i--) {
      const b = this.blades[i]; b.life -= dt; b.m.position.addScaledVector(b.v, dt); b.m.children[0].rotation.z += dt * 10;
      const dxz = Math.hypot(b.m.position.x - P.pos.x, b.m.position.z - P.pos.z);
      let kill = b.life <= 0 || b.m.position.distanceTo(this.C) > this.R + 3;
      if (!kill && dxz < 0.7 && P.pos.y < 0.75) { kill = true; ctx.hurt(b.m.position, dmg); }
      if (kill) { this.group.remove(b.m); this.blades.splice(i, 1); }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]; r.r += r.v * dt; r.m.scale.setScalar(r.r); r.m.material.opacity = 1;
      const dd = Math.hypot(P.pos.x - r.c.x, P.pos.z - r.c.z);
      if (Math.abs(dd - r.r) < 0.45 && P.pos.y < 0.6 && !r.hit) { r.hit = true; ctx.hurt(r.c, dmg); }
      if (r.r > this.R + 2) { this.group.remove(r.m); this.rings.splice(i, 1); }
    }
    for (let i = this.hands.length - 1; i >= 0; i--) {
      const h = this.hands[i]; h.t += dt;
      h.m.material.opacity = 0.3 + Math.sin(h.t * 18) * 0.2;
      if (h.t > 0.9 && !h.fired) {
        h.fired = true; const sp = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.4, 7), new THREE.MeshStandardMaterial({ color: 0x050008, emissive: this.cfg.aura, emissiveIntensity: 1.4, flatShading: true }));
        sp.position.set(h.x, 1.2, h.z); this.group.add(sp); h.spike = sp; this.ctx.shake(0.12);
        if (Math.hypot(P.pos.x - h.x, P.pos.z - h.z) < 1.3 && P.pos.y < 2.2) ctx.hurt(new THREE.Vector3(h.x, 0, h.z), dmg);
      }
      if (h.t > 1.4) { this.group.remove(h.m); if (h.spike) this.group.remove(h.spike); this.hands.splice(i, 1); }
    }
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i]; d.t += dt; d.m.position.y = Math.max(0, 14 - (d.t / 1.1) * 14); d.tele.material.opacity = 0.3 + Math.sin(d.t * 20) * 0.2;
      if (d.t >= 1.1) {
        if (Math.hypot(P.pos.x - d.x, P.pos.z - d.z) < 1.15 && P.pos.y < 2) ctx.hurt(new THREE.Vector3(d.x, 0, d.z), dmg);
        ctx.burst(new THREE.Vector3(d.x, 0.4, d.z), this.cfg.aura, 8, 4); this.group.remove(d.m); this.group.remove(d.tele); this.drops.splice(i, 1);
      }
    }
    if (this.beam && this.beam.warm <= 0) {
      const to = this.toPlayer(); const dist = to.length();
      if (dist < this.R + 1 && dist > 0.8 && P.pos.y < 0.7) {
        const bdir = new THREE.Vector3(Math.cos(this.beam.a), 0, -Math.sin(this.beam.a));
        const cross = Math.abs(bdir.x * to.z - bdir.z * to.x); if (cross < 0.45) ctx.hurt(this.pos, dmg);
      }
    }
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i]; m.life -= dt; const to = center.clone().sub(m.m.position); const dd = to.length();
      m.m.position.addScaledVector(to.normalize(), dt * (2.2 + this.phase * 0.4)); m.m.position.y = 1 + Math.sin(m.life * 3) * 0.2; m.core.rotation.y += dt * 3;
      let kill = m.life <= 0;
      if (dd < 0.95) { if (P.dashT > 0 || (P.vel.y < -0.5 && P.pos.y > m.m.position.y - 0.35)) { kill = true; ctx.sfx('stomp'); if (P.dashT <= 0) { P.vel.y = 10; P.jumps = 1; } } else ctx.hurt(m.m.position, 1); }
      if (kill) { ctx.burst(m.m.position, this.cfg.aura, 12, 4); this.group.remove(m.m); this.minions.splice(i, 1); }
    }
  }
}
