import useScrollDirection from '@/hooks/useScroll';
import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Instances } from '@react-three/drei';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CanvasTexture,
  DoubleSide,
  InstancedBufferAttribute,
  MathUtils,
  Mesh,
  NormalBlending,
  ShaderMaterial,
  Vector2,
} from 'three';
import { AtomInstanced } from '../Atom/AtomInstanced';
import {
  fragmentShaderAtlas,
  vertexShaderAtlas,
} from '../OffscreenCanvas/offscreenCanvas.shader';
import { useOffscreenCanvasStore } from '../OffscreenCanvas/offscreenCanvas.store';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { cp } from 'fs';

type Grid = {
  characters: CharacterSchema[];
  status: CharacterSchema['status'];
  roxX?: number;
} & MeshProps;

export const GridReactInstanced = ({
  characters,
  status,
  roxX = 0,
  ...meshProps
}: Grid) => {
  const canvas = useOffscreenCanvasStore((state) => state.offscreenCanvas);
  const refShaderMat = useRef<ShaderMaterial>(null);
  const scrollDirection = useScrollDirection();

  const CharacterBeltMaterial = useMemo(() => {
    const cvn = canvas.get(status);
    if (!cvn) {
      return new ShaderMaterial({});
    }
    return new CanvasTexture(cvn);
  }, [canvas, status]);

  const ref = useRef<Mesh>(null);
  const refLePos = useRef<InstancedBufferAttribute>(null);
  const refLeIsSelected = useRef<InstancedBufferAttribute>(null);
  const refLesSpeeds = useRef<InstancedBufferAttribute>(null);
  const refLeTime = useRef<InstancedBufferAttribute>(null);
  const refLeAnimationProgress = useRef<InstancedBufferAttribute>(null);
  const { size } = useThree();

  const groupLength = characters.filter((cc) => cc.status === status).length;

  const uniforms = useMemo(
    () => ({
      textureAtlas: { value: CharacterBeltMaterial },
      textureWidth: { value: 32 },
      textureHeight: { value: 32 },
      elementsCount: { value: groupLength },
      animationProgress: { value: 0 },
      radius: { value: groupLength * 0.5 },
      currentElementId: { value: 0 },
      uTime: { value: 0 },
      resolution: {
        value: new Vector2(size.width, size.height),
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (ref.current && refShaderMat.current) {
      ref.current.rotation.x = roxX;
    }
  }, [ref, roxX]);

  useFrame(() => {
    if (!refShaderMat.current || !ref.current) {
      return null;
    }

    refShaderMat.current.uniforms.uTime.value += 0.01;
    refShaderMat.current.uniformsNeedUpdate = true;
    // ref.current.rotation.y += (scroll.delta * scrollDirection) / 2;

    // rotate mesh for tilt effect on scroll
    const lerpedRot = MathUtils.lerp(
      ref.current.rotation.z,
      scrollDirection * 0.01,
      0.01
    );

    ref.current.rotation.z = lerpedRot;
  });

  const tAnimationProgress = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return 0;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  const tSpeeds = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return Math.random() * 0.25 + 0.025;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  const tTimes = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return 0;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  const lePos = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return [0, 0, 0];
      }
    );
    const tIndex = new Float32Array(c.flat());

    return tIndex;
  }, [groupLength]);

  const leIsSelected = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return 0;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  const tileIndices = useMemo(() => {
    const idcs = characters.filter((c) => c.status === status).map((c, i) => i);
    return new Float32Array(idcs);
  }, [characters, status]);

  return (
    <mesh ref={ref} {...meshProps}>
      <Instances range={groupLength}>
        <planeGeometry args={[3, 3]}>
          <instancedBufferAttribute
            attach="attributes-animationProgress"
            array={tAnimationProgress}
            itemSize={1}
            ref={refLeAnimationProgress}
            count={groupLength}
          />
          <instancedBufferAttribute
            ref={refLePos}
            attach="attributes-lePos"
            array={lePos}
            itemSize={3}
            count={groupLength}
          />
          <instancedBufferAttribute
            attach="attributes-speed"
            array={tSpeeds}
            itemSize={1}
            ref={refLesSpeeds}
            count={groupLength}
          />
          <instancedBufferAttribute
            attach="attributes-time"
            array={tTimes}
            itemSize={1}
            count={groupLength}
            ref={refLeTime}
          />
          <instancedBufferAttribute
            attach="attributes-tileIndex"
            array={tileIndices}
            itemSize={1}
            count={groupLength}
          />
          <instancedBufferAttribute
            attach="attributes-leIsSelected"
            array={leIsSelected}
            itemSize={1}
            count={groupLength}
            ref={refLeIsSelected}
          />
        </planeGeometry>
        <shaderMaterial
          ref={refShaderMat}
          uniforms={uniforms}
          fragmentShader={fragmentShaderAtlas}
          vertexShader={vertexShaderAtlas}
          side={DoubleSide}
          transparent
        />
        {characters
          .filter((c) => c.status === status)
          .map((c, i) => (
            <AtomInstanced
              key={c.id}
              character={c}
              refLeTime={refLeTime}
              refLeIsSelected={refLeIsSelected}
              refLesSpeeds={refLesSpeeds}
              refLeAnimationProgress={refLeAnimationProgress}
              speed={100}
              tileIndex={i}
              groupLength={groupLength}
              refLePos={refLePos}
            />
          ))}
      </Instances>
    </mesh>
  );
};
