// 9 world themes (worlds cycle through LIL SYNN's environments). Colors are hex ints.
export const THEMES = {
  playground: { name: 'Neon Playground', sky: { tex: true, tint: 0xffffff, sun: null }, fog: [0x160826, 0.016], hemi: [0x9a7cff, 0x1a0620, 0.75], moon: [0xc8b8ff, 1.3], exposure: 1.05,
    ground: 'solid', groundTint: 0x8a8a9a, palette: [0xff2fa8, 0x29e0ff, 0x9a4dff, 0xffd23a], decor: 'playground', wall: 'brick', music: 'a' },
  alley: { name: 'Graffiti Alley', sky: { tex: false, top: 0x1a1040, bot: 0xff7a59, neb1: 0xff3fa0, neb2: 0x4a3aff, stars: 0.5, sun: null }, fog: [0x2a1030, 0.02], hemi: [0xff9a8a, 0x201030, 0.8], moon: [0xffb090, 1.1], exposure: 1.05,
    ground: 'solid', groundTint: 0x9a8090, palette: [0xff2fa8, 0x29e0ff, 0x9bff3a, 0xff8a2a], decor: 'alley', wall: 'brick', music: 'b' },
  rooftops: { name: 'Sunrise Rooftops', sky: { tex: false, top: 0x3a5aa8, bot: 0xffb36b, neb1: 0xff9ac0, neb2: 0xffe0a0, stars: 0.0, sun: [0, 0.08, -1], sunCol: 0xffd27a }, fog: [0xe0a890, 0.009], hemi: [0xffe0c8, 0x403050, 1.2], moon: [0xffd8a8, 2.0], exposure: 1.0,
    ground: 'void', floorDepth: 30, killY: -14, groundTint: 0xb0a0a0, palette: [0xffd23a, 0xff5fa8, 0x29e0ff, 0xffffff], decor: 'rooftops', wall: null, music: 'a' },
  sunset: { name: 'Sunset City', sky: { tex: false, top: 0x2a1650, bot: 0xff5a3a, neb1: 0xff8a3a, neb2: 0xb03aff, stars: 0.15, sun: [0.3, 0.05, -1], sunCol: 0xff8040 }, fog: [0x5a2a40, 0.012], hemi: [0xffa070, 0x2a1030, 1.0], moon: [0xff9a60, 1.8], exposure: 1.0,
    ground: 'solid', groundTint: 0xa08070, palette: [0xff8a2a, 0xff2fa8, 0x9a4dff, 0xffd23a], decor: 'city', wall: null, music: 'b' },
  rain: { name: 'Rainy Neon Street', sky: { tex: true, tint: 0x6a7aa8, sun: null }, fog: [0x0a1024, 0.024], hemi: [0x6a8aff, 0x080818, 0.7], moon: [0x9ab8ff, 0.9], exposure: 1.1,
    ground: 'solid', groundTint: 0x7a8aa8, palette: [0x29e0ff, 0xff2fa8, 0x3a6bff, 0x9a4dff], decor: 'rain', wall: 'brick', rain: true, music: 'a' },
  underground: { name: 'Underground Relics', sky: { tex: false, top: 0x050308, bot: 0x1a0c08, neb1: 0x3a1a08, neb2: 0x0a2a2a, stars: 0.0, sun: null }, fog: [0x120a06, 0.03], hemi: [0xff9a50, 0x080404, 0.6], moon: [0xffb070, 0.6], exposure: 1.15,
    ground: 'solid', groundTint: 0x7a6a5a, palette: [0xff8a2a, 0x2affd0, 0xffd23a, 0xff3a5a], decor: 'underground', wall: 'stone', music: 'b' },
  archive: { name: 'Archive Vault', sky: { tex: false, top: 0x0a0a1a, bot: 0x1a2040, neb1: 0x2a4aff, neb2: 0x29e0ff, stars: 0.3, sun: null }, fog: [0x0c1020, 0.022], hemi: [0x8ab0ff, 0x0a0a14, 0.8], moon: [0xb0c8ff, 1.0], exposure: 1.1,
    ground: 'solid', groundTint: 0x8090a8, palette: [0x29e0ff, 0xffffff, 0x3a6bff, 0xffd23a], decor: 'archive', wall: 'metal', music: 'a' },
  nebula: { name: 'Nebula Path', sky: { tex: true, tint: 0xffd0ff, sun: null }, fog: [0x100828, 0.01], hemi: [0xb08aff, 0x100420, 0.9], moon: [0xe0c0ff, 1.2], exposure: 1.1,
    ground: 'void', floorDepth: 0.7, killY: -12, groundTint: 0x9a8ab0, palette: [0x9a4dff, 0xff2fa8, 0x29e0ff, 0xffffff], decor: 'nebula', wall: null, music: 'b' },
  portal: { name: 'Cosmic Portal', sky: { tex: false, top: 0x02101a, bot: 0x2a0440, neb1: 0x00ffd0, neb2: 0xff2fd0, stars: 1.0, sun: null }, fog: [0x0a0418, 0.01], hemi: [0x8affe0, 0x200030, 0.9], moon: [0xd0fff0, 1.2], exposure: 1.1,
    ground: 'void', floorDepth: 0.7, killY: -12, groundTint: 0x8ab0b0, palette: [0x00ffd0, 0xff2fd0, 0xffd23a, 0x8a5aff], decor: 'portal', wall: null, music: 'a' },
};
export const WORLD_THEMES = ['playground', 'alley', 'rooftops', 'sunset', 'rain', 'underground', 'archive', 'nebula', 'portal'];
export const LEVELS_PER_WORLD = 41;
export const TOTAL_LEVELS = 369;
export const worldOf = (n) => Math.floor((n - 1) / LEVELS_PER_WORLD); // 0..8
export const levelInWorld = (n) => ((n - 1) % LEVELS_PER_WORLD) + 1; // 1..41
export const isBossLevel = (n) => n % LEVELS_PER_WORLD === 0;
export const themeFor = (n) => THEMES[WORLD_THEMES[worldOf(n)]];
// difficulty 0..1: sawtooth inside each world on top of a global ramp
export function difficulty(n) {
  const w = worldOf(n), k = (levelInWorld(n) - 1) / 40;
  return Math.min(1, 0.08 + w * 0.09 + k * 0.28);
}
