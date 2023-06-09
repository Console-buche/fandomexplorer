import useScrollDirection from '@/hooks/useScroll';
import { PerspectiveCamera, Sphere, useScroll } from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { BackSide, Euler, Matrix4, Mesh, Vector3 } from 'three';
import { getScrollDeltaFromDirection } from './utils';

function getRotationMatrix(rotation: Vector3): THREE.Matrix4 {
  const euler = new Euler(rotation.x, rotation.y, rotation.z, 'XYZ');
  const rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationFromEuler(euler);
  return rotationMatrix;
}

function getPositionOnCircle(
  pos: Vector3,
  radius: number,
  angle: number,
  rotation: Vector3
): Vector3 {
  const position = new Vector3();
  const angleRadians = (angle * Math.PI) / 180; // Convert angle to radians

  position.x = radius * Math.cos(angleRadians);
  position.y = -5;
  position.z = radius * Math.sin(angleRadians);

  const rotationMatrix = getRotationMatrix(rotation);

  return position.applyMatrix4(rotationMatrix);
}

let t = 0;
let time = 0;
const CAM_RAD = 240;

export const Cam = () => {
  const refCam = useRef<Camera>(null);
  const refLookAt = useRef(new Vector3(0, -100, 0));
  const refSphere = useRef<Mesh>(null);
  const refSphereCast = useRef<Mesh>(null);

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

    time += clock.getDelta();

    const pos = getPositionOnCircle(
      camera.position,
      CAM_RAD,
      t,
      new Vector3(CURRENT_CIRCLE_ROTATION, 0, 0)
    );
    refCam.current?.position.lerp(pos, 0.5);

    const sphere = refSphere.current;
    refSphereCast.current.lookAt(camera.position);

    // Note for future me :
    // getting lookAt from ray, as rotations may be a pain if cam's position is beyond 180deg

    raycaster.intersectObject(refSphereCast.current).forEach((i) => {
      sphere.position.copy(i.point);
    });

    refCam.current.lookAt(
      new Vector3().lerp(
        sphere.position.clone().add(new Vector3(0, -400, 0)),
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
        position={[0, -8, CAM_RAD]}
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
