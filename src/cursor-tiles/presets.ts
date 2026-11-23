import { Color } from 'three';

const DEFAULT = {
  pointer: {
    ease: 0.2,
  },
  flow: {
    radius: 0.04,
    decay: 0.05,
  },
  dye: {
    color: new Color(1, 1, 1),
    strength: 0.01,
  },
  aberration: {
    strength: 0.1,
  },
  scene: {
    distortion: 0.015,
    blocks: 15,
  },
};

export const PRESETS = { DEFAULT };
