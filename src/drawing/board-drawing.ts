import { Application, Container, Graphics, Text, TextStyleOptions } from 'pixi.js';
import { DARK, LIGHT } from './board-colors';

const boardSize = 8;
export const tileSize = 100;

export const drawBoard = (app: Application) => {
  const board = new Graphics();

  for (let rank = 0; rank < boardSize; rank++) {
    for (let file = 0; file < boardSize; file++) {
      const isLight = (rank + file) % 2 === 0;
      const color = isLight ? LIGHT : DARK;

      board.rect(file * tileSize, rank * tileSize, tileSize, tileSize).fill(color);
    }
  }
  for (let rank = 0; rank < boardSize; rank++) {
    board.rect(0, rank * tileSize - 1, tileSize * boardSize, 2).fill(0x000);
    board.rect(rank * tileSize - 1, 0, 2, tileSize * boardSize).fill(0x000);
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

export const renderHighlight = (board: Board, square: number, container: Container) => {
  container.removeChildren();
  const rank = square >> 4;
  const file = square & 7;
  const g = new Graphics();
  g.alpha = 0.5;
  g.rect(file * tileSize + 1, rank * tileSize + 1, tileSize - 2, tileSize - 2).fill(0xaaccaa);
  board.getLegalMovesFrom(square).forEach((x) => {
    const toRank = x.toPos >> 4;
    const toFile = x.toPos & 7;
    const size = tileSize / 3;
    g.ellipse(toFile * tileSize + size * 1.5, toRank * tileSize + size * 1.5, size, size)
      .fill(0xaaccaa)
      .stroke(0);
  });
  container.addChild(g);
};
