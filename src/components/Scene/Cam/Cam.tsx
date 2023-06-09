import useScrollDirection from '@/hooks/useScroll';
import { PerspectiveCamera, Sphere, useScroll } from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { BackSide, Euler, MathUtils, Matrix4, Mesh, Vector3 } from 'three';
import { getScrollDeltaFromDirection } from './utils';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useDebounce } from '@/hooks/useDebounce';

function getRotationMatrix(rotation: Vector3): THREE.Matrix4 {
  const euler = new Euler(rotation.x, rotation.y, rotation.z, 'XYZ');
  const rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationFromEuler(euler);
  return rotationMatrix;
}

function getPositionOnCircle(
  radius: number,
  angle: number,
  rotation: Vector3
): Vector3 {
  const position = new Vector3();
  const angleRadians = (angle * Math.PI) / 180;

  position.x = radius * Math.cos(angleRadians);
  position.y = -5;
  position.z = radius * Math.sin(angleRadians);

  const rotationMatrix = getRotationMatrix(rotation);

  return position.applyMatrix4(rotationMatrix);
}

let t = 0;
const CAM_RAD = 240;

export const Cam = () => {
  const [camRad, setCamRad] = useState(CAM_RAD);
  const refCam = useRef<Camera>(null);
  const refLookAt = useRef(new Vector3(0, -100, 0));
  const refSphere = useRef<Mesh>(null);
  const refSphereCast = useRef<Mesh>(null);

  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const m = useDebounce(activeCharacter, activeCharacter ? 100 : 1000);

  const refZoom = useRef(CAM_RAD);

  // TODO : get current circle rotation AND radius, and let's go
  // MAKE STORE
  const CURRENT_CIRCLE_ROTATION = 0.05;

  const scroll = useScroll();
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    if (refCam) {
      refCam.current?.lookAt(
        new Vector3(refCam.current.position.x, refLookAt.current.y, 0)
      );
    }
  }, [refCam]);

  useFrame(({ clock, camera, raycaster }) => {
    if (!refCam.current || !refSphere.current || !refSphereCast.current) {
      return;
    }
    t += getScrollDeltaFromDirection(scrollDirection, scroll.delta, 30);

    const zoom = m
      ? MathUtils.lerp(refZoom.current, 215, 0.3)
      : MathUtils.lerp(refZoom.current, CAM_RAD, 0.3);
    refZoom.current = zoom;

    const pos = getPositionOnCircle(
      zoom,
      t,
      new Vector3(CURRENT_CIRCLE_ROTATION, 0, 0)
    );
    refCam.current?.position.lerp(
      pos.add(new Vector3(0, Math.sin(clock.getElapsedTime()), 0)),
      0.5
    );

    const sphere = refSphere.current;

    // Getting lookAt from ray, as rotations may be a pain if cam's position is beyond 180deg
    raycaster.intersectObject(refSphereCast.current).forEach((i) => {
      sphere.position.copy(i.point);
    });

    refCam.current.lookAt(
      new Vector3().lerp(
        sphere.position.clone().add(new Vector3(0, -200, 0)),
        0.1
      )
    );

    refCam.current.rotateOnWorldAxis(
      new Vector3(1, 0, 0),
      CURRENT_CIRCLE_ROTATION
    );
  });

  return (
    <>
      <PerspectiveCamera
        ref={refCam}
        position={[0, -8, camRad]}
        fov={80}
        far={100000}
        near={0.1}
        makeDefault
      />
      <Sphere ref={refSphereCast} scale={500}>
        <meshBasicMaterial
          side={BackSide}
          transparent
          opacity={0.5}
          alphaTest={0.8}
        />
      </Sphere>
      <Sphere ref={refSphere} scale={10} visible={false} />
    </>
  );
};
