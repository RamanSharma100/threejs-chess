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
      camera={{ position: [0, 18, 10], fov: 40 }}
      shadows
      onCreated={() => playGameStartSound()}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[0, 10, 0]}
        intensity={1.5} // Increased intensity for better visibility
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
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
