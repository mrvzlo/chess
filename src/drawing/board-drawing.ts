import { Application, Graphics, Text, TextStyleOptions } from 'pixi.js';
import { DARK, LIGHT } from './board-colors';

const boardSize = 8;
export const tileSize = 80;

export const drawBoard = (app: Application) => {
  const board = new Graphics();

  for (let rank = 0; rank < boardSize; rank++) {
    for (let file = 0; file < boardSize; file++) {
      const isLight = (rank + file) % 2 === 0;
      const color = isLight ? LIGHT : DARK;

      board.rect(file * tileSize, rank * tileSize, tileSize, tileSize).fill(color);
    }
  }
  app.stage.addChild(board);
  const style: TextStyleOptions = { fontSize: 16, fill: 0x543322 };
  for (let i = 0; i < boardSize; i++) {
    const rank = new Text({ text: String.fromCharCode(i + 65), style });
    rank.x = i * tileSize + tileSize - +style.fontSize;
    rank.y = tileSize * boardSize - +style.fontSize - 5;
    app.stage.addChild(rank);
    const file = new Text({ text: i + 1, style });
    file.y = i * tileSize + 5;
    file.x = 5;
    app.stage.addChild(file);
  }
};
