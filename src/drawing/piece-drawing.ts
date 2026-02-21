import { Container, Graphics, Point, Text } from 'pixi.js';
import { Board } from '../logic/board';
import { tileSize } from './board-drawing';
import { Color } from '../shared/color';
import { Piece, samePiece } from '../shared/piece';
import { BishopSvg, KingSvg, KnightSvg, PawnSvg, QueenSvg, RookSvg } from './svg';

export const drawPieces = (container: Container, board: Board) => {
  container.removeChildren();

  for (let square = 0; square < 128; square++) {
    if (square & 0x88) continue;

    const piece = board.squares[square];
    if (piece === 0) continue;

    const rank = square >> 4;
    const file = square & 7;
    const fill = piece > Color.Black ? '#333' : '#fff';
    const stroke = piece <= Color.Black ? '#111' : '#111';

    const g = new Graphics();
    if (samePiece(piece, Piece.Rook)) g.svg(RookSvg(fill, stroke));
    if (samePiece(piece, Piece.Knight)) g.svg(KnightSvg(fill, stroke));
    if (samePiece(piece, Piece.Pawn)) g.svg(PawnSvg(fill, stroke));
    if (samePiece(piece, Piece.Queen)) g.svg(QueenSvg(fill, stroke));
    if (samePiece(piece, Piece.Bishop)) g.svg(BishopSvg(fill, stroke));
    if (samePiece(piece, Piece.King)) g.svg(KingSvg(fill, stroke));

    g.x = file * tileSize;
    g.y = rank * tileSize;
    g.scale = new Point(tileSize / 80, tileSize / 80);
    container.addChild(g);
  }

  if (board.isStaleMate() || board.isCheckMate()) {
    let text = '';
    if (board.isStaleMate()) text = 'Stalemate';
    if (board.isCheckMate()) text = board.turn === Color.White ? 'Black won' : 'White won';

    const g = new Graphics();
    g.alpha = 0.8;
    g.rect(2.5 * tileSize, 3.5 * tileSize, 3 * tileSize, tileSize)
      .fill(0x444444)
      .stroke(0);
    container.addChild(g);
    const alert = new Text({ text, anchor: 0.5, style: { fill: 0xeeeeee, fontSize: 45, strokeThickness: 2, stroke: 0 } });
    alert.x = 4 * tileSize;
    alert.y = 4 * tileSize;
    container.addChild(alert);
  }
};
