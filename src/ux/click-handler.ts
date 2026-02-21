import { Application, Container, Graphics } from 'pixi.js';
import { tileSize } from '../drawing/board-drawing';
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
    if (getLegalMovesFrom(board, newPos).length === 0) return;
    firstPos = newPos;
    renderHighlight(board, newPos);
    return;
  }

  if (newPos === firstPos) {
    clearSelection();
    return;
  }

  const move = getLegalMovesFrom(board, firstPos).find((x) => x.toPos === newPos);
  if (move) {
    board.makeMove(move);
    board.getLegalMoves();
  }

  clearSelection();
  drawPieces(pieceContainer, board);
}

function renderHighlight(board: Board, square: number) {
  highlightContainer.removeChildren();
  const rank = square >> 4;
  const file = square & 7;
  const g = new Graphics();
  g.rect(file * tileSize, rank * tileSize, tileSize, tileSize).fill(0xc59873);
  getLegalMovesFrom(board, square).forEach((x) => {
    const toRank = x.toPos >> 4;
    const toFile = x.toPos & 7;
    const size = tileSize / 4;
    g.ellipse(toFile * tileSize + size * 2, toRank * tileSize + size * 2, size, size).fill(0xc59873);
  });
  highlightContainer.addChild(g);
}

const getLegalMovesFrom = (board: Board, from: number) => board.legalMoves.filter((x) => x.fromPos === from);

function clearSelection() {
  firstPos = null;
  highlightContainer.removeChildren();
}
