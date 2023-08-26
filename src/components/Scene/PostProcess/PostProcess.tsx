import { useStoreFandoms } from '@/stores/storeFandoms';
import { useStoreNav } from '@/stores/storeNav';
import { easeOutCubic } from '@/utils/easings';
import { useFrame } from '@react-three/fiber';
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from '@react-three/postprocessing';
import { ToneMappingEffect } from 'postprocessing';
import { useEffect, useRef, useState } from 'react';
import { MathUtils } from 'three';

type ToneMappingEffectOptions = ConstructorParameters<
  typeof ToneMappingEffect
>[0];

export const PostProcess = () => {
  const [factor, setFactor] = useState(0);
  const refTone = useRef<ToneMappingEffectOptions>(null);
  const currentPath = useStoreNav((state) => state.currentPath);
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);
  const isPath404 = currentPath !== '/' && currentPath !== '/about';

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

  // useFrame(() => {
  //   if (!refTone.current) return;
  //   if (isPath404) {
  //     refTone.current.minLuminance =
  //       2 - MathUtils.lerp(refTone.current.minLuminance ?? 0, 0, 0.001);
  //   }

  //   if (hasStarted && !isPath404) {
  //     refTone.current.minLuminance =
  //       2 - MathUtils.lerp(refTone.current.minLuminance ?? 0, 2, 0.001);

  //     refTone.current.middleGrey = MathUtils.lerp(
  //       refTone.current.middleGrey ?? 0,
  //       0.2,
  //       0.0001
  //     );
  //   }
  // });

  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} />
      <ToneMapping
        // @ts-ignore
        ref={refTone}
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
