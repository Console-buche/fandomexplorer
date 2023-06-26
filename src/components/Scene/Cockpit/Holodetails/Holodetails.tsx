import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { MeshProps } from '@react-three/fiber';
import { TypewriterText } from '../../TypewriterText';

type Holodetails = {
  character: CharacterSchema | undefined;
} & MeshProps;

function getEpisode(episodes: string[]) {
  return episodes.map((episode) => episode.split('/').pop()).join(', ');
}

function getHumanReadableDate(date: string | undefined) {
  if (!date) {
    return undefined;
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const Holodetails = ({ character, ...props }: Holodetails) => {
  const type = character?.type ? ` - ${character?.type}` : '';

  return (
    <mesh {...props}>
      <TypewriterText
        typewrittenText={character?.status}
        position={[0, 7, -10]}
      />
      <TypewriterText
        typewrittenText={getHumanReadableDate(character?.created)}
        position={[0, 6.5, -10]}
      />
      <TypewriterText
        typewrittenText={character?.name}
        position={[0, 6, -10]}
      />

      <TypewriterText
        typewrittenText={`${character?.gender ? character.gender : ''}${type}`}
        position={[0, 5, -10]}
      />

      <TypewriterText
        typewrittenText={character?.origin.name}
        position={[0, 4.5, -10]}
      />

      <TypewriterText
        prefix="ep. "
        maxWidth={10}
        letterSpacing={0.0175}
        typewrittenText={getEpisode(character?.episode ?? [])}
        position={[0, 4, -10]}
      />
    </mesh>
  );
};
