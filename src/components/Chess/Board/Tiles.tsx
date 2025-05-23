import { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { shallowEqual } from 'react-redux';

import { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { move, unselect } from '../../../store/features/chess/chess-slice';
import { VECTORS } from '../../../constants';

const BoardTiles = () => {
  const { paths, selected, board, turn, isInCheck } = useAppSelector(
    (state: RootState) => ({
      paths: state.chess.paths,
      selected: state.chess.selected,
      board: state.chess.board,
      turn: state.chess.turn,
      isInCheck: state.chess.inCheck,
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
        texture: { type: 't', value: new THREE.Texture() },
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

    const redGradientShader = {
      uniforms: {
        color1: { type: 'c', value: new THREE.Color(0xff0020) },
        color2: { type: 'c', value: new THREE.Color(0xff0000) },
        texture: { type: 't', value: new THREE.Texture() },
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

    const handleHoverIn = (e: any, isPath: boolean, _code: string | null) => {
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
        if (e.object.material.emissive) {
          e.object.material.emissive.set(0x00ff00);
          e.object.material.emissiveIntensity = 0.3;
        }
        if (e.object.material.color) {
          e.object.material.color.set(0x00ff00);
          e.object.material.emissiveIntensity = 0.3;
        }
      }
    };

    const handleHoverOut = (e: any, isPath: boolean, x: number, y: number) => {
      if (isPath) {
        if (e.object.material.emissive) {
          try {
            e.object.material.emissive.set(0x0000ff);
          } catch (_) {
            console.log('Error setting emissive color', e.object.material);
          }
          e.object.material.emissiveIntensity = 0;
        }
        if (e.object.material.color) {
          e.object.material.wireframe = false;
        }
        e.object.material.wireframe = false;
      } else {
        if (e.object.material.emissive) {
          e.object.material.emissive.set((x + y) % 2 === 0 ? 'white' : 'gray');
          e.object.material.emissiveIntensity = 0;
        }
        if (e.object.material.color) {
          e.object.material.color.set((x + y) % 2 === 0 ? 'white' : 'gray');
        }
      }
    };

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const color = (x + y) % 2 === 0 ? 'white' : 'gray';
        const isPath = paths.some(([px, py]) => px === x && py === y);

        const handleClick = () => {
          if (!board[y][x] && selected && !isPath) {
            dispatch(unselect());
            return;
          }

          if (isPath && selected) {
            dispatch(move([x, y]));
          }
        };

        const material =
          isPath || (isInCheck[turn] && board[y][x] === `${turn}K`) ? (
            <shaderMaterial
              attach="material"
              args={
                isInCheck[turn] && !selected
                  ? [redGradientShader]
                  : [gradientShader]
              }
              uniforms={
                isInCheck[turn] && !selected
                  ? redGradientShader.uniforms
                  : gradientShader.uniforms
              }
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
              onPointerOver={(e) => handleHoverIn(e, isPath, board[y][x])}
              onPointerOut={(e) => handleHoverOut(e, isPath, x, y)}>
              <boxGeometry args={[1, 0.1, 1]} />
              {material}
            </mesh>

            {x == 0 && (
              <Text
                position={[x - offset - 1, 0.4, y - offset]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="top"
                rotation={
                  turn === 'b'
                    ? [-Math.PI / 4, 0, 0]
                    : [Math.PI / 4, Math.PI, 0]
                }>
                {y + 1}
              </Text>
            )}

            {(turn === 'b' ? y == board.length - 1 : y == 0) && (
              <Text
                position={
                  turn === 'b'
                    ? [x - offset, 0.4, y - offset + 1]
                    : [offset - x, 0.4, y - offset - 1]
                }
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="top"
                rotation={
                  turn === 'b'
                    ? [-Math.PI / 4, 0, 0]
                    : [Math.PI / 4, Math.PI, 0]
                }>
                {VECTORS.NAMINGS.HORIZONTAL[board[0].length - 1 - x]}
              </Text>
            )}
          </group>
        );
      }
    }

    return out;
  }, [paths, selected, dispatch, board, turn, isInCheck]);

  return <>{tiles}</>;
};

export default BoardTiles;
