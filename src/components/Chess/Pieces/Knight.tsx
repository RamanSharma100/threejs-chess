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
  side: THREE.FrontSide,
});

const getManeMaterialProps = (color: 'w' | 'b') => ({
  ...getMaterialProps(color),
  side: THREE.DoubleSide,
});

const knightBasePoints = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0.36, 0),
  new THREE.Vector2(0.36, 0.1),
  new THREE.Vector2(0.32, 0.15),
  new THREE.Vector2(0.28, 0.25),
  new THREE.Vector2(0.25, 0.5),
  new THREE.Vector2(0.26, 0.7),
  new THREE.Vector2(0.2, 0.75),
  new THREE.Vector2(0.0, 0.75),
];
const knightBaseHeight = Math.max(...knightBasePoints.map((p) => p.y));

const neckBottomRadius = 0.18;
const neckTopRadius = 0.14;
const neckHeight = 0.35;
const neckAngle = -Math.PI / 7;

const headRadius = 0.15;
const headLength = 0.2;

const snoutLength = 0.3;
const snoutRadiusStart = 0.1;
const snoutRadiusEnd = 0.08;
const snoutAngle = Math.PI / 6;

const earHeight = 0.16;
const earRadius = 0.04;
const earAngleX = -Math.PI / 8;
const earAngleY = Math.PI / 5;

export const Knight = forwardRef<THREE.Group, PieceProps & Record<string, any>>(
  ({ position, color, ...props }, ref) => {
    const materialProps = useMemo(() => getMaterialProps(color), [color]);
    const maneMaterialProps = useMemo(
      () => getManeMaterialProps(color),
      [color]
    );

    const maneShape = useMemo(() => {
      const shape = new THREE.Shape();
      const h = 0.5;
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.05, h * 0.3, 0.12, h * 0.6, 0.1, h * 0.8);
      shape.bezierCurveTo(0.08, h * 0.95, 0.03, h * 1.05, 0.0, h);
      shape.lineTo(-0.02, h * 0.9);
      shape.bezierCurveTo(-0.05, h * 0.7, -0.08, h * 0.4, -0.03, 0);
      shape.closePath();
      return shape;
    }, []);
    const maneExtrudeSettings = useMemo(
      () => ({
        steps: 1,
        depth: 0.4,
        bevelEnabled: false,
      }),
      []
    );

    const neckBaseY = knightBaseHeight;
    const neckRotation = new THREE.Matrix4().makeRotationX(neckAngle);
    const neckCenterOffset = new THREE.Vector3(
      0,
      neckHeight / 2,
      0
    ).applyMatrix4(neckRotation);
    const neckCenterPos = new THREE.Vector3(0, neckBaseY, 0).add(
      neckCenterOffset
    );

    const neckTopOffset = new THREE.Vector3(0, neckHeight, 0).applyMatrix4(
      neckRotation
    );
    const neckTopPos = new THREE.Vector3(0, neckBaseY, 0).add(neckTopOffset);

    const headGroupOffset = new THREE.Vector3(
      0,
      headRadius * 0.5,
      headRadius * 0.2
    );
    const headGroupPos = neckTopPos.clone().add(headGroupOffset);

    const snoutOffset = new THREE.Vector3(
      0,
      -headRadius * 0.2,
      headLength / 2 + snoutLength / 2 - 0.05
    );

    const earBaseOffsetZ = -headLength / 2;
    const earSideOffsetX = headRadius * 0.7;

    const maneOffsetY = -0.05;
    const maneOffsetZ = -neckTopRadius * 0.6;

    return (
      <group
        ref={ref}
        position={[position[0], 0, position[1]]}
        {...props}
        rotation={[0, -Math.PI / 2, 0]}>
        <ChessPiece
          points={knightBasePoints}
          materialProps={materialProps}
          receiveShadow={true}>
          <mesh
            position={neckCenterPos}
            rotation={[neckAngle, 0, 0]}
            castShadow>
            <cylinderGeometry
              args={[neckTopRadius, neckBottomRadius, neckHeight, 24]}
            />
            <meshStandardMaterial {...materialProps} />
          </mesh>

          <group position={headGroupPos} rotation={[neckAngle, 0, 0]}>
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              {' '}
              <cylinderGeometry
                args={[headRadius, headRadius, headLength, 24]}
              />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0, 0, headLength / 2]} castShadow>
              <sphereGeometry args={[headRadius, 24, 16]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0, 0, -headLength / 2]} castShadow>
              <sphereGeometry args={[headRadius, 24, 16]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>

            <mesh
              position={snoutOffset}
              rotation={[snoutAngle, 0, 0]}
              castShadow>
              <cylinderGeometry
                args={[snoutRadiusEnd, snoutRadiusStart, snoutLength, 16]}
              />
              <meshStandardMaterial {...materialProps} />
            </mesh>

            <mesh
              position={[earSideOffsetX, headRadius * 0.5, earBaseOffsetZ]}
              rotation={[earAngleX, earAngleY, 0]}
              castShadow>
              <coneGeometry args={[earRadius, earHeight, 16]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh
              position={[-earSideOffsetX, headRadius * 0.5, earBaseOffsetZ]}
              rotation={[earAngleX, -earAngleY, 0]}
              castShadow>
              <coneGeometry args={[earRadius, earHeight, 16]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>

          <mesh
            position={[
              neckCenterPos.x,
              neckCenterPos.y + maneOffsetY,
              neckCenterPos.z + maneOffsetZ,
            ]}
            rotation={[neckAngle, 0, 0]}
            castShadow>
            <extrudeGeometry args={[maneShape, maneExtrudeSettings]} />
            <meshStandardMaterial {...maneMaterialProps} />
          </mesh>
        </ChessPiece>
      </group>
    );
  }
);

Knight.displayName = 'Knight';
export default Knight;
