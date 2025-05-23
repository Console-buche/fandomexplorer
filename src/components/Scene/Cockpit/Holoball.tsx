import { PerspectiveCamera, RenderTexture } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Camera, Mesh } from 'three';

export const Holoball = (props: MeshProps) => {
  const ref = useRef<Mesh>(null);
  const refCam = useRef<Camera>(null);

  useEffect(() => {
    if (refCam.current) {
      // refCam.current.lookAt(new Vector3(0, 0, 0));
    }
  }, [refCam]);
  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[5, 5]} />

      <meshBasicMaterial transparent depthTest={false}>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera
            ref={refCam}
            makeDefault
            fov={50}
            position={[0.2, 0.35, 3.5]}
          />
          {/* <color attach="background" args={['#FFF']} /> */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />

        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
