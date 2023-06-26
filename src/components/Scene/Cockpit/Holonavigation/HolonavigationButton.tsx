import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import Poppins from '@fonts/Poppins-Black.ttf';
import { Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';

type HolonavigationButton = {
  mat: MeshStandardMaterial;
  status: CharacterSchema['status'];
} & GroupProps;

export const HolonavigationButton = ({
  status,
  mat,
  ...props
}: HolonavigationButton) => {
  const updateActiveStatus = useStoreFandoms(
    (state) => state.rickAndMorty.updateActiveStatus
  );
  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );

  const updateActiveCharacter = useStoreCharacter(
    (state) => state.updateActiveCharacter
  );

  function handleOnClick() {
    updateActiveStatus(status);
    updateActiveCharacter(undefined);
  }

  return (
    <group {...props} onClick={handleOnClick}>
      <Text
        // position={position}
        color={activeStatus === status ? '#00ff00' : '#ffffff'}
        fontSize={0.05}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.5}
      >
        {activeStatus === status ? `[${status}]` : status}
      </Text>
    </group>
  );
};
