import { Color } from '../shared/color';
import { Piece } from '../shared/piece';
import { Board } from './board';
import { bishopOffsets, kingOffsets, knightOffsets, queenOffsets, rookOffsets } from './offsets';

export interface Move {
  fromPos: number;
  toPos: number;
  moveType: MoveType;
  captured: number;
}

export enum MoveType {
  Illegal = -1,
  PseudoLegal = 0,
  Capture = 1,
  Promotion = 2,
  PawnJump = 4,
  EnPassant = 8,
}

export function findPseudoLegalMoves(board: Board) {
  const result: Move[] = [];
  const lastMove = board.history[board.history.length - 1];
  const enPassant = lastMove && lastMove.moveType === MoveType.PawnJump ? lastMove.toPos : 0x88;
  for (let i = 0; i < board.squares.length; i++) {
    const piece = board.squares[i];
    if (piece === Piece.None || i & 0x88) continue;
    if (!sameColor(piece, board.turn)) continue; // binary sum check of piece color vs current color
    if (samePiece(piece, Piece.Pawn)) getPawnMoves(i, board.squares, result, enPassant);
    if (samePiece(piece, Piece.Knight)) getSingleMoves(i, board.squares, result, knightOffsets);
    if (samePiece(piece, Piece.Bishop)) getLinearMoves(i, board.squares, result, bishopOffsets);
    if (samePiece(piece, Piece.Rook)) getLinearMoves(i, board.squares, result, rookOffsets);
    if (samePiece(piece, Piece.Queen)) getLinearMoves(i, board.squares, result, queenOffsets);
    if (samePiece(piece, Piece.King)) getSingleMoves(i, board.squares, result, kingOffsets);
  }

  return result;
}

export function isAttacked(board: Board, target: number, attacker: Color) {
  const squares = board.squares;

  // 1. Pawn attacks
  const pawnDir = attacker === Color.White ? 16 : -16;
  const pawnOffsets = [pawnDir - 1, pawnDir + 1];
  for (const offset of pawnOffsets) {
    const to = target + offset;
    if (to & 0x88) continue;
    const piece = squares[to];
    if (sameColor(piece, attacker) && samePiece(piece, Piece.Pawn)) return true;
  }

  // 2. Knight attacks
  for (const offset of knightOffsets) {
    const to = target + offset;
    if (to & 0x88) continue;
    const piece = squares[to];
    if (sameColor(piece, attacker) && samePiece(piece, Piece.Knight)) return true;
  }

  // 3. Sliding pieces: bishop / rook / queen
  for (const offset of bishopOffsets) {
    let to = target + offset;
    while (!(to & 0x88)) {
      const piece = squares[to];
      if (piece !== Piece.None) {
        if (sameColor(piece, attacker) && (samePiece(piece, Piece.Bishop) || samePiece(piece, Piece.Queen))) return true;
        break; // blocked by any piece
      }
      to += offset;
    }
  }

  for (const offset of rookOffsets) {
    let to = target + offset;
    while (!(to & 0x88)) {
      const piece = squares[to];
      if (piece !== Piece.None) {
        if (sameColor(piece, attacker) && (samePiece(piece, Piece.Rook) || samePiece(piece, Piece.Queen))) return true;
        break;
      }
      to += offset;
    }
  }

  // 4. King attacks
  for (const offset of kingOffsets) {
    const to = target + offset;
    if (to & 0x88) continue;
    const piece = squares[to];
    if (sameColor(piece, attacker) && samePiece(piece, Piece.King)) return true;
  }

  return false;
}

export function getSingleMoves(fromPos: number, squares: Int8Array, result: Move[], offsets: number[]) {
  for (const offset of offsets) {
    const toPos = fromPos + offset;
    const moveType = getMoveType(fromPos, toPos, squares);
    if (moveType !== MoveType.Illegal) result.push({ fromPos, toPos, moveType, captured: squares[toPos] });
  }
}

export function getPawnMoves(fromPos: number, squares: Int8Array, result: Move[], enPassant: number) {
  const isWhite = sameColor(squares[fromPos], Color.White);
  const direction = isWhite ? -16 : 16;
  const captures = [direction - 1, direction + 1];

  for (const offset of captures) {
    const toPos = fromPos + offset;
    let moveType = getMoveType(fromPos, toPos, squares);
    if (moveType !== MoveType.Capture) continue;
    if (isPromotion(toPos)) moveType |= MoveType.Promotion;
    result.push({ fromPos, toPos, moveType, captured: squares[toPos] });
  }

  if (enPassant !== 0x88) {
    if (fromPos === enPassant - 1 || fromPos === enPassant + 1)
      result.push({ fromPos, toPos: enPassant + direction, moveType: MoveType.EnPassant, captured: enPassant });
  }

  const oneStep = fromPos + direction;
  let oneStepType = getMoveType(fromPos, oneStep, squares);
  if (oneStepType !== MoveType.PseudoLegal) return;
  if (isPromotion(oneStep)) oneStepType |= MoveType.Promotion;
  result.push({ fromPos, toPos: oneStep, moveType: oneStepType, captured: squares[oneStep] });
  const isStartRank = fromPos >> 4 === (isWhite ? 6 : 1);
  if (!isStartRank) return;
  const twoStep = oneStep + direction;
  const twoStepType = getMoveType(fromPos, twoStep, squares);
  if (twoStepType !== MoveType.PseudoLegal) return;
  result.push({ fromPos, toPos: twoStep, moveType: MoveType.PawnJump, captured: squares[twoStep] });
}

export function isPromotion(toPos: number) {
  const rank = toPos >> 4;
  return rank === 7 || rank === 0;
}

export function getLinearMoves(fromPos: number, squares: Int8Array, result: Move[], offsets: number[]) {
  for (const offset of offsets) {
    let toPos = fromPos + offset;
    let moveType = getMoveType(fromPos, toPos, squares);
    while (moveType !== MoveType.Illegal) {
      result.push({ fromPos, toPos, moveType, captured: squares[toPos] });
      if (moveType === MoveType.Capture) break;
      toPos += offset;
      moveType = getMoveType(fromPos, toPos, squares);
    }
  }
}

export function getMoveType(fromPos: number, toPos: number, squares: Int8Array) {
  if (toPos & 0x88) return MoveType.Illegal;
  if (squares[toPos] === Piece.None) return MoveType.PseudoLegal;
  if (sameColor(squares[fromPos], squares[toPos])) return MoveType.Illegal;
  return MoveType.Capture;
}

export const sameColor = (a: number, b: number) => (a & Color.Black) === (b & Color.Black);
export const samePiece = (a: number, b: number) => (a & Piece.Mask) === (b & Piece.Mask);
