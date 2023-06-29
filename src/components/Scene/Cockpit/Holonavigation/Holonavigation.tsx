import { GroupProps } from '@react-three/fiber';
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { HolonavigationButton } from './HolonavigationButton';

export const Holonavigation = (props: GroupProps) => {
  const holoNavigationMaterial = useMemo(() => {
    return new MeshStandardMaterial();
  }, []);
  return (
    <group {...props}>
      <HolonavigationButton
        position={[1.45, 0.95, 0]} // TODO : position relative to Screen coordinates, so it adapts to screen res
        status="Alive"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        position={[1.875, 0.95, 0]}
        status="Dead"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        position={[2.25, 0.95, 0]}
        status="unknown"
        mat={holoNavigationMaterial}
      />
    </group>
  );
};
