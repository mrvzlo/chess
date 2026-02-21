import { Color } from './color';

export enum Piece {
  None,
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
  Mask,
}

export const sameColor = (a: number, b: number) => (a & Color.Black) === (b & Color.Black);
export const samePiece = (a: number, b: number) => (a & Piece.Mask) === (b & Piece.Mask);
