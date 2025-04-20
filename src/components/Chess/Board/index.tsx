import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import BoardTiles from './Tiles';
import PieceFactory from '../Pieces';
import { useAppSelector } from '../../../hooks';

const ChessBoard = () => {
  const board = useAppSelector((state) => state.chess.board);

  return (
    <Canvas camera={{ position: [4, 10, 10], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} castShadow />
      <BoardTiles />
      {board.map((row, y) =>
        row.map(
          (code, x) =>
            code && (
              <PieceFactory key={`${x}-${y}`} code={code} position={[x, y]} />
            )
        )
      )}

      <OrbitControls enabled />
    </Canvas>
  );
};

export default ChessBoard;
