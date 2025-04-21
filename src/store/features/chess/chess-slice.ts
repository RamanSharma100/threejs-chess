import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMoves } from '../../../logic/chess/moves';
export type PieceCode = string | null;
export type Board = PieceCode[][];

const initialBoard: Board = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

type GameState = {
  board: Board;
  selected: [number, number] | null;
  turn: 'w' | 'b';
  level: number;
  paths: [number, number][];
  offset?: number;
};

const initialState: GameState = {
  board: initialBoard,
  selected: null,
  turn: 'w',
  level: 1,
  paths: [],
  offset: 3.5,
};

const chessGameSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<[number, number]>) => {
      console.log(
        `Selected piece at (${action.payload[0]}, ${action.payload[1]})`
      );
      let [x, y] = action.payload;
      x += state.offset || 3.5;
      y += state.offset || 3.5;

      const piece = state.board[y][x];

      if (!piece || piece[0] !== state.turn) {
        state.selected = null;
        state.paths = [];
        console.log('Invalid piece selected or not your turn');
        return;
      }

      state.selected = [x, y];

      state.paths = getMoves(x, y, piece, state.board, state.turn);
      state.selected = [x, y];
    },
    move: (state, action: PayloadAction<[number, number]>) => {
      let [x, y] = action.payload;
      x += state.offset || 3.5;
      y += state.offset || 3.5;
      const [sx, sy] = state.selected!;
      console.log(`Moving piece from (${sx}, ${sy}) to (${x}, ${y})`);
      console.log(state.board);
      const piece = state.board[sy][sx];
      state.board[sy][sx] = null;
      state.board[y][x] = piece;
      state.turn = state.turn === 'w' ? 'b' : 'w';
      state.selected = null;
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
