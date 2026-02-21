import { Color } from '../shared/color';
import { Piece } from '../shared/piece';
import { loadFEN, startingFEN } from './fen-loader';
import { findPseudoLegalMoves, isAttacked, Move, MoveType, sameColor } from './legal-moves';

export class Board {
  turn = Color.White;
  squares: Int8Array; // 128 entries (0x88)
  legalMoves: Move[] = [];
  history: Move[] = [];

  constructor() {
    this.squares = new Int8Array(128);
  }

  restart = () => this.load(startingFEN);

  load = (fen: string) => loadFEN(fen, this.squares);

  getLegalMoves = () => {
    this.legalMoves = findPseudoLegalMoves(this).filter((x) => {
      this.makeMove(x, true);
      const isLegal = !this.isInCheck(this.turn);
      this.undoMove(x, true);
      return isLegal;
    });
  };

  makeMove(move: Move, emulate = false) {
    this.squares[move.toPos] = this.squares[move.fromPos];
    this.squares[move.fromPos] = 0;
    if (move.moveType & MoveType.Promotion) {
      this.squares[move.toPos] -= Piece.Pawn;
      this.squares[move.toPos] |= Piece.Queen;
    }
    if (move.moveType & MoveType.EnPassant) {
      const enPassantPawn = this.history[this.history.length - 1].toPos;
      this.squares[enPassantPawn] = 0;
    }

    if (emulate) return;
    this.switchTurn();
    this.history.push(move);
  }

  undoMove(move: Move, emulate = false) {
    this.squares[move.fromPos] = this.squares[move.toPos];
    if (move.moveType & MoveType.Capture) this.squares[move.toPos] = move.captured;
    else this.squares[move.toPos] = 0;
    if (move.moveType & MoveType.Promotion) {
      this.squares[move.fromPos] -= Piece.Queen;
      this.squares[move.fromPos] |= Piece.Pawn;
    }
    if (move.moveType & MoveType.EnPassant) {
      const inverseColor = sameColor(this.squares[move.fromPos], Color.White) ? Color.Black : Color.White;
      this.squares[move.captured] = Piece.Pawn | inverseColor;
    }
    if (emulate) return;
    this.switchTurn();
    this.history.pop();
  }

  isStaleMate = () => this.legalMoves.length === 0 && !this.isInCheck(this.turn);
  isCheckMate = () => this.legalMoves.length === 0 && this.isInCheck(this.turn);

  isInCheck(kingColor: Color) {
    const king = this.squares.findIndex((x) => x === (Piece.King | kingColor));
    const attacker = sameColor(kingColor, Color.White) ? Color.Black : Color.White;
    return isAttacked(this, king, attacker);
  }

  switchTurn() {
    this.turn = this.turn === Color.White ? Color.Black : Color.White;
  }
}
