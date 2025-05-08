import useScrollDirection from '@/hooks/useScroll';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { PerspectiveCamera, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import {
  Euler,
  MathUtils,
  Matrix4,
  Vector3,
  PerspectiveCamera as PCam,
} from 'three';
import { getScrollDeltaFromDirection } from './utils';

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
let momentum = 0;

export const Cam = () => {
  const refCam = useRef<PCam>(null);
  const prevRotX = useRef<number>(0);

  const { pos, rotX, lookAt } = useStoreFandoms((state) =>
    state.rickAndMorty.getPositionFromCurrentFilter()
  );
  const prevLookAt = useRef<Vector3>(lookAt);

  const zoom = pos.z;

  const scroll = useScroll();
  const { scrollDirection, scrollMomentum } = useScrollDirection();

  const rollRotation = useRef<Euler>(new Euler(0, 0, 0));
  const lastFrameTime = useRef<number>(Date.now());

  useFrame(() => {
    if (!refCam.current) {
      return;
    }
    
    // Calculate time since last frame for consistent animation speed
    const now = Date.now();
    const deltaTime = Math.min((now - lastFrameTime.current) / 16.67, 2); // Cap at 2x normal speed
    lastFrameTime.current = now;
    
    const lerpedRotX = MathUtils.lerp(prevRotX.current, rotX, 0.05 * deltaTime);
    rollRotation.current.set(lerpedRotX, 0, 0);
    prevRotX.current = lerpedRotX;

    // Update momentum based on scroll direction
    if (scrollDirection !== 0) {
      // When actively scrolling, use scroll momentum
      momentum = scrollMomentum || 1;
    } else {
      // When not scrolling, quickly reduce momentum to zero
      momentum = Math.max(momentum * 0.9, 0);
    }

    // Calculate effective delta for smooth animation
    const effectiveDelta = Math.max(scroll.delta, 0.01) * deltaTime;
    
    // Apply momentum to the rotation only when scrolling
    const scrollEffect = scrollDirection !== 0 
      ? getScrollDeltaFromDirection(scrollDirection, effectiveDelta, 60) * momentum
      : 0; // Stop when not scrolling
    
    // Cap the maximum speed to prevent going inside rings
    const MAX_SPEED_PER_FRAME = 0.5;
    const cappedScrollEffect = Math.sign(scrollEffect) * Math.min(Math.abs(scrollEffect), MAX_SPEED_PER_FRAME);
    
    t += cappedScrollEffect;

    const lePos = getPositionOnCircle(zoom, t);

    // Rotate lePos by rollRotation
    const rollRotationMatrix = new Matrix4().makeRotationFromEuler(
      rollRotation.current
    );
    lePos.applyMatrix4(rollRotationMatrix);

    // Adjust lerp factor based on momentum for smoother transitions
    const lerpFactor = MathUtils.clamp(effectiveDelta * (0.5 + momentum * 0.5), 0.05, 0.71);
    refCam.current.position.lerp(lePos, lerpFactor);

    const rollUpVector = new Vector3(0, 1, 0).applyMatrix4(rollRotationMatrix);
    refCam.current.up.copy(rollUpVector);

    const newLookAt = prevLookAt.current.clone().lerp(lookAt, 0.1 * deltaTime);
    refCam.current.lookAt(newLookAt);

    prevLookAt.current = newLookAt;
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
