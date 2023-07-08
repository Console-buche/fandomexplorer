import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { PathName, useStoreNav } from '@/stores/storeNav';
import { useStoreSearch } from '@/stores/storeSearch';
import { capitalizeFirstLetter } from '@/utils/strings';
import Poppins from '@fonts/Poppins-Black.ttf';
import {
  Instance,
  Instances,
  Plane,
  Text,
  useTexture,
} from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BufferGeometry,
  MathUtils,
  MeshStandardMaterial,
  ShaderMaterial,
} from 'three';
import {
  fragmentShaderHolonavigation,
  vertexShaderHolonavigation,
} from './holoNavitationMaterial.shader';

type HolonavigationButton = {
  mat: MeshStandardMaterial;
  index: number;
  status: CharacterSchema['status'];
} & GroupProps;

export const HolonavigationButton = ({
  status,
  index,
  mat,
  ...props
}: HolonavigationButton) => {
  const icon = useTexture(`assets/icon_${status.toLowerCase()}.png`);
  const doorFrame = useTexture(`assets/icon_door.png`);
  const doorBottom = useTexture(`assets/icon_door_bottom.png`);
  const doorTop = useTexture(`assets/icon_door_top.png`);
  const prevPath = useRef<PathName>(null);

  const currentPath = useStoreNav((state) => state.currentPath);

  const refShaderMat = useRef<ShaderMaterial>(null);
  const refDoor = useRef<BufferGeometry>(null);

  const uniforms = useMemo(
    () => ({
      uTextureTop: { value: doorTop },
      uTime: { value: 0 },
      uClipTop: { value: 0.935 },
      uClipBot: { value: 0.83 },
      uTextureBottom: { value: doorBottom },
      uIsOpen: { value: true },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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

  const leDoorPosition = useMemo(() => {
    const c = Array.from(
      {
        length: 2,
      },
      (_, i) => {
        return i === 1 ? 0 : 1;
      }
    );
    const tIndex = new Float32Array(c.flat());

    return tIndex;
  }, []);

  useFrame(() => {
    if (!refShaderMat.current) return;
    if (
      currentPath === '/' &&
      refShaderMat.current.uniforms.uTime.value < 0.07
    ) {
      refShaderMat.current.uniforms.uTime.value = MathUtils.clamp(
        refShaderMat.current.uniforms.uTime.value + 0.007 + index * 0.001,
        0,
        0.07
      );
      refShaderMat.current.uniformsNeedUpdate = true;
    }

    if (currentPath !== '/' && refShaderMat.current.uniforms.uTime.value > 0) {
      refShaderMat.current.uniforms.uTime.value = MathUtils.clamp(
        refShaderMat.current.uniforms.uTime.value - 0.007 - index * 0.001,
        0,
        0.07
      );
      refShaderMat.current.uniformsNeedUpdate = true;
    }
  });

  return (
    <group {...props} onClick={handleOnClick}>
      <Text
        color={isActive ? '#00ff00' : '#ffffff'}
        fontSize={0.033}
        font={Poppins}
        letterSpacing={-0.025}
        textAlign="left"
        anchorX={0.5}
        anchorY={-0.03}
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
        position-y={-0.027}
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

      <mesh position={[-0.42, -0.015, 0.001]}>
        <Instances>
          <shaderMaterial
            ref={refShaderMat}
            attach="material"
            uniforms={uniforms}
            fragmentShader={fragmentShaderHolonavigation}
            vertexShader={vertexShaderHolonavigation}
            transparent
          />
          <planeBufferGeometry args={[0.25, 0.13]} ref={refDoor}>
            <instancedBufferAttribute
              attach="attributes-doorPosition"
              array={leDoorPosition}
              itemSize={1}
              count={2}
            />
          </planeBufferGeometry>
          {Array.from({ length: 2 }, (_, i) => i).map((doorId) => (
            <Instance key={doorId} />
          ))}
        </Instances>
      </mesh>
    </group>
  );
};
