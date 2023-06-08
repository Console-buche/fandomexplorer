import useScrollDirection from '@/hooks/useScroll';
import {
  CameraShake,
  PerspectiveCamera,
  Plane,
  Sphere,
  useScroll,
} from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { BackSide, Euler, Matrix4, Mesh, Vector3 } from 'three';

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

  const scroll = useScroll();
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    if (refCam) {
      refCam.current?.lookAt(
        new Vector3(refCam.current.position.x, refLookAt.current.y, 0)
      );
    }
  }, [refCam]);

  useFrame(({ mouse, clock, camera, raycaster }) => {
    if (!refCam.current || !refSphere.current || !refSphereCast.current) {
      return;
    }
    t +=
      scrollDirection === -1
        ? -scroll.delta * 30
        : scrollDirection === 1
        ? scroll.delta * 30
        : 0;
    time += clock.getDelta();

    const isMouseWithinBorders =
      mouse.x > -1 && mouse.x < 1 && mouse.y > -1 && mouse.y < 1;

    const lookAtY = isMouseWithinBorders
      ? mouse.y * 10 - 50
      : refLookAt.current.y;

    const lookAtX = isMouseWithinBorders
      ? 0 + mouse.x * 100
      : refLookAt.current.x;

    const newLookAt = refLookAt.current.lerp(
      new Vector3(lookAtX, lookAtY, 0),
      0.03
    );

    const pos = getPositionOnCircle(
      camera.position,
      CAM_RAD,
      t,
      new Vector3(0.05, 0, 0)
    );
    refCam.current?.position.lerp(pos, 0.5);
    // refCam.current.lookAt(newLookAt);

    const sphere = refSphere.current;
    refSphereCast.current.lookAt(camera.position);

    raycaster.intersectObject(refSphereCast.current).forEach((i) => {
      sphere.position.copy(i.point);
    });

    refCam.current.lookAt(
      new Vector3().lerp(
        sphere.position.clone().add(new Vector3(0, -400, 0)),
        0.1
      )
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
      <CameraShake intensity={0.5} pitchFrequency={0.1} />
    </>
  );
};
