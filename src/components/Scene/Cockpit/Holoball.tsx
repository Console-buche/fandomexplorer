import { PerspectiveCamera, RenderTexture } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Camera, Mesh, Vector3 } from 'three';
import { Galaxy } from './galaxy/galaxy';

export const Holoball = (props: MeshProps) => {
  const ref = useRef<Mesh>(null);
  const refCam = useRef<Camera>(null);

  useEffect(() => {
    if (refCam.current) {
      refCam.current.lookAt(new Vector3(0, 0, 0));
    }
  }, [refCam]);
  return (
    <mesh ref={ref} {...props} rotation-y={-Math.PI / 2}>
      <planeBufferGeometry args={[5, 5]} />

      <meshBasicMaterial transparent>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera
            ref={refCam}
            makeDefault
            fov={50}
            manual
            position={[0.2, 0.35, 3.5]}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />

          <Galaxy position-z={2} position-x={0.1} />
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
