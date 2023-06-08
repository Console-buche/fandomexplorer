import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { OrbitControls, ScrollControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { GridReactInstanced } from './Grid/GridReactInstanced';

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const { data } = characterData;
  if (!data) {
    return null;
  }

  return (
    <Canvas gl={{ alpha: true }} dpr={[1, 2]}>
      <ambientLight />
      <Stars depth={500} />

      <ScrollControls infinite pages={3} damping={0}>
        <Cam />
        <Cockpit />
        <GridReactInstanced status="Alive" characters={data} roxX={0.05} />
        <GridReactInstanced
          status="Dead"
          characters={data}
          roxX={Math.PI / 3}
        />
        <GridReactInstanced
          status="unknown"
          characters={data}
          roxX={Math.PI / -3}
        />
      </ScrollControls>
    </Canvas>
  );
};
