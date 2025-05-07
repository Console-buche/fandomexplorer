import { useEffect, useRef, useState } from 'react';
import { Holosearch } from './Holosearch';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useStoreNav } from '@/stores/storeNav';
import { useTexture } from '@react-three/drei';
import { Color, Mesh, MeshLambertMaterial } from 'three';

export const Holocomputer = (props: MeshProps) => {
  const tex = useTexture('assets/windows_blue_screen.png');
  const [isEditing, setIsEditing] = useState(false);
  const currentPath = useStoreNav((state) => state.currentPath);
  const refMat = useRef<MeshLambertMaterial>(null);
  const ref = useRef<Mesh>(null);

  useEffect(() => {
    if (!refMat.current) return;

    if (currentPath !== '/') {
      refMat.current.map = tex;
      refMat.current.emissiveMap = tex;
      refMat.current.color = new Color('0x000000');
    } else {
      refMat.current.map = null;
      refMat.current.color = new Color('purple');
      refMat.current.emissiveMap = null;
    }

    refMat.current.needsUpdate = true;
  }, [currentPath, refMat, tex]);

  const opacity = isEditing ? 1 : currentPath !== '/' ? 0.1 : 0.1;
  const emissiveIntensity = isEditing ? 19 : currentPath !== '/' ? 20 : 0;

  // const opacity = isEditing ? 1 : 0.1;
  // const emissiveIntensity = isEditing ? 20 : 0;
  useFrame(() => {
    if (!ref.current) {
      return
    }
    ref.current.position.y = -0.23 + Math.sin(Date.now() * 0.001) * 0.005;
  })

  return (
    <mesh
      ref={ref}
      position={[-0.95, -0.24, 0.09]}
      rotation-y={0.25}
      rotation-x={0.15}
      onPointerEnter={() => currentPath === '/' && setIsEditing(true)}
      onPointerLeave={() => currentPath === '/' && setIsEditing(false)}
    >
      <planeGeometry args={[0.5, 0.2]} />
      <meshLambertMaterial
        color="purple"
        ref={refMat}
        toneMapped={false}
        emissive="purple"
        // map={tex}
        transparent
        opacity={opacity}
        // depthWrite={false}
        emissiveIntensity={emissiveIntensity}
      />

      {currentPath === '/' && <Holosearch isEditing={isEditing} />}
    </mesh>
  );
};
