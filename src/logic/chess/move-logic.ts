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
  kingFrom: [number, number],
  kingTo: [number, number]
): Board => {
  const newBoard = board.map((row) => [...row]);
  const [kxFrom, kyFrom] = kingFrom;
  const [kxTo, kyTo] = kingTo;
  const isKingside = kxTo < kxFrom;

  const kingPiece = board[kyFrom][kxFrom];
  const rookPiece = isKingside
    ? board[kyFrom][kxFrom - 3]
    : board[kyFrom][kxFrom + 4];

  // Ensure the piece at kingFrom is actually a king and the piece at rook position is a rook
  if (!kingPiece || kingPiece[1] !== 'K' || !rookPiece || rookPiece[1] !== 'R')
    return newBoard;

  newBoard[kyFrom][kxFrom] = null; // Remove the king from its original position
  newBoard[kyTo][kxTo] = kingPiece; // Place the king in its new position
  newBoard[kyTo][isKingside ? kxTo + 1 : kxTo - 1] = rookPiece; // Move the rook next to the king
  newBoard[kyFrom][isKingside ? kxFrom - 3 : kxFrom + 4] = null; // Remove the rook from its original position

  return newBoard;

  return newBoard;
};
