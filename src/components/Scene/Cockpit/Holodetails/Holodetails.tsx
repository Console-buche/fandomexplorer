import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { MeshProps } from '@react-three/fiber';
import { TypewriterText } from '../../TypewriterText';

type Holodetails = {
  character: CharacterSchema;
} & MeshProps;

export const Holodetails = ({ character, ...props }: Holodetails) => {
  return (
    <mesh {...props} position={[-0.5, -0, -5]}>
      <mesh rotation-y={0.5} rotation-={0.5}>
        <planeBufferGeometry args={[0.3, 0.25]} />
        <meshBasicMaterial map={character.image} />
      </mesh>
      <TypewriterText
        typewrittenText={character.name}
        position={[0, -1, -10]}
      />
    </mesh>
  );
};
