import { Board, PieceCode } from '../../store/features/chess/chess-slice';
import { getMoves } from './moves';

export const isValidMove = (
  from: [number, number],
  to: [number, number],
  board: Board,
  turn: 'w' | 'b'
): boolean => {
  const [fx, fy] = from;
  console.log('from', from);
  const piece = board[fy][fx];
  console.log('piece', piece);
  console.log('turn', turn);
  console.log('from', from);
  if (!piece || piece[0] !== turn) return false;

  const validMoves = getMoves(fx, fy, piece, board, turn);
  console.log('validMoves', validMoves);
  console.log('to', to);
  console.log(validMoves.some(([x, y]) => x === to[0] && y === to[1]));
  return validMoves.some(([x, y]) => x === to[0] && y === to[1]);
};

export const makeMove = (
  board: Board,
  from: [number, number],
  to: [number, number]
): { newBoard: Board; captured: PieceCode | null } => {
  const newBoard = board.map((row) => [...row]);
  const [fx, fy] = from;
  const [tx, ty] = to;
  const piece = board[fy][fx];
  const captured = board[ty][tx];

  newBoard[fy][fx] = null;
  newBoard[ty][tx] = piece;

  return { newBoard, captured };
};

export const isCheck = (board: Board, turn: 'w' | 'b'): boolean => {
  const opponent = turn === 'w' ? 'b' : 'w';
  let kingPos: [number, number] | null = null;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === `${turn}K`) {
        kingPos = [x, y];
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece[0] === opponent) {
        const moves = getMoves(x, y, piece, board, opponent);
        if (
          moves.some(([mx, my]) => mx === kingPos![0] && my === kingPos![1])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isCheckmate = (board: Board, turn: 'w' | 'b'): boolean => {
  if (!isCheck(board, turn)) return false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece[0] === turn) {
        const moves = getMoves(x, y, piece, board, turn);
        for (const [mx, my] of moves) {
          const { newBoard } = makeMove(board, [x, y], [mx, my]);
          if (!isCheck(newBoard, turn)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const canCastle = (board: Board, turn: 'w' | 'b'): boolean => {
  const y = turn === 'w' ? 7 : 0;
  const king = board[y][4];
  const rookKingside = board[y][7];
  const rookQueenside = board[y][0];

  if (king !== `${turn}K`) return false;

  if (
    rookKingside === `${turn}R` &&
    !board[y][5] &&
    !board[y][6] &&
    !isCheck(board, turn)
  ) {
    const boardMid = makeMove(board, [4, y], [5, y]).newBoard;
    if (!isCheck(boardMid, turn)) {
      const boardEnd = makeMove(boardMid, [5, y], [6, y]).newBoard;
      if (!isCheck(boardEnd, turn)) return true;
    }
  }

  if (
    rookQueenside === `${turn}R` &&
    !board[y][1] &&
    !board[y][2] &&
    !board[y][3] &&
    !isCheck(board, turn)
  ) {
    const boardMid = makeMove(board, [4, y], [3, y]).newBoard;
    if (!isCheck(boardMid, turn)) {
      const boardEnd = makeMove(boardMid, [3, y], [2, y]).newBoard;
      if (!isCheck(boardEnd, turn)) return true;
    }
  }

  return false;
};
