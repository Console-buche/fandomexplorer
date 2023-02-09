import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Box, Instance } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InstancedBufferAttribute, Matrix4, Mesh, Vector3 } from 'three';
import { useStoreSearch } from '@/stores/storeSearch';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { positionOnCircleWithVariation } from '../AtomGroup/utils';

type Atom = {
  isActive?: boolean;
  speed: number;
  tileIndex: number;
  groupLength: number;
  character: CharacterSchema;
  refLePos: React.RefObject<InstancedBufferAttribute>;
  refLesSpeeds: React.RefObject<InstancedBufferAttribute>;
  refLeTime: React.RefObject<InstancedBufferAttribute>;
  refLeAnimationProgress: React.RefObject<InstancedBufferAttribute>;
  refLeIsSelected: React.RefObject<InstancedBufferAttribute>;
} & GroupProps;

function computeLookAtRotationMatrix(
  objectPosition: Vector3,
  targetPosition: Vector3,
  upDirection: Vector3
): Matrix4 {
  const zAxis = objectPosition.clone().sub(targetPosition).normalize();
  const xAxis = upDirection.clone().cross(zAxis).normalize();
  const yAxis = zAxis.clone().cross(xAxis).normalize();

  const rotationMatrix = new Matrix4();
  rotationMatrix.makeBasis(xAxis, yAxis, zAxis);

  return rotationMatrix;
}
export const AtomInstanced = ({
  character,
  speed,
  // position,
  isActive,
  groupLength,
  tileIndex,
  refLePos,
  refLeAnimationProgress,
  refLesSpeeds,
  refLeTime,
  refLeIsSelected,
  ...AtomProps
}: Atom) => {
  const ref = useRef<Mesh>(null);
  const refBox = useRef<Mesh>(null);
  const updateActiveCharacter = useStoreCharacter(
    (state) => state.updateActiveCharacter
  );
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);
  const currentSearch = useStoreSearch((state) => state.currentSearch);

  useEffect(() => {
    if (
      // (activeCharacter && character.name === activeCharacter.name) ||
      // (currentSearch.length === 0 && activeCharacter === undefined) ||
      // (character.name.toLowerCase().includes(currentSearch.toLowerCase()) &&
      //   refLeIsSelected.current) ||
      // currentSearch.length === 0 ||
      activeCharacter &&
      character.name === activeCharacter.name
    ) {
      refLeIsSelected.current.setX(tileIndex, 1);
    } else if (refLeIsSelected.current) {
      refLeIsSelected.current.setX(tileIndex, 0);
    }
    refLeIsSelected.current.needsUpdate = true;
  }, [currentSearch, activeCharacter]);

  const pos = useCallback(
    () =>
      positionOnCircleWithVariation({
        radius: Math.min(
          groupLength * 0.55,
          groupLength *
            0.55 *
            (refLeAnimationProgress?.current?.getX(tileIndex) ?? 0) *
            (refLesSpeeds.current?.getX(tileIndex) ?? 1)
        ),
        elementId: tileIndex,
        displacementFactor: 0,
        elementsCount: groupLength,
      }),
    [groupLength, refLeAnimationProgress, refLesSpeeds, tileIndex]
  );

  useFrame(({ camera, gl }) => {
    if (
      !ref.current ||
      !refLePos.current ||
      !refLeAnimationProgress.current ||
      !refLesSpeeds.current
    ) {
      return;
    }

    refLeAnimationProgress.current?.setX(
      tileIndex,
      refLeAnimationProgress.current.getX(tileIndex) + 0.1 ?? 0
    );

    refLePos.current.setXYZ(tileIndex, ...pos());
    refLePos.current.needsUpdate = true;
  });

  return (
    <group {...AtomProps}>
      <Box
        args={[2, 2, 1]}
        onPointerEnter={() => updateActiveCharacter(character)}
        onPointerLeave={() => updateActiveCharacter(undefined)}
        ref={refBox}
        position={pos()} // todo : this isn't shader based and needs updating in a rerender. Trigger rerender when animation is done. And this makes sense, cause you don't want to interact while animating
        material-transparent
        material-opacity={0}
        material-depthWrite={false}
      />
      <Instance ref={ref} position={pos()} />
    </group>
  );
};
