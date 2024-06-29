import { Thumb } from './Thumb.js';

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
