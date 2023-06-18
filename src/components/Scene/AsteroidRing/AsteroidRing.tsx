import { MeshProps } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DoubleSide, Mesh } from 'three';
import {
  asteroidRingFragmentShader,
  asteroidRingVertexShader,
} from './asteroidRingMaterial.shader';

type AsteroidRing = {
  radius: number;
} & MeshProps;

export const AsteroidRing = ({
  radius,
  renderOrder,
  ...meshProps
}: AsteroidRing) => {
  const meshRef = useRef<Mesh>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uRadius: {
        value: radius,
      },
    };
  }, [radius]);

  return (
    <mesh {...meshProps} ref={meshRef}>
      <circleBufferGeometry args={[radius]} />
      <shaderMaterial
        side={DoubleSide}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
        alphaTest={0.1}
        transparent
        fragmentShader={asteroidRingFragmentShader}
        vertexShader={asteroidRingVertexShader}
      />
    </mesh>
  );
};
