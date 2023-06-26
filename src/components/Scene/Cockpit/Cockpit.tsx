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
        position-x={-15}
        // rotation-y={0.2}
        position-y={-1}
      />
      <Holocomputer />
      <Holonavigation position-x={-0.65} position-y={-0.2} />
    </ScreenSpace>
  );
};
