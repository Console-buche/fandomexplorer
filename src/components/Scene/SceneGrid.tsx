import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import {
  CameraShake,
  PerspectiveCamera,
  ScrollControls,
  Stars,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { Camera } from 'three';
import { Cockpit } from './Cockpit/Cockpit';
import { GridReactInstanced } from './Grid/GridReactInstanced';

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const refCam = useRef<Camera>(null);

  const { data } = characterData;
  if (!data) {
    return null;
  }

  return (
    <Canvas gl={{ alpha: true }} dpr={[1, 2]}>
      <PerspectiveCamera
        ref={refCam}
        position={[0, -15, 255]}
        fov={85}
        far={100000}
        makeDefault
      />
      <ambientLight />
      <Stars depth={500} />
      <CameraShake intensity={0.5} pitchFrequency={0.1} />
      {/* 
      <OrbitControls
        dampingFactor={0.5}
        // maxPolarAngle={Math.PI / 2 - 0.023}
        autoRotate
        autoRotateSpeed={-0.02}
        // minPolarAngle={Math.PI / 2 - 0.023}
      /> */}
      <Cockpit />

      <ScrollControls infinite pages={1} damping={0}>
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
