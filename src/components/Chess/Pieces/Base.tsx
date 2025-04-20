import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useAppDispatch } from '../../../hooks';
import { select, move } from '../../../store/features/chess/chess-slice';
import { Mesh } from 'three';
import King from './King';
import Queen from './Queen';
import Rook from './Rook';
import Bishop from './Bishop';
import Pawn from './Pawn';
import Knight from './Knight';

type PieceProps = {
  position: [number, number];
  color: 'w' | 'b';
  code?: string;
  onClick?: () => void;
  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
};

export const Piece = ({ position, color, type, onClick }: PieceProps) => {
  const ref = useRef<Mesh>(null);
  const dispatch = useAppDispatch();

  const defaultProps = {
    onClick,
  };

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01;
  });

  switch (type.toLowerCase()) {
    case 'k':
      return <King position={position} color={color} {...defaultProps} />;
    case 'q':
      return <Queen position={position} color={color} {...defaultProps} />;
    case 'r':
      return <Rook position={position} color={color} {...defaultProps} />;
    case 'b':
      return <Bishop position={position} color={color} {...defaultProps} />;
    case 'n':
      return <Knight position={position} color={color} {...defaultProps} />;
    case 'p':
      return <Pawn position={position} color={color} {...defaultProps} />;
    default:
      return (
        <mesh
          ref={ref}
          position={[position[0], 0.5, position[1]]}
          onClick={() => dispatch(select(position))}
          onDoubleClick={() => dispatch(move(position))}
          castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
          <meshStandardMaterial color={color === 'w' ? 'white' : 'black'} />
        </mesh>
      );
  }
};
