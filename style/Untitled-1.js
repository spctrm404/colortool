const draggingZ = (e, isHorizon, isMin, isRange = true) => {
  if (isHorizon) {
    zPos[isMin ? 0 : 1] =
      e.clientX - containerRange.getBoundingClientRect().left - zOffset.x;
    zPos[isMin ? 0 : 1] = Math.max(
      0,
      Math.min(
        zPos[isMin ? 0 : 1],
        containerRange.clientWidth - isMin
          ? draggableFrom.clientWidth
          : draggableTo.clientWidth
      )
    );
    root.style.setProperty(
      isMin ? '--slider-min' : '--slider-max',
      `${zPos[isMin ? 0 : 1]}px`
    );
  } else {
    zPos[isMin ? 0 : 1] =
      e.clientY - containerRange.getBoundingClientRect().top - zOffset.y;
    zPos[isMin ? 0 : 1] = Math.max(
      0,
      Math.min(
        zPos[isMin ? 0 : 1],
        containerRange.clientHeight - isMin
          ? draggableFrom.clientHeight
          : draggableTo.clientHeight
      )
    );
    root.style.setProperty(
      isMin ? '--slider-min' : '--slider-max',
      `${zPos[isMin ? 0 : 1]}px`
    );
  }
};

const setZNormal = () => {
  zNorm.x = zPos.x / (containerRange.clientWidth - draggableFrom.clientWidth);
  zNorm.y = zPos.y / (containerRange.clientHeight - draggableFrom.clientHeight);
};

const pointerDownZ = (e) => {
  if (e.target !== draggableFromFrom && !draggableFromFrom.contains(e.target))
    return;
  isZDragging = true;
  draggableFromFrom.classList.add('pressed');

  body.style.cursor = 'grabbing';

  zOffset.x = e.clientX - draggableFromFrom.getBoundingClientRect().left;
  zOffset.y = e.clientY - draggableFromFrom.getBoundingClientRect().top;

  draggingZ(e);
  setZNormal();

  preventDefaultEvents();
  document.addEventListener('pointermove', pointerMoveZ);
  document.addEventListener('pointerup', pointerUpZ);
};

const pointerMoveZ = (e) => {
  if (!isZDragging) return;
  draggingZ(e);
  setZNormal();
};

const pointerUpZ = (e) => {
  if (!isZDragging) return;
  isZDragging = false;
  draggableFromFrom.classList.remove('pressed');

  body.style.cursor = 'auto';

  draggingZ(e);
  setZNormal();

  allowDefaultEvents();
  document.removeEventListener('pointermove', pointerMoveZ);
  document.removeEventListener('pointerup', pointerUpZ);
};
