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

  if (!character) {
    return null;
  }
  return (
    <mesh {...props} rotation-y={0.2}>
      <TypewriterText
        typewrittenText={character?.status}
        position={[0, 4, -10]}
      />
      <TypewriterText
        typewrittenText={getHumanReadableDate(character?.created)}
        position={[0, 3, -10]}
      />
      <TypewriterText
        typewrittenText={character?.name}
        position={[0, 2, -10]}
      />

      <TypewriterText
        typewrittenText={`${character?.gender}${type}`}
        position={[0, -1, -10]}
      />

      <TypewriterText
        typewrittenText={character?.origin.name}
        position={[0, -2, -10]}
      />

      <TypewriterText
        prefix="ep. "
        typewrittenText={getEpisode(character?.episode ?? [])}
        position={[0, -3, -10]}
      />
    </mesh>
  );
};
