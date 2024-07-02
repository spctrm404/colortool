import { displayable, toGamut } from 'https://cdn.skypack.dev/culori';

class Gamut {
  static toP3 = toGamut('p3', 'oklch', null);

  constructor(
    canvasSelector,
    canvasContainerSelector,
    hueFrom,
    hueTo,
    resolutionMultiplier = 1
  ) {
    this.canvas = document.body.querySelector(canvasSelector);
    const canvasContainer = document.body.querySelector(
      canvasContainerSelector
    );
    this.setCanvasSize(canvasContainer, resolutionMultiplier);

    this.ctx = this.canvas.getContext('2d', { colorSpace: 'display-p3' });

    this.hueFrom = hueFrom ? hueFrom : randomHue;
    this.hueTo = hueFrom ? (hueTo ? hueTo : this.hueFrom) : randomHue;

    this.renderLCGradient(this.hueFrom, this.hueTo);
  }

  setCanvasSize = (canvasContainer, resolutionMultiplier = 1) => {
    this.canvas.width = Math.floor(
      resolutionMultiplier * canvasContainer.clientWidth
    );
    this.canvas.height = Math.floor(
      resolutionMultiplier * canvasContainer.clientHeight
    );
  };

  renderLCGradient(hueFrom, hueTo) {
    const imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height,
      {
        colorSpace: 'display-p3',
      }
    );

    for (let x = 0; x < imageData.width; x++) {
      const lightness = this.getLightnessFromX(x, imageData.width);
      const hue = this.getHueFromX(x, imageData.width, hueFrom, hueTo);

      let isInSrgb = true;
      let wasInSrgb = true;
      for (let y = imageData.height - 1; y >= 0; y--) {
        const chroma = this.getChromaFromY(y, imageData.height);

        const color = `oklch(${lightness} ${chroma} ${hue})`;
        const p3Color = Gamut.toP3(color);

        if (c <= p3Color.c) break;

        isInSrgb = displayable(color);

        const idx = (y * imageData.width + x) * 4;
        if (!isInSrgb && isInSrgb !== wasInSrgb) {
          imageData.data[idx] = 255;
          imageData.data[idx + 1] = 255;
          imageData.data[idx + 2] = 255;
          imageData.data[idx + 3] = 255;
        } else {
          imageData.data[idx] = Math.round(255 * p3Color.r);
          imageData.data[idx + 1] = Math.round(255 * p3Color.g);
          imageData.data[idx + 2] = Math.round(255 * p3Color.b);
          imageData.data[idx + 3] = 255;
        }

        wasInSrgb = isInSrgb;
      }
    }
    return imageData;
  }

  getLightnessFromX = (x, width) => {
    return x / (width - 1);
  };

  getHueFromX = (x, width, hueFrom, hueTo) => {
    return (
      hueFrom +
      (x *
        (hueTo > hueFrom ? hueTo - hueFrom : (hueTo + 360 - hueFrom) % 360)) /
        (width - 1)
    );
  };

  getChromaFromY = (y, height) => {
    return 1 - y / (height - 1);
  };

  draw = () => {
    this.ctx.putImageData(this.imageData, 0, 0);
  };
}
