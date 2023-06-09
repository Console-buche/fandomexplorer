import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreSearch } from '@/stores/storeSearch';
import { Box, Instance } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InstancedBufferAttribute, Matrix4, Mesh, Vector3 } from 'three';
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

let time = 0;
export const AtomInstanced = ({
  character,
  speed,
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
  const [isSelected, setIsSelected] = useState(false);
  // const activeCharacter = useStoreCharacter((state) => state.activeCharacter);
  const currentSearch = useStoreSearch((state) => state.currentSearch);

  useEffect(() => {
    if (isSelected) {
      updateActiveCharacter(character);
    }
  }, [isSelected, updateActiveCharacter, character]);

  const pos = useCallback(
    (displacementFactor = 0) =>
      positionOnCircleWithVariation({
        radius: Math.min(
          groupLength * 0.475,
          groupLength *
            0.475 *
            (refLeAnimationProgress?.current?.getX(tileIndex) ?? 0) *
            (refLesSpeeds.current?.getX(tileIndex) ?? 1)
        ),
        elementId: tileIndex,
        displacementFactor,
        elementsCount: groupLength,
      }),
    [groupLength, refLeAnimationProgress, refLesSpeeds, tileIndex]
  );

  // TODO : don't have to check every frame here ?
  useFrame(({ camera, gl }) => {
    if (
      !ref.current ||
      !refLePos.current ||
      !refLeAnimationProgress.current ||
      !refLesSpeeds.current ||
      !refLeIsSelected.current
    ) {
      return;
    }
    time += 1;

    // animate in
    refLeAnimationProgress.current?.setX(
      tileIndex,
      refLeAnimationProgress.current.getX(tileIndex) + 0.1 ?? 0
    );

    if (refLeIsSelected.current) {
      refLeIsSelected.current.setX(tileIndex, isSelected ? 1 : 0);
    }
    refLeIsSelected.current.needsUpdate = true;

    refLePos.current.setXYZ(tileIndex, ...pos());
    refLePos.current.needsUpdate = true;
  });

  const handleOnPointerEnter = () => {
    setIsSelected(true);
    updateActiveCharacter(character);
  };

  const handleOnPointerLeave = () => {
    setIsSelected(false);
    updateActiveCharacter(undefined);
  };

  return (
    <>
      <Box
        args={[2, 2, 1]}
        onPointerEnter={handleOnPointerEnter} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        onPointerLeave={handleOnPointerLeave} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        // onPointerEnter={() => updateActiveCharacter(character)} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        // onPointerLeave={() => updateActiveCharacter(undefined)}
        ref={refBox}
        position={pos()} // todo : this isn't shader based and needs updating in a rerender. Trigger rerender when animation is done. And this makes sense, cause you don't want to interact while animating
        material-transparent
        material-opacity={0}
        material-depthWrite={false}
      />
      <Instance ref={ref} position={pos()} />
    </>
  );
};
