import { Thumb } from './Thumb.js';
import { GamutCanvas } from './GamutCanvas.js';

let isRanged = false;

const xySlider = new Thumb(
  '.color-picker__xy__area',
  '.color-picker__xy__thumb',
  new Map([
    ['cssVarX', 'x'],
    ['cssVarY', 'y'],
  ])
);
const rangeSliderFrom = new Thumb(
  '.color-picker__z__area',
  '.color-picker__z__thumb-from',
  new Map([['cssVarZFrom', 'y']])
);
// console.log(document.body.querySelector('.color-picker__z__area').dataset);
const rangeSliderTo = new Thumb(
  '.color-picker__z__area',
  '.color-picker__z__thumb-to',
  new Map([['cssVarZTo', 'y']])
);

const gamutCanvas = new GamutCanvas(
  '.color-picker__xy__canvas',
  '.color-picker__xy'
);

gamutCanvas.render();
xySlider.addCallback(gamutCanvas.updateChromaMax, 'during');
xySlider.addCallback(gamutCanvas.updateLightnessAtChromaMax, 'during');
rangeSliderFrom.addCallback(gamutCanvas.updateHueFrom, 'end');
rangeSliderTo.addCallback(gamutCanvas.updateHueTo, 'end');
