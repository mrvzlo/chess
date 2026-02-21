import { Container, Graphics, Poin } from 'pixi.js';
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
};

const PieceCodeMap: Record<number, string> = {
  1: 'P',
  2: 'N',
  3: 'B',
  4: 'R',
  5: 'Q',
  6: 'K',
};
