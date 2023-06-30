import { useStoreFandoms } from '@/stores/storeFandoms';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';

export const PostProcess = () => {
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);

  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} />
      <ToneMapping
        adaptive
        resolution={256}
        middleGrey={hasStarted ? 0.2 : 0.0001}
        maxLuminance={16.0}
        minLuminance={hasStarted ? 0 : 2}
        averageLuminance={0.5}
        adaptationRate={10}
      />
    </EffectComposer>
  );
};
