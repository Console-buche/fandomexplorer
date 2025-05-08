import { ScreenSpace } from '@react-three/drei';
import { Holodetails } from './Holodetails/Holodetails';
import { Holonavigation } from './Holonavigation';
import { Holocomputer } from './Holosearch';
import { Interior } from './Interior';
import { useEffect, useRef } from 'react';
import { Group, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';
import { useStoreNav } from '@/stores/storeNav';
import { shallow } from 'zustand/shallow';
import useScrollDirection from '@/hooks/useScroll';

// TODO : fine tune oscillation to something realistic and niec
// move camera just a bit towards the lookAt dir when transitionning, to give impression of looking around in cockpit but don't look cockpit itself

let t = 0;
type Oscillator = (time: number) => number;

function createDecayingOscillator(dampingFactor = 0.06): Oscillator {
  if (dampingFactor <= 0) {
    throw new Error('Damping factor should be greater than 0');
  }

  return (time: number) => {
    return Math.exp(-dampingFactor * time) * Math.sin(2 * Math.PI * time);
  };
}

export const Cockpit = () => {
  const refGroup = useRef<Group>(null);
  const { scrollDirection } = useScrollDirection();

  const { currentPath, previousPath } = useStoreNav(
    (state) => ({
      currentPath: state.currentPath,
      previousPath: state.previousPath,
    }),
    shallow
  );

  const m = createDecayingOscillator();
  useEffect(() => {
    if (currentPath !== previousPath) {
      t = 0;
    }
  }, [currentPath, previousPath]);

  useFrame(() => {
    if (!refGroup.current) {
      return;
    }

    t += 0.96;
    if (Math.abs(m(t)) > 0.001) {
      refGroup.current.position.y = MathUtils.lerp(
        refGroup.current?.position.y,
        m(t) * 0.25 - 0.025,
        0.1
      );
    }

    if (scrollDirection > 0) {
      refGroup.current.rotation.z = MathUtils.lerp(
        refGroup.current.rotation.z,
        0.0125,
        0.05
      );
    } else if (scrollDirection < 0) {
      refGroup.current.rotation.z = MathUtils.lerp(
        refGroup.current.rotation.z,
        -0.0125,
        0.05
      );
    } else {
      refGroup.current.rotation.z = MathUtils.lerp(
        refGroup.current.rotation.z,
        0,
        0.025
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
