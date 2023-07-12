import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { useStoreNav } from '@/stores/storeNav';
import { useStoreSearch } from '@/stores/storeSearch';
import { Instance } from '@react-three/drei';
import { GroupProps, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BufferGeometry,
  DoubleSide,
  InstancedBufferAttribute,
  MathUtils,
  Matrix4,
  Mesh,
  Vector3,
} from 'three';
import {
  positionAlongVerticesSet,
  positionOnCircleWithVariation,
} from '../AtomGroup/utils';
import { filterCharacterByName } from './utils';

type Atom = {
  isActive?: boolean;
  speed: number;
  tileIndex: number;
  groupLength: number;
  character: CharacterSchema;
  refLePos: React.RefObject<InstancedBufferAttribute>;
  refLesSpeeds: React.RefObject<InstancedBufferAttribute>;
  refLeIsSearchTrue: React.RefObject<InstancedBufferAttribute>;
  refLeTime: React.RefObject<InstancedBufferAttribute>;
  refLeAnimationProgress: React.RefObject<InstancedBufferAttribute>;
  refLeIsShrinkAnimProgress: React.RefObject<InstancedBufferAttribute>;
  refLeAnimDisplacement: React.RefObject<InstancedBufferAttribute>;
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
  refLeIsShrinkAnimProgress,
  refLeAnimDisplacement,
  refLeIsSearchTrue,
  refLesSpeeds,
  refLeTime,
  refLeIsSelected,
  ...AtomProps
}: Atom) => {
  const ref = useRef<Mesh>(null);
  const refBox = useRef<Mesh>(null);
  const refBoxGeometry = useRef<BufferGeometry>(null);
  const prevPos = useRef<[number, number, number]>();

  const positions404 = useStoreNav((state) => state.positions404);

  // TODO : take this logic to a more appropriate place
  const currentPath = useStoreNav((state) => state.currentPath);

  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );

  const updateActiveCharacter = useStoreCharacter(
    (state) => state.updateActiveCharacter
  );
  const [isSelected, setIsSelected] = useState(false);
  const currentSearch = useStoreSearch((state) => state.currentSearch);

  const previous = useRef<CharacterSchema | undefined>(undefined);

  useEffect(() => {
    const currentChar = character;

    if (!isSelected && previous.current === character) {
      // FIXME : update only if previous selected character === this char
      updateActiveCharacter(undefined);
    }
    const timeout = setTimeout(() => {
      if (isSelected) {
        updateActiveCharacter(character);
        previous.current = currentChar;
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  useEffect(() => {
    const isCharacterFound = filterCharacterByName(character, currentSearch);
    if (refLeIsSearchTrue.current) {
      refLeIsSearchTrue.current.setX(
        tileIndex,
        isCharacterFound || currentSearch === '' ? 1 : 0
      );

      refLeIsSearchTrue.current.needsUpdate = true;
    }
  }, [refLeIsSearchTrue, currentSearch, character, tileIndex]);

  // TODO : here 404
  const posOn404 = useCallback(
    () =>
      positionAlongVerticesSet(
        positions404[character.status],
        groupLength,
        tileIndex
      ),
    [positions404, groupLength, tileIndex, character]
  );

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
      !refLeIsSelected.current ||
      !refLeAnimDisplacement.current ||
      !refLeIsShrinkAnimProgress.current ||
      !refLeIsSearchTrue.current
    ) {
      return;
    }
    time += 1;

    const animationProgress = refLeAnimationProgress.current.getX(tileIndex);
    const progressBasedOnCurrentPath =
      currentPath === '/' ? animationProgress + 0.1 : animationProgress - 0.1;

    const clampedProgress = MathUtils.clamp(
      progressBasedOnCurrentPath,
      0,
      1 / refLesSpeeds.current.getX(tileIndex)
    );

    // animate in
    refLeAnimationProgress.current?.setX(tileIndex, clampedProgress ?? 0);
    const circleOr404 = currentPath === '/' ? pos : posOn404;
    if (refLeIsSelected.current) {
      refLeIsSelected.current.setX(tileIndex, isSelected ? 1 : 0);
    }
    refLeIsSelected.current.needsUpdate = true;

    const targetPosAsVec3 = new Vector3(...circleOr404());
    const prevPosAsVec3 = new Vector3(...(prevPos.current ?? [0, 0, 0]));
    const lerpedPos = prevPosAsVec3.lerp(targetPosAsVec3, 0.1);

    refLePos.current.setXYZ(tileIndex, ...lerpedPos.toArray());
    prevPos.current = lerpedPos.toArray();

    // TODO : possible optimization here, do not call on every frame
    if (refBox.current) {
      const [x, y, z] = pos();
      const lookAt = new Vector3().copy(new Vector3(x, y, z)).normalize();
      refBox.current.lookAt(lookAt);
      refBox.current.position.set(x, y, z);
    }

    // SEARCH TRUE ANIM
    const isSearchTrue = refLeIsSearchTrue.current.getX(tileIndex);
    if (isSearchTrue) {
      refLeIsShrinkAnimProgress.current.setX(
        tileIndex,
        Math.min(refLeIsShrinkAnimProgress.current.getX(tileIndex) + 0.4, 1)
      );
    } else {
      refLeIsShrinkAnimProgress.current.setX(
        tileIndex,
        Math.max(refLeIsShrinkAnimProgress.current.getX(tileIndex) - 0.1, 0.05)
      );
    }
    refLeIsShrinkAnimProgress.current.needsUpdate = true;

    // SELECTION (CLICK/HOVER) ANIM
    const displacementAnimProgress =
      refLeAnimDisplacement.current.getX(tileIndex);

    if (isSelected) {
      refLeAnimDisplacement.current.setX(
        tileIndex,
        Math.min(displacementAnimProgress + displacementAnimProgress * 0.35, 2)
      );
      refLeAnimDisplacement.current.needsUpdate = true;
    } else if (!isSelected) {
      refLeAnimDisplacement.current.setX(
        tileIndex,
        Math.max(displacementAnimProgress - 0.35, 1)
      );
      refLeAnimDisplacement.current.needsUpdate = true;
    }

    refLePos.current.needsUpdate = true;
  });

  const handleOnPointerEnter = () => {
    if (activeStatus !== character.status) {
      return;
    }

    setIsSelected(true);
    // updateActiveCharacter(character);
  };

  const handleOnPointerLeave = () => {
    if (activeStatus !== character.status) {
      return;
    }
    setIsSelected(false);

    // updateActiveCharacter(undefined);
  };

  return (
    <>
      <mesh
        onPointerEnter={handleOnPointerEnter} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        onPointerLeave={handleOnPointerLeave} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        ref={refBox}
      >
        <circleBufferGeometry args={[1.5, 12, 12]} ref={refBoxGeometry} />
        <meshBasicMaterial
          side={DoubleSide}
          depthWrite={false}
          transparent
          opacity={0}
          toneMapped
        />
      </mesh>

      <Instance ref={ref} position={pos()} renderOrder={1} />
    </>
  );
};
