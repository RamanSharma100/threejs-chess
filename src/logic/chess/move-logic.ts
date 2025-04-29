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
  to: [number, number],
  status: Status
): { newBoard: Board; captured: PieceCode | null; isInCheck: boolean } => {
  const newBoard = board.map((row) => [...row]);
  const [fx, fy] = from;
  const [tx, ty] = to;
  const piece = board[fy][fx];
  const captured = board[ty][tx];

  if (!piece) return { newBoard, captured: null, isInCheck: false };

  // check for the castling if piece is a king or rook
  console.log('piece', piece);
  console.log('captured', captured);
  console.log(
    (piece[1] === 'K' || piece[1] === 'R') &&
      status.canCastle &&
      !status.isInCheck[piece[0] as 'w' | 'b']
  );
  if (
    (piece[1] === 'K' || piece[1] === 'R') &&
    status.canCastle &&
    !status.isInCheck[piece[0] as 'w' | 'b']
  ) {
    return {
      newBoard: doCastle(newBoard, from, to),
      captured,
      isInCheck: false,
    };
  } else {
    newBoard[fy][fx] = null;
    newBoard[ty][tx] = piece;
  }

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
          const { newBoard } = makeMove(board, [x, y], [mx, my], status);
          if (!isCheck(newBoard, turn)) {
            return false;
          }
        }
      }
    }
  }
  return true;
};

export const doCastle = (
  board: Board,
  from: [number, number], // King's starting square [x, y]
  to: [number, number] // King's ending square [x, y]
): Board => {
  const newBoard = board.map((row) => [...row]);
  const [xFrom, yFrom] = from;
  const [xTo, yTo] = to;

  const kingPiece = newBoard[yFrom][xFrom];

  if (!kingPiece || kingPiece[1] !== 'K') {
    console.error(
      'doCastle called with non-king piece or empty square:',
      from,
      kingPiece
    );
    return newBoard;
  }

  if (yFrom !== yTo) {
    console.error('doCastle called with different y-coordinates:', from, to);
    return newBoard;
  }

  const isKingSide = xTo > xFrom;
  let rookFromX: number;
  let rookToX: number;

  if (isKingSide) {
    rookFromX = 7;
    rookToX = xTo - 1;
  } else {
    rookFromX = 0;
    rookToX = xTo + 1;
  }

  const rookPiece = newBoard[yFrom][rookFromX];

  if (!rookPiece || rookPiece[1] !== 'R' || rookPiece[0] !== kingPiece[0]) {
    console.error(
      `doCastle: Expected Rook (${
        kingPiece[0]
      }R) not found at [${rookFromX}, ${yFrom}] for ${
        isKingSide ? 'Kingside' : 'Queenside'
      } castle.`
    );
    return newBoard;
  }

  newBoard[yTo][xTo] = kingPiece;
  newBoard[yFrom][xFrom] = null;

  newBoard[yTo][rookToX] = rookPiece;
  newBoard[yFrom][rookFromX] = null;

  // 9. Return the updated board
  return newBoard;
};
