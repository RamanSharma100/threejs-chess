import { Board, PieceCode } from '../../store/features/chess/chess-slice';
import { getMoves, Status } from './moves';

export const isValidMove = (
  from: [number, number],
  to: [number, number],
  board: Board,
  turn: 'w' | 'b',
  status: Status
): boolean => {
  const [fx, fy] = from;
  const piece = board[fy][fx];
  if (!piece || piece[0] !== turn) return false;

  const validMoves = getMoves(fx, fy, piece, board, turn, status);
  console.log(validMoves.some(([x, y]) => x === to[0] && y === to[1]));
  return validMoves.some(([x, y]) => x === to[0] && y === to[1]);
};

export const makeMove = (
  board: Board,
  from: [number, number],
  to: [number, number]
): { newBoard: Board; captured: PieceCode | null; isInCheck: boolean } => {
  const newBoard = board.map((row) => [...row]);
  const [fx, fy] = from;
  const [tx, ty] = to;
  const piece = board[fy][fx];
  const captured = board[ty][tx];

  newBoard[fy][fx] = null;
  newBoard[ty][tx] = piece;

  // check for the check
  const isInCheck = isCheck(newBoard, piece![0] === 'w' ? 'b' : 'w');

  return { newBoard, captured, isInCheck };
};

export const isCheck = (board: Board, color: 'w' | 'b'): boolean => {
  // Find king's position
  let kingX = -1;
  let kingY = -1;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === `${color}K`) {
        kingX = x;
        kingY = y;
        break;
      }
    }
    if (kingX !== -1) break;
  }

  if (kingX === -1 || kingY === -1) {
    // King is missing from board (shouldn't happen)
    return true;
  }

  // Check if any opponent piece can capture the king
  const opponentColor = color === 'w' ? 'b' : 'w';

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece[0] === opponentColor) {
        const moves = getMoves(x, y, piece, board, opponentColor, {
          isInCheck: { w: false, b: false },
          isInCheckmate: null,
          canCastle: false,
        });

        if (moves.some(([mx, my]) => mx === kingX && my === kingY)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isCheckmate = (
  board: Board,
  turn: 'w' | 'b',
  status: Status
): boolean => {
  if (!isCheck(board, turn)) return false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece[0] === turn) {
        const moves = getMoves(x, y, piece, board, turn, status);
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

export const canCastle = (
  board: Board,
  turn: 'w' | 'b',
  _status: Status
): boolean => {
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
