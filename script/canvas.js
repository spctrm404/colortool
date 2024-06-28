import * as xySlider from './xySlider.js';

const canvas = document.getElementById('xy-slider__canvas');
const ctx = canvas.getContext('2d');
const resolutionMultiplier = 2;
const canvasWidth = xySlider.slider.clientWidth;
const canvasHeight = xySlider.slider.clientHeight;

let imageData;
let data;

const setPixel = (data, x, y, r, g, b, a) => {
  const index = (y * canvas.width + x) * 4;
  data[index] = r; // Red
  data[index + 1] = g; // Green
  data[index + 2] = b; // Blue
  data[index + 3] = a; // Alpha
};

export const setup = () => {
  canvas.width = resolutionMultiplier * canvasWidth;
  canvas.height = resolutionMultiplier * canvasHeight;

  imageData = ctx.createImageData(canvas.width, canvas.height);
  data = imageData.data;
};

export const draw = () => {
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const a = 255; // 불투명
      setPixel(data, x, y, r, g, b, a);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = 'rgb(200 0 0)';
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = 'rgb(0 0 200 / 50%)';
  ctx.fillRect(30, 30, 50, 50);
};
