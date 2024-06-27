import * as colour from './colour.js';

const root = document.documentElement;
const inputSliders = document.body.querySelectorAll('.lch-slider__input');
export const values = { l: 0.7, c: 0.3, h: 0 };

export const init = () => {
  inputSliders.forEach((aSlider) => {
    const variableName = aSlider.dataset.variableName;
    aSlider.value = values[variableName];

    root.style.setProperty(aSlider.dataset.cssProperty, values[variableName]);

    aSlider.addEventListener('input', (e) => {
      const dom = e.currentTarget;
      const variableName = dom.dataset.variableName;
      values[variableName] = parseFloat(dom.value);

      root.style.setProperty(dom.dataset.cssProperty, values[variableName]);

      colour.testFunc(values);
    });
  });

  colour.testFunc(values);
};
