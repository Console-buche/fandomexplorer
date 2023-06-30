import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { useStoreSearch } from '@/stores/storeSearch';
import { capitalizeFirstLetter } from '@/utils/strings';
import Poppins from '@fonts/Poppins-Black.ttf';
import { Plane, Text, useTexture } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { useMemo } from 'react';
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
  const icon = useTexture(`assets/icon_${status.toLowerCase()}.png`);

  const countPerStatus = useStoreSearch((state) => state.countPerStatus);

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

  const buttonMaterialActive = useMemo(
    () =>
      new MeshStandardMaterial({
        emissive: 'purple',
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    []
  );

  const isActive = activeStatus === status;

  const buttonMaterial = useMemo(() => new MeshStandardMaterial(), []);
  return (
    <group {...props} onClick={handleOnClick}>
      <Text
        color={isActive ? '#00ff00' : '#ffffff'}
        fontSize={0.06}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.5}
        material={isActive ? buttonMaterialActive : buttonMaterial}
      >
        {capitalizeFirstLetter(status)}
      </Text>
      <Text
        color={isActive ? '#00ff00' : '#ffffff'}
        fontSize={0.05}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.5}
        position-y={-0.05}
        material={isActive ? buttonMaterialActive : buttonMaterial}
      >
        {countPerStatus[status]}
      </Text>
      <Plane
        args={[0.1, 0.1]}
        position={[-0.56, -0.01, -0.01]}
        material-map={icon}
        material-transparent
        material-alphaTest={0.5}
      />
    </group>
  );
};
