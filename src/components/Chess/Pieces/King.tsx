import { useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import ChessPiece from './Main';
type PieceProps = {
  position: [number, number];
  color: 'w' | 'b';
  onClick?: (event: React.MouseEvent) => void;
};

const whiteColor = new THREE.Color('#D8D8D8');
const blackColor = new THREE.Color('#2A2A2A');

const getMaterialProps = (color: 'w' | 'b') => ({
  color: color === 'w' ? whiteColor : blackColor,
  roughness: 0.4,
  metalness: 0.1,
});

const kingPoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.4, 0),
  new THREE.Vector2(0.4, 0.1),
  new THREE.Vector2(0.35, 0.15),
  new THREE.Vector2(0.3, 0.25),
  new THREE.Vector2(0.25, 0.6),
  new THREE.Vector2(0.3, 0.9),
  new THREE.Vector2(0.35, 0.95),
  new THREE.Vector2(0.35, 1.0),
  new THREE.Vector2(0.2, 1.05),
  new THREE.Vector2(0.18, 1.1),
  new THREE.Vector2(0.25, 1.25),
  new THREE.Vector2(0.28, 1.4),
  new THREE.Vector2(0.22, 1.55),
  new THREE.Vector2(0.1, 1.6),
  new THREE.Vector2(0.0, 1.6),
];
const kingHeight = Math.max(...kingPoints.map((p) => p.y));

export const King = forwardRef<THREE.Group, PieceProps>(
  ({ position, color, onClick, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);

    const crossHeight = 0.3;
    const crossWidth = 0.22;
    const crossThickness = 0.06;
    const crossY = kingHeight + crossHeight * 0.3;

    return (
      <group
        ref={ref}
        position={[position[0], 0, position[1]]}
        {...props}
        onClick={onClick}>
        <ChessPiece points={kingPoints} materialProps={materialProps}>
          <group position={[0, crossY, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry
                args={[crossThickness, crossHeight, crossThickness]}
              />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh castShadow position={[0, crossHeight * 0.15, 0]}>
              <boxGeometry
                args={[crossWidth, crossThickness, crossThickness]}
              />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        </ChessPiece>
      </group>
    );
  }
);

King.displayName = 'King';
export default King;
