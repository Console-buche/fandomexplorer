import useScrollDirection from '@/hooks/useScroll';
import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { Instances } from '@react-three/drei';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  CanvasTexture,
  DoubleSide,
  InstancedBufferAttribute,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  Vector2,
} from 'three';
import { AsteroidRing } from '../AsteroidRing/AsteroidRing';
import { AtomInstanced } from '../Atom/AtomInstanced';
import {
  fragmentShaderAtlas,
  vertexShaderAtlas,
} from '../OffscreenCanvas/offscreenCanvas.shader';
import { useOffscreenCanvasStore } from '../OffscreenCanvas/offscreenCanvas.store';
import { useStoreSearch } from '@/stores/storeSearch';
import { filterCharacterByName } from '../Atom/utils';
import { useStoreNav } from '@/stores/storeNav';

type Grid = {
  characters: CharacterSchema[];
  status: CharacterSchema['status'];
  rotX?: number;
} & MeshProps;

export const RingGrid = ({
  characters,
  status,
  rotX = 0,
  ...meshProps
}: Grid) => {
  const canvas = useOffscreenCanvasStore((state) => state.offscreenCanvas);
  const refShaderMat = useRef<ShaderMaterial>(null);
  const { scrollDirection } = useScrollDirection();
  const activeStatus = useStoreFandoms(
    (state) => state.rickAndMorty.activeStatus
  );
  const currentSearch = useStoreSearch((state) => state.currentSearch);

  const materialAtomRaycast = useMemo(
    () =>
      new MeshBasicMaterial({
        depthWrite: false,
        transparent: true,
        side: DoubleSide,
        opacity: 0,
      }),
    []
  );

  const updateCountPerStatus = useStoreSearch(
    (state) => state.updateCountPerStatus
  );
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);
  const { camera } = useThree();

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
  const refLeAnimDisplacement = useRef<InstancedBufferAttribute>(null);
  const refLeAnimationProgress = useRef<InstancedBufferAttribute>(null);
  const refLeIsShrinkAnimProgress = useRef<InstancedBufferAttribute>(null);
  const refLeIsSearchTrue = useRef<InstancedBufferAttribute>(null);
  const { size } = useThree();

  const groupLength = characters.filter((cc) => cc.status === status).length;
  const currentPath = useStoreNav((state) => state.currentPath);

  useEffect(() => {
    updateCountPerStatus(
      status,
      characters.filter(
        (cc) => cc.status === status && filterCharacterByName(cc, currentSearch)
      ).length
    );
  }, [groupLength, status, updateCountPerStatus, currentSearch, characters]);

  const uniforms = useMemo(
    () => ({
      textureAtlas: { value: CharacterBeltMaterial },
      textureWidth: { value: 32 },
      textureHeight: { value: 32 },
      elementsCount: { value: groupLength },
      uIsAnimatingIn: { value: true },
      animationProgress: { value: 0 },
      radius: { value: groupLength * 0.5 },
      camPosition: { value: camera.position.clone() },
      currentElementId: { value: 0 },
      uTime: { value: 0 },
      resolution: {
        value: new Vector2(size.width, size.height),
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const activeRingRotSpeed = activeCharacter ? 0 : 0.0001;

  useEffect(() => {
    if (ref.current && refShaderMat.current) {
      ref.current.rotation.x = rotX;
    }
  }, [ref, rotX]);

  useEffect(() => {
    if (refShaderMat.current) {
      refShaderMat.current.uniforms.uIsAnimatingIn.value =
        currentPath === '/' ? 1 : 0;
    }
  }, [currentPath]);

  useFrame(() => {
    if (!refShaderMat.current || !ref.current) {
      return null;
    }

    ref.current.rotation.y +=
      activeStatus !== status ? 0.001 : activeRingRotSpeed;

    refShaderMat.current.uniforms.uTime.value += 0.01;
    refShaderMat.current.uniformsNeedUpdate = true;
    // Apply rotation based on scroll direction
    const scrollSpeed = scrollDirection !== 0 ? 0.01 : 0.05;
    const targetRotation = scrollDirection * 0.01;
    
    // Lerp to target rotation (0 when not scrolling)
    const lerpedRot = MathUtils.lerp(
      ref.current.rotation.z,
      targetRotation,
      scrollSpeed
    );

    ref.current.rotation.z = lerpedRot;

    // update cam position
    // TODO : move this to cam on scroll only. So we don't fire a constant update for no reason
    refShaderMat.current.uniforms.camPosition.value = camera.position.clone();
    refShaderMat.current.uniformsNeedUpdate = true;
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
        return Math.random() * 0.5 + 0.1;
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

  const leAnimDisplacement = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return 1;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  // Size 1, attribute to indicate whether the character is found in current search filter
  const leIsSearchTrue = useMemo(() => {
    const c = Array.from(
      {
        length: groupLength,
      },
      (_, i) => {
        return 1;
      }
    );
    const tIndex = new Float32Array(c);

    return tIndex;
  }, [groupLength]);

  // Size 1, attribute to indicate whether the character is found in current search filter
  const leIsShrinkAnimProgress = useMemo(() => {
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

  const ringRadius = groupLength * 0.475; // TODO : refactor this as a common CONSTANT or prop to atomgrid and this

  return (
    <group>
      <AsteroidRing radius={ringRadius} rotation-x={rotX - Math.PI * 0.5} />
      <mesh ref={ref} {...meshProps}>
        <Instances range={groupLength}>
          <planeGeometry args={[3, 3, 20, 20]}>
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
              attach="attributes-leIsSearchTrue"
              array={leIsSearchTrue}
              itemSize={1}
              count={groupLength}
              ref={refLeIsSearchTrue}
            />
            <instancedBufferAttribute
              attach="attributes-leIsShrinkAnimProgress"
              array={leIsShrinkAnimProgress}
              itemSize={1}
              count={groupLength}
              ref={refLeIsShrinkAnimProgress}
            />
            <instancedBufferAttribute
              attach="attributes-tileIndex"
              array={tileIndices}
              itemSize={1}
              count={groupLength}
            />
            <instancedBufferAttribute
              attach="attributes-leAnimDisplacement"
              array={leAnimDisplacement}
              itemSize={1}
              count={groupLength}
              ref={refLeAnimDisplacement}
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
            toneMapped={false}
          />
          {characters
            .filter((c) => c.status === status)
            .map((c, i) => (
              <AtomInstanced
                key={c.id}
                character={c}
                refLeTime={refLeTime}
                refLeIsSelected={refLeIsSelected}
                refLeIsSearchTrue={refLeIsSearchTrue}
                refLesSpeeds={refLesSpeeds}
                refLeAnimDisplacement={refLeAnimDisplacement}
                refLeAnimationProgress={refLeAnimationProgress}
                refLeIsShrinkAnimProgress={refLeIsShrinkAnimProgress}
                speed={100}
                tileIndex={i}
                groupLength={groupLength}
                refLePos={refLePos}
                materialAtomRaycast={materialAtomRaycast}
              />
            ))}
        </Instances>
      </mesh>
    </group>
  );
};
