import { useDispatch } from 'react-redux';
import { Piece } from './Base';
import { select } from '../../../store/features/chess/chess-slice';
import { useAppSelector } from '../../../hooks';

type PieceFactoryProps = {
  code: string;
  position: [number, number];
};

type PieceNames =
  | 'K'
  | 'Q'
  | 'R'
  | 'B'
  | 'N'
  | 'P'
  | 'k'
  | 'q'
  | 'r'
  | 'b'
  | 'n'
  | 'p';

const PieceFactory = ({ code, position }: PieceFactoryProps) => {
  const offset = useAppSelector((state) => state.chess.offset || 3.5);

  const color = code[0] as 'w' | 'b';
  const type = code[1].toLowerCase() as PieceNames;
  const adjustedPosition: [number, number] = [
    position[0] - offset,
    position[1] - offset,
  ];

  const dispatch = useDispatch();

  const handleSelect = () => {
    dispatch(select(adjustedPosition));
  };

  return (
    <Piece
      color={color}
      code={code}
      position={adjustedPosition}
      type={type}
      onClick={handleSelect}
    />
  );
};

export default PieceFactory;
