import { Application, Container } from 'pixi.js';
import { drawBoard } from './drawing/board-drawing';
import { Board } from './logic/board';
import { setupClickHandling } from './ux/click-handler';

export async function runApp() {
  console.time('start');
  const app = new Application();
  await app.init({ background: '#555', resizeTo: window });
  document.body.appendChild(app.canvas);
  console.timeEnd('start');
  drawBoard(app);
  const board = new Board();
  board.restart();
  setupClickHandling(app, board);
}

runApp();
