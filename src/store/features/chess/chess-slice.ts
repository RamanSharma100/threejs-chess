import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMoves, Status } from '../../../logic/chess/moves';
import { isValidMove, makeMove } from '../../../logic/chess/move-logic';
import {
  playCaptureSound,
  playCheckSound,
  playMoveSound,
  playSelectSound,
} from '../../../helpers';

export type PieceCode = string | null;
export type Board = PieceCode[][];

const initialBoard: Board = [
  ['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR'],
];

type Bool = {
  w: boolean;
  b: boolean;
};

type CapturedPieces = {
  w: PieceCode[];
  b: PieceCode[];
};

type GameState = {
  board: Board;
  selected: [number, number] | null;
  turn: 'w' | 'b';
  level: number;
  paths: [number, number][];
  offset: number;
  opponent?: 'w' | 'b';
  inCheck: Bool;
  isCheckmate: 'w' | 'b' | null;
  canCastle: Bool;
  capturedPieces: CapturedPieces;
};

const initialState: GameState = {
  board: initialBoard,
  selected: null,
  turn: 'w',
  level: 1,
  paths: [],
  offset: 3.5,
  opponent: 'b',
  inCheck: {
    w: false,
    b: false,
  },
  isCheckmate: null,
  canCastle: {
    w: true,
    b: true,
  },
  capturedPieces: {
    w: [],
    b: [],
  },
};

const chessGameSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<[number, number]>) => {
      let [x, y] = action.payload;
      x += state.offset || 3.5;
      y += state.offset || 3.5;

      const piece = state.board[y][x];

      if (!piece || piece[0] !== state.turn) {
        if (state.selected) {
          console.log('other piece selected');
          return;
        }
        state.selected = null;
        state.paths = [];
        console.log('Invalid piece selected or not your turn');
        return;
      }

      console.log(
        `Selected piece at (${action.payload[0]}, ${action.payload[1]})`
      );

      state.selected = [x, y];

      playSelectSound();

      state.paths = getMoves(x, y, piece, state.board, state.turn, {
        canCastle: state.canCastle[state.turn],
        isInCheck: state.inCheck,
        isInCheckmate: state.isCheckmate,
      });
      state.selected = [x, y];
    },
    move: (state, action: PayloadAction<[number, number]>) => {
      const [x, y] = action.payload;
      const [sx, sy] = state.selected!;
      const from: [number, number] = [sx, sy];
      const to: [number, number] = [x, y];

      const status: Status = {
        canCastle: state.canCastle[state.turn],
        isInCheck: state.inCheck,
        isInCheckmate: state.isCheckmate,
      };

      if (!isValidMove(from, to, state.board, state.turn, status)) {
        console.log('Invalid move');
        state.selected = null;
        state.paths = [];
        return;
      }

      const { newBoard, captured, isInCheck } = makeMove(
        state.board,
        from,
        to,
        status
      );
      state.board = newBoard;
      state.selected = null;
      state.paths = [];
      console.log(`Moved piece from (${sx}, ${sy}) to (${x}, ${y})`);

      if (captured) {
        console.log(`Captured piece: ${captured}`);
        playCaptureSound();
        state.capturedPieces[state.turn].push(captured);
      } else {
        if (isInCheck) {
          playCheckSound();
        } else {
          playMoveSound();
        }
      }

      const isKingMoved =
        state.board[y][x]?.[1] === 'K' || state.board[y][x]?.[1] === 'R';
      if (isKingMoved) {
        state.canCastle[state.turn] = false;
      }

      state.turn = state.turn === 'w' ? 'b' : 'w';
      state.inCheck[state.turn] = isInCheck;
    },
    reset: () => initialState,
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
    },
    unselect: (state) => {
      state.selected = null;
      state.paths = [];
    },
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
    },
    setTurn: (state, action: PayloadAction<'w' | 'b'>) => {
      state.turn = action.payload;
    },
    setPaths: (state, action: PayloadAction<[number, number][]>) => {
      state.paths = action.payload;
    },
    setSelected: (state, action: PayloadAction<[number, number] | null>) => {
      state.selected = action.payload;
    },
  },
});

export const { select, move, reset, unselect } = chessGameSlice.actions;
export default chessGameSlice.reducer;
