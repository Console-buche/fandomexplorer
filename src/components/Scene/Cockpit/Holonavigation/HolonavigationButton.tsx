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
  const doorFrame = useTexture(`assets/icon_door.png`);
  const doorBottom = useTexture(`assets/icon_door_bottom.png`);
  const doorTop = useTexture(`assets/icon_door_top.png`);

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
        fontSize={0.033}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.51}
        anchorY={-0.025}
        material={isActive ? buttonMaterialActive : buttonMaterial}
      >
        {capitalizeFirstLetter(status)}
      </Text>
      <Text
        color={isActive ? '#00ff00' : '#ffffff'}
        fontSize={0.035}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.5}
        position-y={-0.035}
        material={isActive ? buttonMaterialActive : buttonMaterial}
      >
        {countPerStatus[status]}
      </Text>
      <Plane
        args={[0.1, 0.1]}
        position={[-0.56, -0.01, 0.0013]}
        material-map={icon}
        material-transparent
        material-alphaTest={0.5}
      />
      <Plane
        args={[0.25, 0.13]}
        position={[-0.42, -0.01, 0.0012]}
        material-map={doorFrame}
        material-transparent
        material-alphaTest={0.5}
      />
      <Plane
        args={[0.25, 0.13]}
        position={[-0.42, -0.02, 0.001]}
        material-map={doorBottom}
        material-transparent
        material-alphaTest={0.5}
      />
      <Plane
        args={[0.25, 0.13]}
        position={[-0.42, -0.03, 0.0011]}
        material-map={doorTop}
        material-transparent
        material-alphaTest={0.5}
      />
    </group>
  );
};
