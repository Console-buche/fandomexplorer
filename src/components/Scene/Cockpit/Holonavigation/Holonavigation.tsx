import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { HolonavigationButton } from './HolonavigationButton';
import { GroupProps } from '@react-three/fiber';

export const Holonavigation = (props: GroupProps) => {
  const holoNavigationMaterial = useMemo(() => {
    return new MeshStandardMaterial();
  }, []);
  return (
    <group {...props}>
      <HolonavigationButton
        position={[1.6, 0.95, 0]} // TODO : position relative to Screen coordinates, so it adapts to screen res
        // position={[0, 0.35, 0]} // TODO : position relative to Screen coordinates, so it adapts to screen res
        status="Alive"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        position={[1.95, 0.95, 0]}
        // position={[0, 0.25, 0]}
        status="Dead"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        // position={[0, 0.15, 0]}
        position={[2.25, 0.95, 0]}
        status="unknown"
        mat={holoNavigationMaterial}
      />
    </group>
  );
};
