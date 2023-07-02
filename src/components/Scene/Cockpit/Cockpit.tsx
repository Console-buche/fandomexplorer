import { ScreenSpace } from '@react-three/drei';
import { Holodetails } from './Holodetails/Holodetails';
import { Holonavigation } from './Holonavigation';
import { Holocomputer } from './Holosearch';
import { Interior } from './Interior';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';
import { useStoreFandoms } from '@/stores/storeFandoms';

export const Cockpit = () => {
  const refGroup = useRef<Group>(null);

  const { lookAt } = useStoreFandoms((state) =>
    state.rickAndMorty.getPositionFromCurrentFilter()
  );

  useFrame(({ clock }) => {
    if (refGroup.current) {
      refGroup.current.position.y = MathUtils.lerp(
        refGroup.current.position.y,
        -MathUtils.clamp(lookAt.y, -1, 1),
        0.1
      );
    }
  });

  return (
    <ScreenSpace depth={1}>
      <group ref={refGroup}>
        <Interior />
        <Holodetails position-x={-7} position-y={-1.5} />
        <Holocomputer />
      </group>
      <Holonavigation position-x={-0.65} position-y={-0.2} />
    </ScreenSpace>
  );
};
