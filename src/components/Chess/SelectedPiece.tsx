import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../hooks';
import Chip from '../UI/Chip';
import { VECTORS } from '../../constants';
import { RootState } from '../../store/store';

const SelectedPiece = () => {
  const {
    selected,
    turn,
    board,
    paths: _paths,
  } = useAppSelector(
    (state: RootState) => ({
      selected: state.chess.selected,
      turn: state.chess.turn,
      board: state.chess.board,
      paths: state.chess.paths,
    }),
    shallowEqual
  );

  if (!selected) return null;

  const piece = board[selected[1]][selected[0]];
  if (!piece) return null;

  return (
    <div className="absolute bottom-5 left-5">
      <Chip
        field="Selected Piece"
        value={
          VECTORS.NAMINGS.PIECES[
            piece[1].toLowerCase() as keyof typeof VECTORS.NAMINGS.PIECES
          ] +
          ' (' +
          piece[0].toUpperCase() +
          ')'
        }
        color={turn === piece[0] ? 'primary' : 'default'}
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: turn === piece[0] ? '#1976d2' : '#f5f5f5',
          color: turn === piece[0] ? '#fff' : '#000',
          borderColor: turn === piece[0] ? '#1976d2' : '#ccc',
          '&:hover': {
            backgroundColor: turn === piece[0] ? '#115293' : '#e0e0e0',
            borderColor: turn === piece[0] ? '#115293' : '#bbb',
          },
        }}
      />
    </div>
  );
};

export default SelectedPiece;
