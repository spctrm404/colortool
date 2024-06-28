const root = document.documentElement;
const body = document.body;
export const slider = document.getElementById('xy-slider');
export const container = document.getElementById('xy-slider__area');
export const draggable = document.getElementById('xy-slider__thumb');

const preventDefaultEventList = [
  'mousemove',
  'dragstart',
  'selectstart',
  'contextmenu',
  'touchstart',
  'touchmove',
  'touchend',
  'wheel',
];

export let isDragging = false;
export let offsetX, offsetY;
export let x, y;
export let normX, normY;

const dragging = (e) => {
  x = e.clientX - container.getBoundingClientRect().left - offsetX;
  y = e.clientY - container.getBoundingClientRect().top - offsetY;

  x = Math.max(0, Math.min(x, container.clientWidth - draggable.clientWidth));
  y = Math.max(0, Math.min(y, container.clientHeight - draggable.clientHeight));

  normX = x / (container.clientWidth - draggable.clientWidth);
  normY = y / (container.clientHeight - draggable.clientHeight);

  root.style.setProperty('--slider-x', `${x}px`);
  root.style.setProperty('--slider-y', `${y}px`);
};

const setNormalPos = () => {
  normX = x / (container.clientWidth - draggable.clientWidth);
  normY = y / (container.clientHeight - draggable.clientHeight);
};

const preventDefault = (e) => {
  e.preventDefault();
};

const preventDefaultEvents = () => {
  preventDefaultEventList.forEach((eventName) => {
    document.addEventListener(eventName, preventDefault);
  });
};

const allowDefaultEvents = () => {
  preventDefaultEventList.forEach((eventName) => {
    document.removeEventListener(eventName, preventDefault);
  });
};

const pointerDown = (e) => {
  if (e.target !== draggable && !draggable.contains(e.target)) return;
  isDragging = true;
  draggable.classList.add('pressed');

  body.style.cursor = 'grabbing';

  offsetX = e.clientX - draggable.getBoundingClientRect().left;
  offsetY = e.clientY - draggable.getBoundingClientRect().top;

  dragging(e);
  setNormalPos();

  preventDefaultEvents();
  document.addEventListener('pointermove', pointerMove);

  console.log('p');
};

const pointerMove = (e) => {
  if (!isDragging) return;
  dragging(e);
  setNormalPos();

  console.log('d');
};

const pointerUp = (e) => {
  if (!isDragging) return;
  isDragging = false;
  draggable.classList.remove('pressed');

  body.style.cursor = 'auto';

  dragging(e);
  setNormalPos();

  allowDefaultEvents();
  document.removeEventListener('pointermove', pointerMove);

  console.log('u');
};

export const init = () => {
  slider.addEventListener('pointerdown', pointerDown);

  document.addEventListener('pointerup', pointerUp);
};
