import * as gui from './gui.js';
import * as culori from 'https://cdn.skypack.dev/culori';

gui.init();

// const preMap = new Map();
// const hRes = 36;
// const lRes = 100;
// for (let hCnt = 0; hCnt <= hRes; hCnt++) {
//   const h = (360 / hRes) * hCnt;
//   let cMax = 0;
//   let lAtCMax = 0;
//   for (let lCnt = 0; lCnt <= lRes; lCnt++) {
//     const l = (1 / lRes) * lCnt;
//     const unclamped = {
//       mode: 'oklch',
//       l: l,
//       c: 0.4,
//       h: h,
//       alpha: 1,
//     };
//     const clamped = culori.clampChroma(unclamped, 'oklch');
//     const prevCMax = cMax;
//     cMax = Math.max(cMax, clamped.c);
//     if (cMax != prevCMax) lAtCMax = clamped.l;
//     if (clamped.c < prevCMax) break;
//   }
//   preMap.set(h, { c: cMax, l: lAtCMax });
// }

// console.log(preMap);
