import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

let t = 0;
let time = 0;
export const CamWithOrbit = () => {
  const refCam = useRef<Camera>(null);
  const refLookAt = useRef(new Vector3(0, -100, 0));

  useEffect(() => {
    if (refCam) {
      refCam.current?.lookAt(
        new Vector3(refCam.current.position.x, refLookAt.current.y, 0)
      );
    }
  }, [refCam]);

  useFrame(({ mouse, clock }) => {
    if (!refCam || !refCam.current) {
      return;
    }
    t += 0.01;
    time += clock.getDelta();

    const isMouseWithinBorders =
      mouse.x > -1 && mouse.x < 1 && mouse.y > -1 && mouse.y < 1;
    const lookAtY = isMouseWithinBorders
      ? Math.sin(t * 0.9) * 3 + mouse.y * 10
      : refLookAt.current.y;
    const lookAtX = isMouseWithinBorders
      ? refCam.current.position.x + mouse.x * 10
      : refLookAt.current.x;
    const newLookAt = refLookAt.current.lerp(
      new Vector3(lookAtX, lookAtY, 0),
      0.3
    );

    // refCam.current?.lookAt(newLookAt);
  });

  return (
    <>
      <PerspectiveCamera
        ref={refCam}
        position={[0, -17, 225]}
        // position={[125, -8, 235]}
        fov={65}
        far={100000}
        makeDefault
      />
      {refCam.current && (
        <OrbitControls
          camera={refCam.current}
          dampingFactor={0.5}
          // maxPolarAngle={Math.PI / 2 - 0.023}
          autoRotate
          autoRotateSpeed={-0.02}
          // minPolarAngle={Math.PI / 2 - 0.023}
        />
      )}
      {/* <CameraShake ref={refCam} intensity={0.5} pitchFrequency={0.1} /> */}
    </>
  );
};
