import useScrollDirection from '@/hooks/useScroll';
import { Page404 } from '@/pages/404/Page404';
import { useQueryGetCharactersFromFile } from '@/services/getCharacters/useQueryGetCharacters';
import { ScrollControls, Stars, Stats, Trail } from '@react-three/drei';
import {
  Canvas,
  extend,
  MaterialProps,
  useFrame,
  useThree,
} from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  BufferGeometry,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Vector2,
} from 'three';
import { Cam } from './Cam';
import { Cockpit } from './Cockpit/Cockpit';
import { RingGrid } from './Grid/RingGrid';
import { Ambient } from './Lights';
import { PostProcess } from './PostProcess';
import { MeshLineMaterial, MeshLineMaterialParameters } from 'meshline';
// import { Planets } from './Stars/Stars';
import { Geometry } from 'three-stdlib';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineMaterial: MeshLineMaterialParameters & Partial<Material>;
    }
  }
}

extend({ MeshLineMaterial });

export const SceneGrid = () => {
  const characterData = useQueryGetCharactersFromFile();
  const { data } = characterData;

  const randomTrails = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        key: `trail_${i}`,
        posY: Math.random() * 150 - 75,
        posZ: Math.random() * 60 - 30,
      })),

    []
  );
  if (!data) {
    return null;
  }
  return (
    <Canvas
      gl={{
        alpha: true,
      }}
      dpr={[1, 2]}
    >
      <Ambient />
      <Stars depth={1000} />

      {/* TODO: Optimise planets and distribute them arround as nice models. They can be sprites too taken from an atlas for performance reaons */}
      {/* <Planets /> */}

      {/* <Star position={[0, 30, 0]} />
      <Star position={[12, 30, 0]} />
      <Star position={[-12, 30, 0]} /> */}
      {/* <StatsGl /> */}
      {/* <Stats /> */}
      <Page404 />
      <ScrollControls infinite pages={3} damping={0}>
        <Cam />
        <Cockpit />
        <RingGrid status="Alive" characters={data} rotX={0.05} />
        <RingGrid status="Dead" characters={data} rotX={Math.PI / 3} />
        <RingGrid status="unknown" characters={data} rotX={Math.PI / -3} />
        <TrailsContainer randomTrails={randomTrails} />
        <PostProcess />
      </ScrollControls>
      {/* <Stats /> */}
    </Canvas>
  );
};

type TrailsContainerProps = {
  randomTrails: {
    key: string;
    posZ: number;
    posY: number;
  }[];
};

const TrailsContainer = ({ randomTrails }: TrailsContainerProps) => {
  const direction = useScrollDirection();
  const { camera } = useThree();

  const lineMaterial = useMemo(() => {
    return (
      <meshLineMaterial
        // TODO: check what resolution is used for in that class
        resolution={new Vector2(1, 1)}
        onBeforeCompile={(material: MeshLineMaterial) => {
          material.uniforms.camPos = { value: camera.position };
          material.uniforms.distVisible = { value: 200 }; // FIXME : make this dynamic by watching current ring radius

          material.vertexShader = ``;
          material.vertexShader = material.vertexShader.replace(
            `void main() {`,
            `void main() {
              vPosition = position;
            `
          );

          material.fragmentShader = `
            varying vec3 vPosition;
            uniform vec3 camPos;
            uniform float distVisible;

            void main() {
              vec3 fragToCam = camPos - vPosition;
              float distance = length(fragToCam);

              if (distance > distVisible) {
                discard;
              } else {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1);
              }
            }
          `;
        }}
      />
    );
  }, [camera.position]);

  return (
    <>
      {randomTrails.map(({ key, posY, posZ }) => (
        <TrailDebris
          lineMaterial={lineMaterial}
          direction={direction}
          key={key}
          posY={posY}
          posZ={posZ}
        />
      ))}
    </>
  );
};

// CONCEPT TODO :
// when scrolling, add randomy places debris around the current ring and make them move towards the opposite dir of the scroll
// this will trigger the trail effect and give the impression of a trail of debris

function TrailDebris({
  direction,
  posY,
  posZ,
  lineMaterial,
}: {
  lineMaterial: Partial<MeshLineMaterial>;
  direction: -1 | 0 | 1;
  posY: number;
  posZ: number;
}) {
  const ref = useRef<Mesh<BufferGeometry, Material>>(null);
  const refTrail = useRef<Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);
  const arbitraryGrouLength = 145; // FIXME : make this dynamic by watching current ring radius
  useFrame(({ camera }) => {
    if (!ref.current || t.current === null || !refTrail.current) {
      return null;
    }

    const distFromCam = camera.position
      .clone()
      .distanceTo(ref.current.position);
    ref.current.material.opacity = Math.abs(
      1.25 - MathUtils.clamp(distFromCam, 0, 250) / 250
    );
    // ref.current.position.y += Math.sin(0.0005 * Date.now()) * 0.1;

    if (direction === -1) {
      ref.current.position.x =
        arbitraryGrouLength * Math.cos(t.current) -
        arbitraryGrouLength * Math.sin(t.current);

      ref.current.position.y = posY;
      ref.current.position.z =
        (posZ + arbitraryGrouLength) * Math.cos(t.current) +
        (posZ + arbitraryGrouLength) * Math.sin(t.current);
      t.current += 0.01;
    }
    if (direction === 1) {
      ref.current.position.x =
        (posZ + arbitraryGrouLength) * Math.cos(t.current) -
        (posZ + arbitraryGrouLength) * Math.sin(t.current);

      ref.current.position.y = posY;
      ref.current.position.z =
        arbitraryGrouLength * Math.cos(t.current) +
        arbitraryGrouLength * Math.sin(t.current);
      t.current -= 0.01;
    }
  });

  return (
    <Trail
      width={5} // Width of the line
      length={10} // Length of the line
      opacity={0}
      ref={refTrail}
      decay={4} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      <mesh ref={ref} scale={0.3}>
        <sphereGeometry />
        <meshStandardMaterial
          color="purple"
          blending={NormalBlending}
          transparent
        />
      </mesh>
      {lineMaterial}
    </Trail>
  );
}
