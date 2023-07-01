import { useStoreFandoms } from '@/stores/storeFandoms';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { DoubleSide, MeshLambertMaterial } from 'three';

type InteriorStartup = {
  width: number;
  height: number;
};

export const InteriorStartup = ({ width, height }: InteriorStartup) => {
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);
  const updateHasStarted = useStoreFandoms(
    (state) => state.rickAndMorty.updateHasStarted
  );

  const texLayerThreeScreensCenter = useTexture(
    'assets/cockpit_cut_layer_screen_3_parts_center.png'
  );

  const three = useThree();

  const refThreeScreensCenter = useRef<MeshLambertMaterial>(null);

  return (
    <>
      <mesh onClick={() => updateHasStarted(true)}>
        <planeBufferGeometry args={[width, height]} />
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
