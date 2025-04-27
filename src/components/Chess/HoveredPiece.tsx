import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useCallback, useMemo } from 'react';

import { VECTORS } from '../../constants';

type HoveredPieceProps = {
  turn: 'w' | 'b';
  code: string;
  piece: string | null;
};

const HoveredPiece = ({ turn, code, piece }: HoveredPieceProps) => {
  const crossHeight = 0.3;
  const crossWidth = 0.22;
  const crossThickness = 0.06;

  const whiteColor = useMemo(() => new THREE.Color('#D8D8D8'), []);
  //   const blackColor = useMemo(() => new THREE.Color('#2A2A2A'), []);

  const getMaterialProps = useCallback(
    () => ({
      color: whiteColor,
      roughness: 0.4,
      metalness: 0.1,
    }),
    [whiteColor]
  );
  const materialProps = useMemo(() => getMaterialProps(), [getMaterialProps]);

  if (!piece) return null;

  if (code !== piece.toLowerCase()) return null;

  return (
    <mesh
      castShadow
      position={[0, crossHeight, 6]}
      rotation={[0, -Math.PI, 0]}
      scale={[1, 1, 1]}>
      <boxGeometry args={[crossWidth, crossThickness, crossThickness]} />
      <meshStandardMaterial {...materialProps} />
      {piece && (
        <Text fontSize={0.4} color={'#fff'} position={[-7, crossHeight + 2, 0]}>
          {piece[0] === 'w' ? 'White' : 'Black'}
        </Text>
      )}
      <Text fontSize={5.8} color={'#fff'}>
        {
          VECTORS.NAMINGS.PIECES[
            code[1].toLowerCase() as keyof typeof VECTORS.NAMINGS.PIECES
          ]
        }
      </Text>
    </mesh>
  );
};

export default HoveredPiece;
