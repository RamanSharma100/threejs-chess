import { shallowEqual } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import BoardTiles from './Tiles';
import PieceFactory from '../Pieces';
import { useAppSelector } from '../../../hooks';
import { playGameStartSound } from '../../../helpers';

const ChessBoard = () => {
  const { board, turn } = useAppSelector(
    (state) => ({
      board: state.chess.board,
      turn: state.chess.turn,
    }),
    shallowEqual
  );

  return (
    <Canvas
      camera={{ position: [0, 15, 8], fov: 40 }}
      shadows
      onCreated={() => playGameStartSound()}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} castShadow />
      <group rotation={turn === 'w' ? [0, Math.PI, 0] : [0, 0, 0]}>
        <BoardTiles />
        {board.map((row, y) =>
          row.map(
            (code, x) =>
              code && (
                <PieceFactory key={`${x}-${y}`} code={code} position={[x, y]} />
              )
          )
        )}
      </group>
      <OrbitControls enabled />
    </Canvas>
  );
};

export default ChessBoard;
