import { useStoreCharacter } from '@/stores/storeCharacter';
import { Plane, ScreenSpace, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { DoubleSide, MathUtils } from 'three';
import { Holoball } from './Holoball';
import { Holodetails } from './Holodetails/Holodetails';

export const Cockpit = () => {
  const tex = useTexture('assets/cockpit.png');
  const { camera } = useThree();

  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const depth = 1;

  const aspectRatio = window.innerWidth / window.innerHeight;
  const fieldOfView = MathUtils.degToRad(camera.fov);
  const heightAtDepth = 2 * Math.tan(fieldOfView / 2) * depth;
  const widthAtDepth = heightAtDepth * aspectRatio;

  return (
    <ScreenSpace depth={depth}>
      <Plane
        args={[widthAtDepth, heightAtDepth]}
        material-map={tex}
        material-transparent
        material-alphaTest={0.1}
        material-side={DoubleSide}
      />
      <Holoball
        position-z={-10}
        position-x={widthAtDepth * 3.9}
        position-y={-heightAtDepth}
      />
      {activeCharacter && (
        <Holodetails character={activeCharacter} position={[-1, 0, 0]} />
      )}
    </ScreenSpace>
  );
};
