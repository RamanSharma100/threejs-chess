import { Board } from '../../store/features/chess/chess-slice';
import { isCheck } from './move-logic';

export type Status = {
  isInCheck: {
    w: boolean;
    b: boolean;
  };
  isInCheckmate: 'w' | 'b' | null;
  canCastle: boolean;
};

export const getPawnMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const moves: [number, number][] = [];
  const direction = color === 'w' ? 1 : -1;

  if (!board[y + direction]?.[x]) {
    moves.push([x, y + direction]);

    if ((color === 'w' && y === 1) || (color === 'b' && y === 6)) {
      if (!board[y + 2 * direction]?.[x]) {
        moves.push([x, y + 2 * direction]);
      }
    }
  }

  for (const dx of [-1, 1]) {
    const nx = x + dx;
    const ny = y + direction;

    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (board[ny][nx] && board[ny][nx]![0] !== color) {
        moves.push([nx, ny]);
      }
    }
  }

  return status.isInCheck[color]
    ? filterMoves(moves, x, y, color, board, status)
    : moves;
};

export const getMoves = (
  x: number,
  y: number,
  piece: string,
  board: Board,
  color: 'w' | 'b',
  status: Status
): [number, number][] => {
  const type = piece[1];

  switch (type) {
    case 'P':
      return getPawnMoves(x, y, color, board, status);
    case 'R':
      return getRookMoves(x, y, color, board, status);
    case 'N':
      return getKnightMoves(x, y, color, board, status);
    case 'B':
      return getBishopMoves(x, y, color, board, status);
    case 'Q':
      return getQueenMoves(x, y, color, board, status);
    case 'K':
      return getKingMoves(x, y, color, board, status);
    default:
      return [];
  }
};

const getRookMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const paths: [number, number][] = [];
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;

    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (board[ny][nx]) {
        if (board[ny][nx]![0] !== color) paths.push([nx, ny]);
        break;
      }
      paths.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
  }

  return status.isInCheck[color]
    ? filterMoves(paths, x, y, color, board, status)
    : paths;
};

const getKnightMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const paths: [number, number][] = [];
  const moves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];

  for (const [dx, dy] of moves) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (!board[ny][nx] || board[ny][nx]![0] !== color) {
        paths.push([nx, ny]);
      }
    }
  }

  return status.isInCheck[color]
    ? filterMoves(paths, x, y, color, board, status)
    : paths;
};

const getBishopMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const paths: [number, number][] = [];
  const directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;

    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (board[ny][nx]) {
        if (board[ny][nx]![0] !== color) paths.push([nx, ny]);
        break;
      }
      paths.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
  }

  return status.isInCheck[color]
    ? filterMoves(paths, x, y, color, board, status)
    : paths;
};

const getQueenMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const paths = [
    ...getRookMoves(x, y, color, board, status),
    ...getBishopMoves(x, y, color, board, status),
  ];

  return status.isInCheck[color]
    ? filterMoves(paths, x, y, color, board, status)
    : paths;
};

const getKingMoves = (
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const paths: [number, number][] = [];
  const moves = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  if (status.canCastle) {
    moves.push([2, 0]);
    moves.push([-2, 0]);
  }

  for (const [dx, dy] of moves) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (!board[ny][nx] || board[ny][nx]![0] !== color) {
        paths.push([nx, ny]);
      }
    }
  }

  return status.isInCheck[color]
    ? filterMoves(paths, x, y, color, board, status)
    : paths;
};

export const filterMoves = (
  moves: [number, number][],
  x: number,
  y: number,
  color: 'w' | 'b',
  board: Board,
  status: Status
): [number, number][] => {
  const filteredMoves: [number, number][] = [];

  for (const [nx, ny] of moves) {
    const newBoard: Board = board.map((row) => [...row]);

    newBoard[ny][nx] = newBoard[y][x];
    newBoard[y][x] = null;

    if (!isCheck(newBoard, color)) {
      filteredMoves.push([nx, ny]);
    }
  }

  return status.isInCheck[color]
    ? filteredMoves
    : moves.filter(([nx, ny]) =>
        filteredMoves.some(([fx, fy]) => fx === nx && fy === ny)
      );
};
