import * as culori from 'https://cdn.skypack.dev/culori';

export class GamutCanvas {
  static CHROMAP3LIMIT = 0.4;
  static toP3 = culori.toGamut('p3');
  static inRgb = culori.inGamut('rgb');

  constructor(
    canvasSelector,
    canvasContainerSelector,
    RESOLUTIONMULTIPLIER = 1
  ) {
    this.canvas = document.body.querySelector(canvasSelector);
    this.ctx = this.canvas.getContext('2d', { colorSpace: 'display-p3' });
    this.canvasContainer = document.body.querySelector(canvasContainerSelector);
    this.RESOLUTIONMULTIPLIER = 1;
    this.imageData = null;
    this.hueFrom = 0;
    this.hueTo = 180;
    this.chromaMax = 0.2;
    this.lightnessAtChromaMax = 0.5;
    this.init();
  }

  init = () => {
    this.canvas.width = Math.floor(
      this.RESOLUTIONMULTIPLIER * this.canvasContainer.clientWidth
    );
    this.canvas.height = Math.floor(
      this.RESOLUTIONMULTIPLIER * this.canvasContainer.clientHeight
    );
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height,
      {
        colorSpace: 'display-p3',
      }
    );
  };

  updateHueFrom = (thumb) => {
    this.hueFrom = 360 * thumb.getNormal().y;
    this.render();
  };

  updateHueTo = (thumb) => {
    this.hueTo = 360 * thumb.getNormal().y;
    this.render();
  };

  updateChromaMax = (thumb) => {
    this.chromaMax = 1 - thumb.getNormal().y;
    this.render(false);
  };

  updateLightnessAtChromaMax = (thumb) => {
    this.lightnessAtChromaMax = thumb.getNormal().x;
    this.render(false);
  };

  renderLCGradient = (hueFrom, hueTo) => {
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height,
      {
        colorSpace: 'display-p3',
      }
    );
    for (let x = 0; x < this.imageData.width; x++) {
      const h =
        hueTo >= hueFrom
          ? ((hueTo - hueFrom) * x) / (this.imageData.width - 1) + hueFrom
          : (((hueTo + 360 - hueFrom) * x) / (this.imageData.width - 1) +
              hueFrom) %
            360;
      const l = x / (this.imageData.width - 1);

      let isInSrgb = true;
      let wasInSrgb = true;
      for (let y = this.imageData.height - 1; y >= 0; y--) {
        const c =
          GamutCanvas.CHROMAP3LIMIT * (1 - y / (this.imageData.height - 1));

        const oklch = `oklch(${l} ${c} ${h})`;
        const clampedOklch = culori.clampChroma(oklch, 'oklch');
        if (c > clampedOklch.c) break;

        const p3 = GamutCanvas.toP3(oklch);
        isInSrgb = GamutCanvas.inRgb(oklch);

        const idx = (y * this.imageData.width + x) * 4;
        if (!isInSrgb && isInSrgb !== wasInSrgb) {
          this.imageData.data[idx] = 255;
          this.imageData.data[idx + 1] = 255;
          this.imageData.data[idx + 2] = 255;
          this.imageData.data[idx + 3] = 255;
        } else {
          this.imageData.data[idx] = Math.round(255 * p3.r);
          this.imageData.data[idx + 1] = Math.round(255 * p3.g);
          this.imageData.data[idx + 2] = Math.round(255 * p3.b);
          this.imageData.data[idx + 3] = 255;
        }

        wasInSrgb = isInSrgb;
      }
    }
  };

  renderIntersections = (num) => {
    const rectSize = 8;
    const a = 0;
    const b = this.canvas.height;
    const c = this.canvas.width * this.lightnessAtChromaMax;
    const d = this.canvas.height * (1 - this.chromaMax);
    const e = this.canvas.width;
    const f = this.canvas.height;
    this.ctx.fillStyle = 'color(display-p3 0 0 0)';
    this.ctx.fillRect(
      -0.5 * rectSize,
      this.canvas.height - 0.5 * rectSize,
      rectSize,
      rectSize
    );
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(
      -0.5 * rectSize,
      this.canvas.height - 0.5 * rectSize,
      rectSize,
      rectSize
    );
    for (let n = 1; n < num + 1; n++) {
      const x = (n * this.canvas.width) / (num + 1);
      let y;
      if (x < c) {
        y = ((d - b) / (c - a)) * x + (b - ((d - b) / (c - a)) * a);
      } else {
        y = ((f - d) / (e - c)) * x + (d - ((f - d) / (e - c)) * c);
      }
      const lightness = x / (this.canvas.width - 1);
      const chroma =
        GamutCanvas.CHROMAP3LIMIT * (1 - y / (this.canvas.height - 1));
      const hue =
        this.hueTo >= this.hueFrom
          ? ((this.hueTo - this.hueFrom) * x) / (this.canvas.width - 1) +
            this.hueFrom
          : (((this.hueTo + 360 - this.hueFrom) * x) / (this.canvas.width - 1) +
              this.hueFrom) %
            360;
      const oklch = `oklch(${lightness} ${chroma} ${hue})`;
      const clampedOklch = culori.clampChroma(oklch, 'oklch');
      const p3 = GamutCanvas.toP3(oklch);
      this.ctx.fillStyle = `color(display-p3 ${p3.r} ${p3.g} ${p3.b})`;
      this.ctx.fillRect(
        x - 0.5 * rectSize,
        y - 0.5 * rectSize,
        rectSize,
        rectSize
      );
      this.ctx.strokeStyle = chroma <= clampedOklch.c ? 'white' : 'red';
      this.ctx.strokeRect(
        x - 0.5 * rectSize,
        y - 0.5 * rectSize,
        rectSize,
        rectSize
      );
    }
    this.ctx.fillStyle = 'color(display-p3 1 1 1)';
    this.ctx.fillRect(
      this.canvas.width - 0.5 * rectSize,
      this.canvas.height - 0.5 * rectSize,
      rectSize,
      rectSize
    );
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(
      this.canvas.width - 0.5 * rectSize,
      this.canvas.height - 0.5 * rectSize,
      rectSize,
      rectSize
    );
  };

  render = (renderGradient = true) => {
    if (renderGradient) this.renderLCGradient(this.hueFrom, this.hueTo);
    this.ctx.putImageData(this.imageData, 0, 0);

    // this.ctx.fillStyle = 'color(display-p3 1 0 0)';
    // this.ctx.fillRect(10, 10, 50, 50);

    // this.ctx.fillStyle = 'color(display-p3 0 1 0)';
    // this.ctx.fillRect(30, 30, 50, 50);

    this.ctx.strokeStyle = 'color(display-p3 1 1 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);
    this.ctx.lineTo(
      this.canvas.width * this.lightnessAtChromaMax,
      this.canvas.height * (1 - this.chromaMax)
    );
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.stroke();

    this.renderIntersections(20);
  };
}
