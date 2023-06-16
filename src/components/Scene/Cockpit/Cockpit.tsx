import useScrollDirection from '@/hooks/useScroll';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { Plane, ScreenSpace, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  MultiplyBlending,
  PerspectiveCamera,
  ShaderMaterial,
} from 'three';
import { Holodetails } from './Holodetails/Holodetails';
import { fragmentShader, vertexShader } from '../shaders/snow.shader';
import { getScrollDeltaFromDirection } from '../Cam/utils';
import { Interior } from './Interior';

export const Cockpit = () => {
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const depth = 1;

  return (
    <ScreenSpace depth={depth}>
      <Interior />
      <Holodetails
        character={activeCharacter}
        scale={0.1}
        position-x={-2.75}
        position-y={1}
      />
    </ScreenSpace>
  );
};
