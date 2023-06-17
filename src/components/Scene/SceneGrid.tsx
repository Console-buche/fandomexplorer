import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars, useScroll } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import { useEffect, useRef } from 'react';
import { SpotLight, Vector3 } from 'three';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { RingGrid } from './Grid/RingGrid';
import { Hemi } from './Lights/Hemi';

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const scroll = useScroll();
  const spotLightRef = useRef<SpotLight>(null);

  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.lookAt(new Vector3(0, 0, 0));
    }
  }, [spotLightRef]);

  const { data } = characterData;
  if (!data) {
    return null;
  }

  return (
    <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
      <Hemi />
      <Stars depth={1000} />

      <ScrollControls infinite pages={3} damping={0}>
        <Cam />
        <Cockpit />
        <RingGrid status="Alive" characters={data} roxX={0.05} />
        <RingGrid status="Dead" characters={data} roxX={Math.PI / 3} />
        <RingGrid status="unknown" characters={data} roxX={Math.PI / -3} />
      </ScrollControls>

      <spotLight position={[0, 0, 240]} ref={spotLightRef} intensity={100} />

      <EffectComposer disableNormalPass multisampling={4}>
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
