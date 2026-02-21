import { Color } from '../shared/color';
import { Piece } from '../shared/piece';

export const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function loadFEN(fen: string, squares: Int8Array) {
  squares.fill(0);

  const [placement] = fen.split(' ');
  const rows = placement.split('/');

  if (rows.length !== 8) {
    throw new Error('Invalid FEN');
  }

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    const row = rows[rank];

    for (const char of row) {
      if (!isNaN(Number(char))) {
        file += Number(char);
        continue;
      }
      const square = (rank << 4) | file;
      squares[square] = pieceCharToCode(char);
      file++;
    }
  }
}

function pieceCharToCode(char: string): number {
  const isWhite = char === char.toUpperCase();
  const pieceMap: Record<string, Piece> = {
    p: Piece.Pawn,
    n: Piece.Knight,
    b: Piece.Bishop,
    r: Piece.Rook,
    q: Piece.Queen,
    k: Piece.King,
  };

  const piece = pieceMap[char.toLowerCase()];
  if (!piece) throw new Error(`Invalid piece: ${char}`);

  return isWhite ? piece | Color.White : piece | Color.Black;
}
