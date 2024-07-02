import { displayable, toGamut } from 'https://cdn.skypack.dev/culori';

class Palette {
  static toP3 = toGamut('p3', 'oklch', null);

  constructor(lightnessAtChromaMax, chromaMax, hueFrom, hueTo) {
    this.lightnessAtChromaMax = lightnessAtChromaMax;
    this.chromaMax = chromaMax;

    let randomHue;
    if (hueFrom) randomHue = Math.random() * 360;
    this.hueFrom = hueFrom ? hueFrom : randomHue;
    this.hueTo = hueFrom ? (hueTo ? hueTo : this.hueFrom) : randomHue;
  }

  getChips = (totalChipNum) => {
    const map = new Map();

    for (let n = 0; n <= totalChipNum; n++) {
      const aChip = this.getAChip(n, totalChipNum);
      map.set(aChip.l, aChip);
    }

    return map;
  };

  getAChip = (idx, totalChipNum) => {
    if (idx < 0 || totalChipNum < 1) return null;

    if (idx === 0)
      return {
        mode: `oklch`,
        l: 0,
        c: 0,
        h: this.hueFrom,
        inP3: true,
        inSrgb: true,
      };

    if (idx === totalChipNum)
      return {
        mode: `oklch`,
        l: 1,
        c: 0,
        h: this.hueTo,
        inP3: true,
        inSrgb: true,
      };

    const lightness = idx / (totalChipNum + 1);

    const alpha = lightness / this.lightnessAtChromaMax;
    const chroma =
      alpha <= 1
        ? alpha * this.chromaMax
        : this.chromaMax - alpha * this.chromaMax;

    const hue =
      this.hueFrom +
      (idx *
        (this.hueTo > this.hueFrom
          ? this.hueTo - this.hueFrom
          : (this.hueTo + 360 - this.hueFrom) % 360)) /
        (totalChipNum + 1);

    const color = `oklch(${lightness} ${chroma} ${hue})`;
    const p3Color = Palette.toP3(color);
    const inP3 = c <= p3Color.c;
    const inSrgb = displayable(color);

    return {
      mode: `oklch`,
      l: lightness,
      c: chroma,
      h: hue,
      inP3: inP3,
      inSrgb: inSrgb,
    };
  };

  setLightnessAtChromaMax = (lightnessAtChromaMax) => {
    this.lightnessAtChromaMax = lightnessAtChromaMax;
  };

  setChromaMax = (chromaMax) => {
    this.chromaMax = chromaMax;
  };

  setHueFrom = (hueFrom) => {
    this.hueFrom = hueFrom;
  };

  setHueTo = (hueTo) => {
    this.hueTo = hueTo;
  };
}
