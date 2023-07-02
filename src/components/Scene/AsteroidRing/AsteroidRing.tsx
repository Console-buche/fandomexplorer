import { MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { DoubleSide, Mesh, ShaderMaterial } from 'three';
import {
  asteroidRingFragmentShader,
  asteroidRingVertexShader,
} from './asteroidRingMaterial.shader';
import { useStoreNav } from '@/stores/storeNav';

type AsteroidRing = {
  radius: number;
} & MeshProps;

function updateAlphaProgressively(
  alpha: number,
  targetAlpha: number,
  speed: number
) {
  if (alpha === targetAlpha) return alpha;

  const diff = targetAlpha - alpha;
  const step = Math.sign(diff) * speed;

  if (Math.abs(diff) < Math.abs(step)) {
    return targetAlpha;
  }

  return alpha + step;
}

export const AsteroidRing = ({
  radius,
  renderOrder,
  ...meshProps
}: AsteroidRing) => {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ShaderMaterial>(null);
  const currentPath = useStoreNav((state) => state.currentPath);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uAlpha: { value: currentPath === '/' ? 1 : 0 },
      uRadius: {
        value: radius,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (!matRef.current) return;

    const currentAlpha = matRef.current.uniforms.uAlpha.value;
    matRef.current.uniforms.uAlpha.value =
      currentPath === '/'
        ? updateAlphaProgressively(currentAlpha, 1, 0.025)
        : updateAlphaProgressively(currentAlpha, 0, 0.075);
    matRef.current.uniformsNeedUpdate = true;
  });

  return (
    <mesh {...meshProps} ref={meshRef}>
      <circleBufferGeometry args={[radius, 128]} />
      <shaderMaterial
        ref={matRef}
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
