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
        position={[0, 6.75, -10]}
        textMaterial={textMaterial}
        delay={5}
      />
      <TypewriterText
        typewrittenText={`${character?.gender ? character.gender : ''}${type}`}
        position={[0.1, 4.5, -10]}
        delay={5}
        textMaterial={textMaterial}
      />



      <TypewriterText
        typewrittenText={character?.origin.name}
        delay={5}
        position={[0.1, 4, -10]}
        textMaterial={textMaterial}
      />

      <TypewriterText
        delay={5}
        prefix="ep. "
        maxWidth={8}
        letterSpacing={0.0175}
        typewrittenText={getEpisode(character?.episode ?? [])}
        position={[0.1, 3.5, -10]}
        textMaterial={textMaterial}
      />
    </mesh>
  );
};
