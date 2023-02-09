import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreSearch } from '@/stores/storeSearch';
import { useChain, useSpringRef, useSprings } from '@react-spring/three';
import { useBounds } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { positionInGrowingCircle } from '../AtomGroup/utils';
import { Cell } from '../Cell';

type Grid = {
  characters: CharacterSchema[];
  rowLength: number;
  position?: [number, number, number] | Vector3;
  children?: React.ReactNode;
};

export const GridCircle = ({ characters, rowLength, children }: Grid) => {
  const currentStatus = useStoreSearch((state) => state.currentStatus);
  const ref = useRef<Mesh>(null);

  const boxApi = useSpringRef();

  // const textures = useMemo(() => {
  //   const tMap = new Map<number, Texture>();

  //   characters.forEach((character) => {
  //     const texture = new TextureLoader().load(character.image);
  //     tMap.set(character.id, texture);
  //   });

  //   return tMap;
  // }, [characters]);

  const api = useBounds();
  useEffect(() => {
    if (api) {
      api.to({ position: [rowLength, 25, 15] });
    }
  }, [api, rowLength, characters]);

  const [boxSprings] = useSprings(characters.length, (i, c) => ({
    ref: boxApi,
    from: {
      scale: currentStatus.has(characters[i].status) ? 0 : 1,
    },
    to: {
      scale: currentStatus.has(characters[i].status) ? 1 : 0,
    },
    delay: characters.length * 3 - i * 3,
  }));

  function getImagePosition(elementId: number) {
    return positionInGrowingCircle({
      elementId,
      minElementSpacing: 3,
      initialRadius: 28,
      radiusIncrement: 2,
    });
  }

  useChain([boxApi], [0, 1], 0);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return null;
    }
  });

  return (
    <mesh ref={ref}>
      {children}
      <mesh position-x={61} position-y={9.75}>
        {characters.map((c, i) => (
          <Cell
            key={c.id}
            character={c}
            texture={c.image}
            position={getImagePosition(i)}
            scale={boxSprings[i].scale}
          />
        ))}
      </mesh>
    </mesh>
  );
};
