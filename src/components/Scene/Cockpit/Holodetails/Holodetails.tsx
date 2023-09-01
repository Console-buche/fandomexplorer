import { useStoreCharacter } from '@/stores/storeCharacter';
import { TypewriterText } from '../../TypewriterText';
import { MeshProps } from '@react-three/fiber';
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';

function getEpisode(episodes: string[]) {
  return episodes.map((episode) => episode.split('/').pop()).join(', ');
}

export const Holodetails = (props: MeshProps) => {
  const character = useStoreCharacter((state) => state.activeCharacter);

  const type = character?.type ? ` - ${character?.type}` : '';

  const textMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        toneMapped: false,
        transparent: true,
        emissive: 'purple',
      }),

    []
  );

  return (
    <mesh {...props}>
      <TypewriterText
        fontSize={1.5}
        typewrittenText={character?.name}
        anchorX="center"
        position={[7, 7.5, -10]}
        textMaterial={textMaterial}
        delay={5}
      />
      <TypewriterText
        typewrittenText={`${character?.gender ? character.gender : ''}${type}`}
        position={[7, 5.5, -10]}
        anchorX="center"
        delay={5}
        textMaterial={textMaterial}
      />

      <TypewriterText
        typewrittenText={character?.origin.name}
        delay={5}
        anchorX="center"
        position={[7, 5, -10]}
        textMaterial={textMaterial}
      />

      <TypewriterText
        delay={5}
        prefix="ep. "
        maxWidth={13}
        letterSpacing={0.0175}
        anchorX="center"
        anchorY="top"
        typewrittenText={getEpisode(character?.episode ?? [])}
        position={[7, 4.5, -10]}
        textMaterial={textMaterial}
      />
    </mesh>
  );
};
