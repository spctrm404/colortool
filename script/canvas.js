import * as xySlider from './xySlider.js';
import * as culori from 'https://cdn.skypack.dev/culori';

const canvas = document.getElementById('xy-slider__canvas');
const ctx = canvas.getContext('2d', { colorSpace: 'display-p3' });
const resolutionMultiplier = 1;
const canvasWidth = xySlider.slider.clientWidth;
const canvasHeight = xySlider.slider.clientHeight;

canvas.width = Math.floor(resolutionMultiplier * canvasWidth);
canvas.height = Math.floor(resolutionMultiplier * canvasHeight);

let imageData = ctx.createImageData(canvas.width, canvas.height, {
  colorSpace: 'display-p3',
});
let data = imageData.data;

const setPixel = (data, x, y, r, g, b, a) => {
  const index = (y * imageData.width + x) * 4;
  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = a;
};

const toP3 = culori.toGamut('p3');

export const draw = () => {
  const h = 10;
  for (let x = 0; x < imageData.width; x++) {
    const l = x / (imageData.width - 1);
    for (let y = imageData.height - 1; y >= 0; y--) {
      const c = 0.4 * (1 - y / (imageData.height - 1));
      const oklch = `oklch(${l} ${c} ${h})`;
      const clampedOklch = culori.clampChroma(culori.oklch(oklch), 'oklch');
      if (clampedOklch.c < c) break;
      const p3 = toP3(clampedOklch);
      // ctx.fillStyle = `color(display-p3 ${p3.r} ${p3.g} ${p3.b})`;
      // ctx.fillRect(x, y, 1, 1);
      const idx = (y * imageData.width + x) * 4;
      data[idx] = Math.round(255 * p3.r);
      data[idx + 1] = Math.round(255 * p3.g);
      data[idx + 2] = Math.round(255 * p3.b);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = 'color(display-p3 1 0 0)';
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = 'color(display-p3 0 1 0)';
  ctx.fillRect(30, 30, 50, 50);
};
