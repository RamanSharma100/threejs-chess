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

const rookPoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.38, 0),
  new THREE.Vector2(0.38, 0.12),
  new THREE.Vector2(0.35, 0.18),
  new THREE.Vector2(0.3, 0.25),
  new THREE.Vector2(0.3, 0.8),
  new THREE.Vector2(0.35, 0.85),
  new THREE.Vector2(0.35, 0.9),
  new THREE.Vector2(0.0, 0.9),
];
const rookHeight = Math.max(...rookPoints.map((p) => p.y));
const rookTopRadius = rookPoints[rookPoints.length - 2].x;

export const Rook = forwardRef<THREE.Group, PieceProps>(
  ({ position, color, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);

    const numCrenellations = 6;
    const crenHeight = 0.15;
    const crenWidth = 0.18;
    const crenDepth = 0.15;
    const crenY = rookHeight;

    return (
      <group ref={ref} position={[position[0], 0, position[1]]} {...props}>
        <ChessPiece points={rookPoints} materialProps={materialProps}>
          <group position={[0, crenY, 0]}>
            {Array.from({ length: numCrenellations }).map((_, i) => {
              const angle = (i / numCrenellations) * Math.PI * 2;
              const x = Math.cos(angle) * (rookTopRadius - crenDepth * 0.3);
              const z = Math.sin(angle) * (rookTopRadius - crenDepth * 0.3);
              return (
                <mesh
                  key={i}
                  castShadow
                  position={[x, crenHeight / 2, z]}
                  rotation={[0, -angle, 0]}>
                  <boxGeometry args={[crenWidth, crenHeight, crenDepth]} />
                  <meshStandardMaterial {...materialProps} />
                </mesh>
              );
            })}
          </group>
        </ChessPiece>
      </group>
    );
  }
);

Rook.displayName = 'Rook';
export default Rook;
