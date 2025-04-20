import React, { useMemo } from 'react';
import * as THREE from 'three';

type ChessPieceProps = {
  points: THREE.Vector2[];
  materialProps: React.ComponentProps<'meshStandardMaterial'>;
  segments?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  children?: React.ReactElement | React.ReactElement[];
};

const ChessPiece: React.FC<ChessPieceProps> = ({
  points,
  materialProps,
  segments = 48,
  castShadow = true,
  receiveShadow = false,
  children,
}) => {
  const geometry = useMemo(
    () => new THREE.LatheGeometry(points, segments),
    [points, segments]
  );

  return (
    <group>
      <mesh
        geometry={geometry}
        castShadow={castShadow}
        receiveShadow={receiveShadow}>
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {children}
    </group>
  );
};

export default ChessPiece;
