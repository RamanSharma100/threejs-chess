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

const bishopPoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.35, 0),
  new THREE.Vector2(0.35, 0.08),
  new THREE.Vector2(0.3, 0.12),
  new THREE.Vector2(0.25, 0.2),
  new THREE.Vector2(0.2, 0.4),
  new THREE.Vector2(0.25, 0.7),
  new THREE.Vector2(0.28, 0.75),
  new THREE.Vector2(0.28, 0.8),
  new THREE.Vector2(0.15, 0.85),
  new THREE.Vector2(0.18, 0.9),
  new THREE.Vector2(0.25, 1.1),
  new THREE.Vector2(0.2, 1.25),
  new THREE.Vector2(0.1, 1.3),
  new THREE.Vector2(0.0, 1.3),
];
const bishopHeight = Math.max(...bishopPoints.map((p) => p.y));

export const Bishop = forwardRef<THREE.Group, PieceProps>(
  ({ position, color, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);
    const finialRadius = 0.07;
    const finialY = bishopHeight + finialRadius * 0.7;

    return (
      <group ref={ref} position={[position[0], 0, position[1]]} {...props}>
        <ChessPiece points={bishopPoints} materialProps={materialProps}>
          <mesh castShadow position={[0, finialY, 0]}>
            <sphereGeometry args={[finialRadius, 16, 8]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </ChessPiece>
      </group>
    );
  }
);

Bishop.displayName = 'Bishop';
export default Bishop;
