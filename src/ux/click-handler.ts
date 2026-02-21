import { Application, Container, Graphics } from 'pixi.js';
import { renderHighlight, tileSize } from '../drawing/board-drawing';
import { Board } from '../logic/board';
import { drawPieces } from '../drawing/piece-drawing';

let firstPos: number | null = null;
const pieceContainer = new Container();
const highlightContainer = new Container();

export function setupClickHandling(app: Application, board: Board) {
  app.stage.addChild(highlightContainer);
  app.stage.addChild(pieceContainer);

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  app.stage.on('pointerdown', (event) => {
    const pos = event.global;
    const file = Math.floor(pos.x / tileSize);
    const rank = Math.floor(pos.y / tileSize);
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return;
    const square = (rank << 4) | file;
    handleClick(board, square);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'z') return;
    if (!board.history.length) return;
    board.undoMove(board.history[board.history.length - 1]);
    board.getLegalMoves();
    clearSelection();
    drawPieces(pieceContainer, board);
  });

  drawPieces(pieceContainer, board);
  board.getLegalMoves();
  window.baba = () => board;
}

function handleClick(board: Board, newPos: number) {
  const piece = board.squares[newPos];

  if (firstPos === null) {
    if (piece === 0) return;
    if (board.getLegalMovesFrom(newPos).length === 0) return;
    firstPos = newPos;
    renderHighlight(board, newPos, highlightContainer);
    return;
  }

  if (newPos === firstPos) {
    clearSelection();
    return;
  }

  const move = board.getLegalMovesFrom(firstPos).find((x) => x.toPos === newPos);
  if (move) {
    board.makeMove(move);
    board.getLegalMoves();
  }

  clearSelection();
  drawPieces(pieceContainer, board);
}

function clearSelection() {
  firstPos = null;
  highlightContainer.removeChildren();
}
