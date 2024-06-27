import * as culori from 'https://cdn.skypack.dev/culori';

export const testFunc = (oklchVal) => {
  console.log(oklchVal);
  const inputColour = `oklch(${oklchVal.l} ${oklchVal.c} ${oklchVal.h})`;
  console.log(`inputColour`, inputColour);
  const displayable = culori.displayable(inputColour);
  console.log(`displayable`, displayable);
  // console.log(culori.clampChroma(inputColour, 'display-p3'));
};
