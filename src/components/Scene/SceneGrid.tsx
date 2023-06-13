import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { GridReactInstanced } from './Grid/GridReactInstanced';
import { NormalBlending } from 'three';
import { Hemi } from './Lights/Hemi';

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const { data } = characterData;
  if (!data) {
    return null;
  }

  return (
    <Canvas gl={{ alpha: true }} dpr={[1, 2]}>
      <Hemi />
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

      <EffectComposer disableNormalPass multisampling={4}>
        {/** The bloom pass is what will create glow, always set the threshold to 1, nothing will glow
         /*  except materials without tonemapping whose colors leave RGB 0-1 */}
        <Bloom mipmapBlur luminanceThreshold={1} />
        <ToneMapping
          adaptive
          resolution={256}
          middleGrey={0.2}
          maxLuminance={16.0}
          averageLuminance={0.5}
          adaptationRate={10}
        />
      </EffectComposer>
    </Canvas>
  );
};
