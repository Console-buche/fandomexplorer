import useScrollDirection from '@/hooks/useScroll';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { Box, PerspectiveCamera, useScroll } from '@react-three/drei';
import { Camera, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Euler, MathUtils, Matrix4, Mesh, Quaternion, Vector3 } from 'three';
import { getScrollDeltaFromDirection } from './utils';

function getRotationMatrix(rotation: Vector3): Matrix4 {
  const euler = new Euler(rotation.x, rotation.y, rotation.z, 'XYZ');
  const rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationFromEuler(euler);
  return rotationMatrix;
}

function getPositionOnCircle(radius: number, angle: number): Vector3 {
  const position = new Vector3();
  const angleRadians = (angle * Math.PI) / 180;

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
  const refBox = useRef<Mesh>(null);

  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );

  const { pos, rotX } = useStoreFandoms((state) =>
    state.rickAndMorty.getPositionFromCurrentFilter()
  );

  const { pos: prevPos, rotX: prevRotX } = useStoreFandoms((state) =>
    state.rickAndMorty.getPositionFromPreviousFilter()
  );

  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  // TODO : get current circle rotation AND radius, and let's go
  const zoom = pos.z;

  const scroll = useScroll();
  const scrollDirection = useScrollDirection();

  const rollRotation = useRef<Euler>(new Euler(0, 0, 0));
  const lookAtTarget = new Vector3(0, 0, 0); // Look-at target

  useEffect(() => {
    rollRotation.current.set(rotX, 0, 0);
  }, [rotX]);

  useFrame(({ clock }) => {
    if (!refCam.current || !refBox.current) {
      return;
    }

    t += getScrollDeltaFromDirection(scrollDirection, scroll.delta, 60);

    const lePos = getPositionOnCircle(zoom, t);

    // Rotate lePos by rollRotation
    const rollRotationMatrix = new Matrix4().makeRotationFromEuler(
      rollRotation.current
    );
    lePos.applyMatrix4(rollRotationMatrix);

    refCam.current.position.lerp(lePos, 0.5);

    const rollUpVector = new Vector3(0, 1, 0).applyMatrix4(rollRotationMatrix);

    refCam.current.up.copy(rollUpVector);

    refCam.current.lookAt(lookAtTarget);
  });

  return (
    <>
      <PerspectiveCamera
        ref={refCam}
        fov={80}
        far={100000}
        near={0.1}
        makeDefault
      />
      <Box ref={refBox} scale={10} material-color="white" />
    </>
  );
};
