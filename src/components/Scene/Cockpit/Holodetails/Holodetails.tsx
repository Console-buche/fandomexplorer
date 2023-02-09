import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { MeshProps } from '@react-three/fiber';
import { TypewriterText } from '../../TypewriterText';

type Holodetails = {
  character: CharacterSchema;
} & MeshProps;

export const Holodetails = ({ character, ...props }: Holodetails) => {
  return (
    <mesh {...props}>
      <planeBufferGeometry />
      <meshBasicMaterial map={character.image} />

      <TypewriterText typewrittenText={character.name} position={[0, 5, -10]} />
    </mesh>
  );
};
