import * as culori from 'https://cdn.skypack.dev/culori';

export const testFunc = (oklchVal) => {
  console.log(oklchVal);

  const inputColour = `oklch(${oklchVal.l} ${oklchVal.c} ${oklchVal.h})`;
  console.log(`inputColour`, inputColour);

  const displayable = culori.displayable(inputColour);
  console.log(`displayable`, displayable);

  const clampChroma = culori.clampChroma(culori.oklch(inputColour), 'oklch');
  console.log(`clampChroma`, clampChroma);

  const toP3 = culori.toGamut('p3');
  const p3 = toP3(culori.oklch(inputColour));
  console.log(`p3`, p3);

  const p3Clamped = toP3(clampChroma);
  console.log(`p3Clamped`, p3Clamped);
};
