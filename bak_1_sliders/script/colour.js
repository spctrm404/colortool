import * as culori from 'https://cdn.skypack.dev/culori';

export const testFunc = (oklchVal) => {
  // console.log(oklchVal);

  const inputColour = `oklch(${oklchVal.l} ${oklchVal.c} ${oklchVal.h})`;
  console.log(`inputColour`, inputColour);

  console.log(culori.parse(inputColour));

  const displayableRgb = culori.displayable(inputColour);
  console.log(`displayableRgb`, displayableRgb);

  const inP3 = culori.inGamut('p3');
  const displayableP3 = inP3(inputColour);
  console.log(`displayableP3`, displayableP3);

  const clampChroma = culori.clampChroma(culori.oklch(inputColour), 'oklch');
  // console.log(`clampChroma`, clampChroma);

  const toP3 = culori.toGamut('p3');
  const p3 = toP3(culori.oklch(inputColour));
  // console.log(`p3`, p3);

  const p3Clamped = toP3(clampChroma);
  // console.log(`p3Clamped`, p3Clamped);
};
