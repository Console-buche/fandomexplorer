import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreSearch } from '@/stores/storeSearch';
import { Box, Instance, Plane } from '@react-three/drei';
import {
  GroupProps,
  PlaneBufferGeometryProps,
  useFrame,
} from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BufferGeometry,
  DoubleSide,
  InstancedBufferAttribute,
  Matrix4,
  Mesh,
  Vector3,
} from 'three';
import { positionOnCircleWithVariation } from '../AtomGroup/utils';
import { calculateLookAt, filterCharacterByName } from './utils';

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

  useEffect(() => {
    if (refBox.current) {
      const [x, y, z] = pos();
      refBox.current.lookAt(new Vector3(x, y, z));
      // if (refBox.current) {
      //   refBox.current.rotateX(Math.PI * 0.5);
      // }
    }
  }, [pos]);

  // TODO : don't have to check every frame here ?
  useFrame(({ camera, gl }) => {
    if (
      !ref.current ||
      !refLePos.current ||
      !refLeAnimationProgress.current ||
      !refLesSpeeds.current ||
      !refLeIsSelected.current ||
      !refLeAnimDisplacement.current
    ) {
      return;
    }
    time += 1;

    const animationProgress = refLeAnimationProgress.current.getX(tileIndex);
    // animate in
    refLeAnimationProgress.current?.setX(
      tileIndex,
      animationProgress + 0.1 ?? 0
    );

    if (refLeIsSelected.current) {
      refLeIsSelected.current.setX(tileIndex, isSelected ? 1 : 0);
    }
    refLeIsSelected.current.needsUpdate = true;

    refLePos.current.setXYZ(tileIndex, ...pos());

    if (refBox.current) {
      const [x, y, z] = pos();
      const lookAt = new Vector3().copy(new Vector3(x, y, z)).normalize();
      refBox.current.lookAt(lookAt);
    }

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
    setIsSelected(true);
    // updateActiveCharacter(character);
  };

  const handleOnPointerLeave = () => {
    setIsSelected(false);

    // updateActiveCharacter(undefined);
  };

  return (
    <>
      <mesh
        onPointerEnter={handleOnPointerEnter} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        onPointerLeave={handleOnPointerLeave} // TODO : investigate lag on hover. Something recomputes and makes it hiccup
        ref={refBox}
        position={pos()} // todo : this isn't shader based and needs updating in a rerender. Trigger rerender when animation is done. And this makes sense, cause you don't want to interact while animating
      >
        <planeBufferGeometry args={[3, 3]} ref={refBoxGeometry} />
        <meshBasicMaterial
          side={DoubleSide}
          transparent
          opacity={0}
          toneMapped
        />
      </mesh>

      <Instance ref={ref} position={pos()} />
    </>
  );
};
