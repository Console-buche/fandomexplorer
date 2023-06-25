import useScrollDirection from '@/hooks/useScroll';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { PerspectiveCamera, useScroll } from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Euler, MathUtils, Matrix4, Vector3 } from 'three';
import { getScrollDeltaFromDirection } from './utils';

function getBezierPoint(
  t: number,
  p0: Vector3,
  p1: Vector3,
  p2: Vector3
): Vector3 {
  const oneMinusT = 1 - t;
  return new Vector3(
    oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
    oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
    oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z
  );
}

function getPositionOnCircle(radius: number, angle: number): Vector3 {
  const position = new Vector3();
  const angleRadians = (angle * Math.PI + 100) / 180;

  const normalizedPosition = new Vector3(
    Math.cos(angleRadians),
    0,
    Math.sin(angleRadians)
  );

  normalizedPosition.multiplyScalar(radius);

  position.copy(normalizedPosition);

  return position;
}

let t = 0;

export const Cam = () => {
  const refCam = useRef<Camera>(null);
  const prevRotX = useRef<number>(0);

  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );

  const { pos, rotX } = useStoreFandoms((state) =>
    state.rickAndMorty.getPositionFromCurrentFilter()
  );

  const zoom = pos.z;

  const scroll = useScroll();
  const scrollDirection = useScrollDirection();

  const rollRotation = useRef<Euler>(new Euler(0, 0, 0));
  const lookAtTarget = new Vector3(0, 0, 0); // Look-at target

  useFrame(() => {
    if (!refCam.current) {
      return;
    }
    const lerpedRotX = MathUtils.lerp(prevRotX.current, rotX, 0.05);

    rollRotation.current.set(lerpedRotX, 0, 0);

    prevRotX.current = lerpedRotX;

    t += getScrollDeltaFromDirection(scrollDirection, scroll.delta, 60);

    const lePos = getPositionOnCircle(zoom, t);

    // Rotate lePos by rollRotation
    const rollRotationMatrix = new Matrix4().makeRotationFromEuler(
      rollRotation.current
    );
    lePos.applyMatrix4(rollRotationMatrix);

    refCam.current.position.lerp(lePos, 0.1);

    const rollUpVector = new Vector3(0, 1, 0).applyMatrix4(rollRotationMatrix);

    refCam.current.up.copy(rollUpVector);

    refCam.current.lookAt(lookAtTarget);
  });

  return (
    <PerspectiveCamera
      ref={refCam}
      fov={80}
      far={100000}
      near={0.1}
      makeDefault
    />
  );
};
