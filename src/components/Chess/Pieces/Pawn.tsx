import { useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import ChessPiece from './Main';

type PieceProps = {
  position: [number, number];
  color: 'w' | 'b';
};

const whiteColor = new THREE.Color('#D8D8D8');
const blackColor = new THREE.Color('#2A2A2A');

const getMaterialProps = (color: 'w' | 'b') => ({
  color: color === 'w' ? whiteColor : blackColor,
  roughness: 0.4,
  metalness: 0.1,
});

const pawnPoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.3, 0),
  new THREE.Vector2(0.3, 0.08),
  new THREE.Vector2(0.25, 0.12),
  new THREE.Vector2(0.2, 0.2),
  new THREE.Vector2(0.15, 0.4),
  new THREE.Vector2(0.18, 0.5),
  new THREE.Vector2(0.22, 0.55),
  new THREE.Vector2(0.2, 0.58),
  new THREE.Vector2(0.2, 0.75),
  new THREE.Vector2(0.0, 0.75),
];
const pawnBaseHeight = Math.max(...pawnPoints.map((p) => p.y));
const pawnHeadRadius = 0.18;

export const Pawn = forwardRef<THREE.Group, PieceProps>(
  ({ position, color, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);
    const headY = pawnBaseHeight - pawnHeadRadius * 0.3;

    return (
      <group ref={ref} position={[position[0], 0, position[1]]} {...props}>
        <ChessPiece points={pawnPoints} materialProps={materialProps}>
          <mesh castShadow position={[0, headY, 0]}>
            <sphereGeometry args={[pawnHeadRadius, 24, 12]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </ChessPiece>
      </group>
    );
  }
);

Pawn.displayName = 'Pawn';
export default Pawn;
