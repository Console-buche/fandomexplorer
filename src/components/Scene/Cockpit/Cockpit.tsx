import { useStoreCharacter } from '@/stores/storeCharacter';
import { ScreenSpace } from '@react-three/drei';
import { Holodetails } from './Holodetails/Holodetails';
import { Interior } from './Interior';
import { Holocomputer } from './Holosearch';
import { Holonavigation } from './Holonavigation';

export const Cockpit = () => {
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const depth = 1;

  return (
    <ScreenSpace depth={depth}>
      <Interior />
      <Holodetails
        character={activeCharacter}
        scale={0.1}
        position-x={-2.7}
        position-y={1}
      />
      <Holocomputer />
      <Holonavigation />
    </ScreenSpace>
  );
};
