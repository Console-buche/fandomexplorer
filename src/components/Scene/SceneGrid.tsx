import { Page404 } from '@/pages/404/Page404';
import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars, Stats, Trail } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { RingGrid } from './Grid/RingGrid';
import { Ambient } from './Lights';
import { PostProcess } from './PostProcess';
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
      <directionalLight intensity={3} />

      <Planets />

      {/* <Star position={[0, 30, 0]} />
      <Star position={[12, 30, 0]} />
      <Star position={[-12, 30, 0]} /> */}

      <Page404 />
      {/**/}
      <ScrollControls infinite pages={3} damping={0}>
        <Cam />
        <Cockpit />
        <RingGrid status="Alive" characters={data} rotX={0.05} />
        <RingGrid status="Dead" characters={data} rotX={Math.PI / 3} />
        <RingGrid status="unknown" characters={data} rotX={Math.PI / -3} />
      </ScrollControls>
      {/* <Stats /> */}
      {/* <TrailDebris /> */}
      <PostProcess />
    </Canvas>
  );
};

// CONCEPT TODO :
// when scrolling, add randomy places debris around the current ring and make them move towards the opposite dir of the scroll
// this will trigger the trail effect and give the impression of a trail of debris

function TrailDebris() {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.position.x = Math.sin(0.005 * Date.now()) * 50;
    ref.current.position.y = Math.sin(0.01 * Date.now()) * 10;
  });

  return (
    <Trail
      width={10} // Width of the line
      color={'hotpink'} // Color of the line
      length={10} // Length of the line
      decay={4} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
      <mesh position-z={200} ref={ref}>
        <sphereGeometry />
        <meshBasicMaterial opacity={0} transparent alphaTest={1} />
      </mesh>

      {/* You can optionally define a custom meshLineMaterial to use. */}
      {/* <meshLineMaterial color={"red"} /> */}
    </Trail>
  );
}
