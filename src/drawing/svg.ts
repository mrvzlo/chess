export const BishopSvg = (fill: string, stroke: string) => baseSvg(bishopPath, fill, stroke);
export const KnightSvg = (fill: string, stroke: string) => baseSvg(knightPath, fill, stroke);
export const RookSvg = (fill: string, stroke: string) => baseSvg(rookPath, fill, stroke);
export const QueenSvg = (fill: string, stroke: string) => baseSvg(queenPath, fill, stroke));
export const PawnSvg = (fill: string, stroke: string) => baseSvg(pawnPath, fill, stroke);
export const KingSvg = (fill: string, stroke: string) => baseSvg(kingPath, fill, stroke);

const baseSvg = (path: string, fill: string, stroke: string) => `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"><path ${path} fill="${fill}" stroke="${stroke}" stroke-width="2"/></svg>`;

const bishopPath = 
  `d="M50 40C50 40 55 35 40 15 25 35 30 40 30 40L30 50 20 60 20 65 60 65 60 61 50 50Z"`;
const knightPath = 
  `d="M52 35C60 25 50 15 40 15 20 15 20 35 40 35L40 50 28 50 20 60 20 65 60 65 60 61 52 50 52 40Z"`;
const pawnPath = 
  `d="M50 45C60 35 50 25 40 25 30 25 20 35 30 45L30 50 20 60 20 65 60 65 60 61 50 50Z"`;
const queenPath = 
  `d="M50 40C50 40 55 35 55 15 45 25 50 25 40 15 30 25 35 25 25 15 25 35 30 40 30 40L30 50 20 60 20 65 60 65 60 61 50 50Z"`;
const rookPath = 
  `d="M20 25 30 35 30 50 20 60 20 65 60 65 60 61 50 50 50 35 60 25 60 15 52 15 52 20 44 20 44 15 36 15 36 20 28 20 28 15 20 15Z"`;
const kingPath = 
  `d="M50 40C50 40 60 15 55 15 50 10 50 25 40 15L40 15 40 25 42 25 42 30 46 30 46 34 42 34 42 43 38 43 38 34 34 34 34 30 38 30 38 25 40 25 40 15C30 25 30 10 25 15 20 15 30 40 30 40L30 50 20 60 20 65 60 65 60 61 50 50Z"`;
