import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store/store';
import * as THREE from 'three';
import { move, unselect } from '../../../store/features/chess/chess-slice';

const BoardTiles = () => {
  const { paths, selected } = useAppSelector(
    (state: RootState) => ({
      paths: state.chess.paths,
      selected: state.chess.selected,
    }),
    shallowEqual
  );

  const dispatch = useAppDispatch();

  const tiles = useMemo(() => {
    const out = [];
    const offset = 3.5;

    const gradientShader = {
      uniforms: {
        color1: { type: 'c', value: new THREE.Color(0x0000ff) },
        color2: { type: 'c', value: new THREE.Color(0x00ffff) },
        time: { type: 'f', value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        varying vec2 vUv;

        void main() {
          
          float dx = vUv.x - 0.5;
          float dy = vUv.y - 0.5;

          
          float dist = sqrt(dx * dx * 2.0 + dy * dy * 1.2); 

          
          vec3 gradientColor = mix(color1, color2, dist);

          
          gl_FragColor = vec4(gradientColor, 1.0);
        }
      `,
    };

    const handleHoverIn = (e: any, isPath: boolean) => {
      if (isPath) {
        if (e.object.material.emissive) {
          e.object.material.emissive.set(0x0000ff);
          e.object.material.emissiveIntensity = 1.5;
        }
        if (e.object.material.color) {
          e.object.material.wireframe = true;
        }
        e.object.material.wireframe = true;
      } else {
        e.object.material.color.set(0x00ff00);
        e.object.material.emissiveIntensity = 0.3;
      }
    };

    const handleHoverOut = (e: any, isPath: boolean, x: number, y: number) => {
      if (isPath) {
        if (e.object.material.emissive) {
          e.object.material.emissive.set(0x0000ff);
          e.object.material.emissiveIntensity = 0;
        }
        if (e.object.material.color) {
          e.object.material.wireframe = false;
        }
        e.object.material.wireframe = false;
      } else {
        e.object.material.color.set((x + y) % 2 === 0 ? 'white' : 'gray');
      }
    };

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const color = (x + y) % 2 === 0 ? 'white' : 'gray';
        const isPath = paths.some(([px, py]) => px === x && py === y);

        const handleClick = () => {
          if (selected) {
            if (isPath) dispatch(move([x, y]));
            else dispatch(unselect());
          }
        };

        const material = isPath ? (
          <shaderMaterial
            attach="material"
            args={[gradientShader]}
            uniforms={{
              color1: { value: new THREE.Color(0x0000ff) },
              color2: { value: new THREE.Color(0x00ffff) },
              time: { value: 0.1 },
            }}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={isPath ? 'blue' : color}
            emissiveIntensity={isPath ? 1.5 : 0}
          />
        );

        out.push(
          <group key={`tile-${x}-${y}`}>
            <mesh
              position={[x - offset, 0, y - offset]}
              key={`tile-${x}-${y}`}
              onClick={handleClick}
              onPointerOver={(e) => handleHoverIn(e, isPath)}
              onPointerOut={(e) => handleHoverOut(e, isPath, x, y)}>
              <boxGeometry args={[1, 0.1, 1]} />
              {material}
            </mesh>
          </group>
        );
      }
    }

    return out;
  }, [paths, selected, dispatch]);

  return <>{tiles}</>;
};

export default BoardTiles;
