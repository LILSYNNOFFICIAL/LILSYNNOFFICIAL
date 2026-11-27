// Save data in localStorage: unlocked level, per-level bests, cat tokens, rewards.
const KEY = 'lsbh_save_v1';
const blank = () => ({ unlocked: 1, last: 1, levels: {}, tokens: 0, rewards: [] });
export function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s.unlocked === 'number') return Object.assign(blank(), s); } catch (e) {}
  return blank();
}
export function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
export function reset() { try { localStorage.removeItem(KEY); } catch (e) {} return blank(); }

// record a finished level; returns list of newly unlocked reward labels
export function recordLevel(s, n, res, rewardTable) {
  const prev = s.levels[n] || { hearts: 0, total: res.total, cat: false, time: null, done: false };
  const gotCatNow = res.cat && !prev.cat;
  s.levels[n] = { hearts: Math.max(prev.hearts, res.hearts), total: res.total, cat: prev.cat || res.cat, time: prev.time ? Math.min(prev.time, res.time) : res.time, done: true };
  if (gotCatNow) s.tokens += 1;
  s.unlocked = Math.max(s.unlocked, Math.min(369, n + 1));
  s.last = Math.min(369, n + 1);
  const fresh = [];
  for (const r of rewardTable || []) if (s.tokens >= r.tokens && !s.rewards.includes(r.id)) { s.rewards.push(r.id); fresh.push(r.label); }
  save(s);
  return { fresh, gotCatNow };
}
export const maxHearts = (s) => 5 + s.rewards.filter(r => r.startsWith('heart')).length;
export const trailColor = (s) => s.rewards.includes('trailRainbow') ? 'rainbow' : s.rewards.includes('trailGold') ? 0xffd23a : s.rewards.includes('trailCyan') ? 0x29e0ff : 0x9a4dff;
