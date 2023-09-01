import useScrollDirection from '@/hooks/useScroll';
import { Page404 } from '@/pages/404/Page404';
import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars, Trail } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Mesh } from 'three';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { RingGrid } from './Grid/RingGrid';
import { Ambient } from './Lights';
import { PostProcess } from './PostProcess';

function test(myString: string): string {
  return myString;
}

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();

  const randomTrails = useMemo(
    () =>
      Array.from({ length: 30 }, (i) => ({
        key: i,
        posY: Math.random() * 300 - 150,
        posZ: Math.random() * 50 - 25,
      })),

    []
  );

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

      {/* <Planets /> */}

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
        {randomTrails.map(({ key, posY, posZ }) => (
          <TrailDebris key={key} posY={posY} posZ={posZ} />
        ))}
      </ScrollControls>
      {/* <Stats /> */}
      <PostProcess />
    </Canvas>
  );
};

// CONCEPT TODO :
// when scrolling, add randomy places debris around the current ring and make them move towards the opposite dir of the scroll
// this will trigger the trail effect and give the impression of a trail of debris

function TrailDebris({ posY, posZ }: { posY: number; posZ: number }) {
  const ref = useRef<Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);
  const arbitraryGrouLength = 140;
  const direction = useScrollDirection();

  useFrame(() => {
    if (!ref.current || direction === 0 || t.current === null) {
      return null;
    }
    if (direction > 0) {
      t.current -= 0.01;
      ref.current.position.x =
        arbitraryGrouLength * Math.cos(t.current) -
        arbitraryGrouLength * Math.sin(t.current);

      // ref.current.position.y = Math.sin(0.005 * Date.now()) * 20;

      ref.current.position.y = posY;
      ref.current.position.z =
        (posZ + arbitraryGrouLength) * Math.cos(t.current) +
        (posZ + arbitraryGrouLength) * Math.sin(t.current);
    }
    if (direction < 1) {
      t.current += 0.01;
      ref.current.position.x =
        (posZ + arbitraryGrouLength) * Math.cos(t.current) -
        (posZ + arbitraryGrouLength) * Math.sin(t.current);

      // ref.current.position.y = Math.sin(0.005 * Date.now()) * 20;
      ref.current.position.y = posY;
      ref.current.position.z =
        arbitraryGrouLength * Math.cos(t.current) +
        arbitraryGrouLength * Math.sin(t.current);
    }
    // t += 0.01;
    // ref.current.position.x =
    //   arbitraryGrouLength * Math.cos(t) - arbitraryGrouLength * Math.sin(t);
    //
    // ref.current.position.y = Math.sin(0.005 * Date.now()) * 20;
    //
    // ref.current.position.z =
    //   arbitraryGrouLength * Math.cos(t) + arbitraryGrouLength * Math.sin(t);
  });

  return (
    <Trail
      width={15} // Width of the line
      color="hotpink" // Color of the line
      length={20} // Length of the line
      decay={4} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
      <mesh ref={ref}>
        <sphereGeometry />
        <meshBasicMaterial opacity={1} transparent alphaTest={1} />
      </mesh>

      {/* You can optionally define a custom meshLineMaterial to use. */}
      {/* <lineBasicMaterial color="yellow" /> */}
    </Trail>
  );
}
