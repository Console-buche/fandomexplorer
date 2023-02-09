import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import { Atom } from '../Atom';
import { positionOnCircleWithVariation } from '../AtomGroup/utils';
import { useOffscreenCanvasStore } from '../OffscreenCanvas/offscreenCanvas.store';
import {
  fragmentShaderAtlas,
  vertexShaderAtlas,
} from '../OffscreenCanvas/offscreenCanvas.shader';

type Grid = {
  characters: CharacterSchema[];
  status: CharacterSchema['status'];
  roxX?: number;
} & MeshProps;

export const GridReact = ({
  characters,
  status,
  roxX = 0,
  ...meshProps
}: Grid) => {
  const canvas = useOffscreenCanvasStore((state) => state.offscreenCanvas);

  const CharacterBeltMaterial = useMemo(() => {
    const cvn = canvas.get(status);
    if (!cvn) {
      return new ShaderMaterial({});
    }
    const textureAtlas = new CanvasTexture(cvn);

    const textureWidth = 32;
    const textureHeight = 32;

    return new ShaderMaterial({
      vertexShader: vertexShaderAtlas,
      fragmentShader: fragmentShaderAtlas,
      uniforms: {
        textureAtlas: { value: textureAtlas },
        textureWidth: { value: textureWidth },
        textureHeight: { value: textureHeight },
      },
      side: DoubleSide,
    });
  }, [canvas, status]);

  const ref = useRef<Mesh>(null);
  let t = 0;
  const [z, setZ] = useState(0);

  const groupLength = characters.filter((cc) => cc.status === status).length;

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = roxX;
    }
  }, [ref, roxX]);

  useFrame(() => {
    t++;
    if (t % 3 === 0) {
      setZ((pre) => (pre + 1 < groupLength - 1 ? z + 1 : 0));
    }

    if (!ref.current) {
      return null;
    }
  });

  const speeds = useMemo(() => {
    return Array.from(
      { length: groupLength },
      () => Math.random() * 0.1 + 0.05
    );
  }, [groupLength]);

  return (
    <mesh ref={ref} {...meshProps} scale={groupLength * 0.01}>
      {characters
        .filter((c) => c.status === status)
        .map((c, i) => (
          <Atom
            material={CharacterBeltMaterial}
            key={c.id}
            character={c}
            speed={speeds[i]}
            scale={i <= z + 10 && i > z ? 1 : 0.5}
            isActive={i <= z + 5 && i >= z - 5}
            tileIndex={i}
            position={
              new Vector3(
                ...positionOnCircleWithVariation({
                  radius: groupLength * 0.225,
                  elementId: i,
                  displacementFactor: 0,
                  elementsCount: characters.filter((cc) => cc.status === status)
                    .length,
                  currentElementId: z,
                })
              )
            }
          />
        ))}
    </mesh>
  );
};
