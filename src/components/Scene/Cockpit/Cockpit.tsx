import { useStoreCharacter } from '@/stores/storeCharacter';
import {
  Box,
  Plane,
  ScreenSpace,
  useScroll,
  useTexture,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, MathUtils, Mesh, PerspectiveCamera } from 'three';
import { Holoball } from './Holoball';
import { Holodetails } from './Holodetails/Holodetails';
import useScrollDirection from '@/hooks/useScroll';

let scrollTiltBuffer = 0;

export const Cockpit = () => {
  const tex = useTexture('assets/cockpit_cut.png');
  const three = useThree();
  const camera = three.camera as PerspectiveCamera;
  const ref = useRef<Mesh>(null);

  const scrollDirection = useScrollDirection();
  const scroll = useScroll();

  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const depth = 1;

  const size = useMemo(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const fieldOfView = MathUtils.degToRad(camera.fov);
    const heightAtDepth = 2 * Math.tan(fieldOfView / 2) * depth;
    const widthAtDepth = heightAtDepth * aspectRatio;

    return { widthAtDepth, heightAtDepth };
  }, [camera.fov]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // if (scroll.delta > 0) {
    //   scrollTiltBuffer = MathUtils.clamp(scrollTiltBuffer + scroll.delta, 0, 5);
    // } else {
    //   scrollTiltBuffer = MathUtils.clamp(scrollTiltBuffer - 0.03, 0, 2);
    // }

    // const lerpedRot = MathUtils.lerp(
    //   ref.current.rotation.z,
    //   scrollTiltBuffer > 2 ? scrollDirection * 0.05 : 0,
    //   0.1
    // );

    // ref.current.rotation.z = lerpedRot;
  });
  return (
    <ScreenSpace depth={depth}>
      <Plane
        scale={1.01}
        ref={ref}
        args={[size.widthAtDepth, size.heightAtDepth]}
        material-map={tex}
        material-alphaTest={0.1}
      />
      <Holoball
        position-z={-10}
        position-x={size.widthAtDepth * 3.9}
        position-y={-size.heightAtDepth}
      />
      {activeCharacter && <Holodetails character={activeCharacter} />}
    </ScreenSpace>
  );
};
