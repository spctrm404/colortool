// todo: dragging does not work well

const root = document.documentElement;
const body = document.body;
const slider = document.getElementById('slider-xy');
const container = document.getElementById('slider-xy__area');
const draggable = document.getElementById('slider-xy__thumb');

let isDragging = false;
let offsetX, offsetY;
export let x, y;

export const init = () => {
  slider.addEventListener('mousedown', (e) => {
    if (e.target === draggable || draggable.contains(e.target)) {
      isDragging = true;
      draggable.classList.add('pressed');
      offsetX = e.clientX - draggable.getBoundingClientRect().left;
      offsetY = e.clientY - draggable.getBoundingClientRect().top;
      body.style.cursor = 'grabbing';
      console.log('p');
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    x = e.clientX - container.getBoundingClientRect().left - offsetX;
    y = e.clientY - container.getBoundingClientRect().top - offsetY;

    x = Math.max(0, Math.min(x, container.clientWidth - draggable.clientWidth));
    y = Math.max(
      0,
      Math.min(y, container.clientHeight - draggable.clientHeight)
    );

    root.style.setProperty('--slider-x', `${x}px`);
    root.style.setProperty('--slider-y', `${y}px`);

    console.log('d');
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    draggable.classList.remove('pressed');
    body.style.cursor = 'auto';

    console.log('u');
  });
};
