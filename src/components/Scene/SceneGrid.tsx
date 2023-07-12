import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { RingGrid } from './Grid/RingGrid';
import { Ambient } from './Lights';
import { PostProcess } from './PostProcess';
import { Page404 } from '@/pages/404/Page404';
import { Star } from './Stars/Star.mesh';
import { Planets } from './Stars/Stars';

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const { data } = characterData;
  if (!data) {
    return null;
  }

  return (
    <Canvas
      gl={{
        alpha: true,
        antialias: true,
      }}
      dpr={[1, 2]}
    >
      <Ambient />
      <Stars depth={1000} />

      <directionalLight intensity={2} castShadow />

      <Planets />
      {/* <Star position={[0, 30, 0]} />
      <Star position={[12, 30, 0]} />
      <Star position={[-12, 30, 0]} /> */}

      <Page404 />

      <ScrollControls infinite pages={3} damping={0}>
        <Cam />
        <Cockpit />
        <RingGrid status="Alive" characters={data} rotX={0.05} />
        <RingGrid status="Dead" characters={data} rotX={Math.PI / 3} />
        <RingGrid status="unknown" characters={data} rotX={Math.PI / -3} />
      </ScrollControls>

      <PostProcess />
    </Canvas>
  );
};
