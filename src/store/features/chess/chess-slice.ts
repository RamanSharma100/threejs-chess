import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMoves } from '../../../logic/chess/moves';
import {
  isValidMove,
  makeMove,
  // isCheck,
  // isCheckmate,
  // canCastle,
} from '../../../logic/chess/move-logic';
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
  offset?: number;
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
    w: false,
    b: false,
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

      if (state.inCheck[state.turn] && piece && piece[1] !== 'K') {
        console.log('In check, cannot select piece');
        return;
      }

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

      state.paths = getMoves(x, y, piece, state.board, state.turn);
      state.selected = [x, y];
    },
    move: (state, action: PayloadAction<[number, number]>) => {
      const [x, y] = action.payload;
      const [sx, sy] = state.selected!;
      const from: [number, number] = [sx, sy];
      const to: [number, number] = [x, y];

      if (!isValidMove(from, to, state.board, state.turn)) {
        console.log('Invalid move');
        state.selected = null;
        state.paths = [];
        return;
      }

      const { newBoard, captured, isInCheck } = makeMove(state.board, from, to);
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
