import { useStoreFandoms } from '@/stores/storeFandoms';
import { easeOutCubic } from '@/utils/easings';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import { useEffect, useState } from 'react';
import { MathUtils } from 'three';

export const PostProcess = () => {
  const [factor, setFactor] = useState(0);
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);

  useEffect(() => {
    if (!hasStarted) return;
    const intervalId = setInterval(() => {
      setFactor((prevFactor) => {
        if (prevFactor >= 1) {
          clearInterval(intervalId);
          return prevFactor;
        }
        return easeOutCubic(prevFactor + 0.00001);
      });
    }, 16);

    return () => clearInterval(intervalId);
  }, [hasStarted]);

  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} />
      <ToneMapping
        adaptive
        resolution={256}
        middleGrey={MathUtils.clamp(0.2 * factor, 0.0001, 0.2)}
        maxLuminance={16.0}
        minLuminance={2 - 2 * factor}
        averageLuminance={0.5}
        adaptationRate={10}
      />
    </EffectComposer>
  );
};
