import { useStoreFandoms } from '@/stores/storeFandoms';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import {
  DoubleSide,
  Group,
  MeshLambertMaterial,
  MeshStandardMaterial,
} from 'three';
import { TypewriterText } from '../../TypewriterText';
import GetSchwifty from '@fonts/get_schwifty.ttf';

type InteriorStartup = {
  width: number;
  height: number;
};

export const InteriorStartup = ({ width, height }: InteriorStartup) => {
  const refText = useRef<Group>(null);
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);
  const updateHasStarted = useStoreFandoms(
    (state) => state.rickAndMorty.updateHasStarted
  );

  const texLayerThreeScreensCenter = useTexture(
    'assets/cockpit_cut_layer_screen_3_parts_center.png'
  );

  const refThreeScreensCenter = useRef<MeshLambertMaterial>(null);

  useFrame(({ clock }) => {
    if (!refThreeScreensCenter.current || hasStarted) return;

    refThreeScreensCenter.current.emissiveIntensity =
      5000 + Math.abs(Math.sin(clock.getElapsedTime()) * 20000);
    // refText.current.position.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.05;
  });

  return (
    <>
      {/* {!hasStarted && (
        <group ref={refText}>
          <TypewriterText
            typewrittenText="The Schwifty wiki"
            delay={65}
            emissive={0x16acc9}
            position-y={0.3}
            position-x={-1.43}
            fontSize={0.35}
            fontFamily={GetSchwifty}
            textWrapper={{ head: '', tail: '' }}
            emissiveIntensity={250}
          />
        </group>
      )} */}
      <mesh onClick={() => updateHasStarted(true)}>
        <planeGeometry args={[width, height]} />
        <meshLambertMaterial
          map={texLayerThreeScreensCenter} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refThreeScreensCenter}
          transparent
          toneMapped={false}
          emissiveMap={texLayerThreeScreensCenter}
          emissiveIntensity={hasStarted ? 2 : 10000}
          emissive={0xffffff}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};
