import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { HolonavigationButton } from './HolonavigationButton';

export const Holonavigation = () => {
  const holoNavigationMaterial = useMemo(() => {
    return new MeshStandardMaterial();
  }, []);
  return (
    <group rotation-y={-0.2} position-x={-0.2} position-y={-0.2}>
      <HolonavigationButton
        position={[1.2, 0.35, 0]} // TODO : position relative to Screen coordinates, so it adapts to screen res
        status="Alive"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        position={[1.2, 0.25, 0]}
        status="Dead"
        mat={holoNavigationMaterial}
      />
      <HolonavigationButton
        position={[1.2, 0.15, 0]}
        status="unknown"
        mat={holoNavigationMaterial}
      />
    </group>
  );
};
