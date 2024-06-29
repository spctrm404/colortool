import * as xySlider from './colorPicker.js';
import * as culori from 'https://cdn.skypack.dev/culori';

const canvas = document.getElementById('xy-slider__canvas');
const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
const RESOLUTIONMULTIPLIER = 1;
const CHROMAP3LIMIT = 0.4;
const canvasWidth = xySlider.slider.clientWidth;
const canvasHeight = xySlider.slider.clientHeight;

canvas.width = Math.floor(RESOLUTIONMULTIPLIER * canvasWidth);
canvas.height = Math.floor(RESOLUTIONMULTIPLIER * canvasHeight);

let imageData = ctx.createImageData(canvas.width, canvas.height, {
  colorSpace: 'display-p3',
});
let data = imageData.data;

const toP3 = culori.toGamut('p3');
const inRgb = culori.inGamut('rgb');

export const draw = () => {
  const hBegin = 270;
  const hEnd = 270;
  for (let x = 0; x < imageData.width; x++) {
    const h = ((hEnd - hBegin) * x) / (imageData.width - 1) + hBegin;
    const l = x / (imageData.width - 1);
    let isInSrgb = true;
    let wasInSrgb = true;
    for (let y = imageData.height - 1; y >= 0; y--) {
      const c = CHROMAP3LIMIT * (1 - y / (imageData.height - 1));

      const oklch = `oklch(${l} ${c} ${h})`;

      const clampedOklch = culori.clampChroma(oklch, 'oklch');
      if (c > clampedOklch.c) break;
      let p3 = toP3(oklch);

      const idx = (y * imageData.width + x) * 4;

      isInSrgb = inRgb(oklch);
      if (!isInSrgb) {
        console.log('a');
      }
      if (!isInSrgb) {
        console.log('b');
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      } else {
        data[idx] = Math.round(255 * p3.r);
        data[idx + 1] = Math.round(255 * p3.g);
        data[idx + 2] = Math.round(255 * p3.b);
        data[idx + 3] = 255;
      }

      wasInSrgb = isInSrgb;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = 'color(display-p3 1 0 0)';
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = 'color(display-p3 0 1 0)';
  ctx.fillRect(30, 30, 50, 50);
};
