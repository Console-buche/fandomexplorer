import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { AmbientLight, HemisphereLight } from 'three';

export const Hemi = () => {
  const ref = useRef<AmbientLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    // ref.current.intensity = Math.abs(Math.sin(clock.getElapsedTime()) * 10);
  });

  return <ambientLight ref={ref} intensity={2} />;
};
