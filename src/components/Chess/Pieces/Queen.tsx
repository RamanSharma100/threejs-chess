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

const queenPoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.38, 0),
  new THREE.Vector2(0.38, 0.1),
  new THREE.Vector2(0.33, 0.15),
  new THREE.Vector2(0.28, 0.25),
  new THREE.Vector2(0.23, 0.5),
  new THREE.Vector2(0.28, 0.8),
  new THREE.Vector2(0.33, 0.85),
  new THREE.Vector2(0.33, 0.9),
  new THREE.Vector2(0.2, 0.95),
  new THREE.Vector2(0.18, 1.0),
  new THREE.Vector2(0.25, 1.15),
  new THREE.Vector2(0.26, 1.3),
  new THREE.Vector2(0.2, 1.4),
  new THREE.Vector2(0.1, 1.45),
  new THREE.Vector2(0.0, 1.45),
];
const queenHeight = Math.max(...queenPoints.map((p) => p.y));

export const Queen = forwardRef<THREE.Group, PieceProps>(
  ({ position, color, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);
    const coronetRadius = 0.08;
    const coronetY = queenHeight + coronetRadius * 0.8;

    return (
      <group ref={ref} position={[position[0], 0, position[1]]} {...props}>
        <ChessPiece points={queenPoints} materialProps={materialProps}>
          <mesh castShadow position={[0, coronetY, 0]}>
            <sphereGeometry args={[coronetRadius, 16, 8]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </ChessPiece>
      </group>
    );
  }
);

Queen.displayName = 'Queen';
export default Queen;
