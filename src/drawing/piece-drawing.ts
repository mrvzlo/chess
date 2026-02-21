import { Container, Text, TextStyle, TextStyleOptions } from 'pixi.js';
import { Board } from '../logic/board';
import { tileSize } from './board-drawing';
import { Color } from '../shared/color';

export const drawPieces = (container: Container, board: Board) => {
  container.removeChildren();
  const baseStyle: TextStyleOptions = { fontSize: 45, strokeThickness: 2 };

  for (let square = 0; square < 128; square++) {
    if (square & 0x88) continue;

    const piece = board.squares[square];
    if (piece === 0) continue;

    const rank = square >> 4;
    const file = square & 7;

    const letter = PieceCodeMap[piece & 0x07];

    const fill = piece > Color.Black ? 0x000000 : 0xffffff;
    const stroke = piece <= Color.Black ? 0x000000 : 0xffffff;
    const text = new Text({ text: letter, anchor: 0.5, style: { fill, ...baseStyle, stroke } });

    text.x = file * tileSize + tileSize / 2;
    text.y = rank * tileSize + tileSize / 2;
    container.addChild(text);
  }
};

const PieceCodeMap: Record<number, string> = {
  1: 'P',
  2: 'N',
  3: 'B',
  4: 'R',
  5: 'Q',
  6: 'K',
};
