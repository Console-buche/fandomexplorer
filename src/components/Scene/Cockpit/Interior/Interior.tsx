import useScrollDirection from '@/hooks/useScroll';
import { a, useSpring } from '@react-spring/three';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { useStoreFandoms } from '@/stores/storeFandoms';
import { useStoreNav } from '@/stores/storeNav';
import { Plane, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  DoubleSide,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  ShaderMaterial,
} from 'three';
import { fragmentShader, vertexShader } from '../../shaders/snow.shader';
import { InteriorStartup } from './InteriorStartup';

let t = 0;
let tScrollRight = 0;
let tScrollLeft = 0;

export const Interior = () => {
  const currentPath = useStoreNav((state) => state.currentPath);
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);
  const hasStarted = useStoreFandoms((state) => state.rickAndMorty.hasStarted);


  const color = useSpring({
    hue: currentPath === '/' ? '#FFFFF' : '#8B0000',
    baseIllumination: currentPath === '/' ? '#FFFFF' : '#464646'
  });

  const texBase = useTexture('assets/cockpit_cut_no_layers_v4.png');
  const texLayerRibbon = useTexture('assets/cockpit_cut_layer_ribbon.png');
  const texLayerCables = useTexture('assets/cockpit_cut_no_layer_cables.png');
  const texLayerButtons = useTexture('assets/cockpit_cut_layer_buttons_v3.png');
  const texLayerThreeScreensRight = useTexture(
    'assets/cockpit_cut_layer_screen_3_parts_right.png'
  );
  const texLayerThreeScreensLeft = useTexture(
    'assets/cockpit_cut_layer_screen_3_parts_left.png'
  );
  const texLayerScreen = useTexture('assets/cockpit_cut_layer_screen.png');
  const texLayerScreenBorder = useTexture(
    'assets/cockpit_cut_layer_screen_border.png'
  );
  const three = useThree();
  const camera = three.camera as PerspectiveCamera;
  const ref = useRef<Mesh>(null);

  const refThreeScreensRight = useRef<MeshLambertMaterial>(null);
  const refThreeScreensLeft = useRef<MeshLambertMaterial>(null);
  const refButtons = useRef<MeshLambertMaterial>(null);
  const refScreenBorder = useRef<MeshLambertMaterial>(null);
  const refShipRibbon = useRef<MeshLambertMaterial>(null);
  const refShipCables = useRef<MeshLambertMaterial>(null);
  const refShaderMaterialScreen = useRef<ShaderMaterial>(null);

  const scrollDirection = useScrollDirection();
  const scroll = useScroll();

  const depth = 1;

  const size = useMemo(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const fieldOfView = MathUtils.degToRad(camera.fov);
    const heightAtDepth = 2 * Math.tan(fieldOfView / 2) * depth;
    const widthAtDepth = heightAtDepth * aspectRatio;

    return { widthAtDepth, heightAtDepth };
  }, [camera.fov]);

  const uniformsScreenShader = useMemo(() => {
    return {
      uTime: { value: 0 },
      uIsImageSelected: { value: 0 },
      uTexture: { value: texLayerScreen },
      uActiveImage: { value: undefined },
      uMouse: { value: [0, 0] },
      uHover: { value: 0 },
    };
  }, [texLayerScreen]);


  useEffect(() => {
    if (refShaderMaterialScreen.current) {
      refShaderMaterialScreen.current.uniforms.uIsImageSelected.value =
        activeCharacter?.image ? 1 : 0;
      refShaderMaterialScreen.current.uniforms.uActiveImage.value =
        activeCharacter?.image;
      refShaderMaterialScreen.current.uniformsNeedUpdate = true;
    }
  }, [activeCharacter, refShaderMaterialScreen]);

  useFrame(({ clock }) => {
    if (
      // !refThreeScreens.current ||
      !refThreeScreensRight.current ||
      !refThreeScreensLeft.current ||
      !refButtons.current ||
      !refScreenBorder.current ||
      !refShaderMaterialScreen.current ||
      !refShipCables.current
    ) {
      return;
    }

    t++;
    refButtons.current.emissiveIntensity = Math.abs(
      Math.sin(clock.getElapsedTime()) * 25
    );

    refScreenBorder.current.emissiveIntensity = activeCharacter
      ? Math.abs(Math.sin(clock.getElapsedTime() * 0.1) * 80 + 10)
      : 0;

    refShipCables.current.emissiveIntensity = activeCharacter
      ? Math.abs(Math.sin(clock.getElapsedTime() * 2) * 80 + 10)
      : 0;

    refShaderMaterialScreen.current.uniforms.uTime.value =
      clock.getElapsedTime();

    refThreeScreensRight.current.emissiveIntensity = tScrollRight;
    refThreeScreensLeft.current.emissiveIntensity = tScrollLeft;
    tScrollRight =
      scroll.delta > 0 && scrollDirection === -1
        ? Math.min(tScrollRight + 2, 25)
        : Math.max(tScrollRight - 2, 2);

    tScrollLeft =
      scroll.delta > 0 && scrollDirection === 1
        ? Math.min(tScrollLeft + 2, 25)
        : Math.max(tScrollLeft - 2, 2);
  });
  return (
    <>
      <Plane
        scale={1.01}
        ref={ref}
        args={[size.widthAtDepth, size.heightAtDepth]}
      >
        {/* @ts-ignore */}
        <a.meshLambertMaterial
          map={texBase} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          transparent
          color={color.baseIllumination}
          toneMapped={false}
          emissive={color.hue}
          emissiveMap={texBase}
          emissiveIntensity={currentPath === '/' ? 0.1 : 0.}
        />
      </Plane>
      <mesh>
        <planeBufferGeometry args={[size.widthAtDepth, size.heightAtDepth]} />

        {/* @ts-ignore */}
        <a.meshLambertMaterial
          map={texLayerButtons} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refButtons}
          transparent
          toneMapped={false}
          emissive={color.hue}
          emissiveMap={texLayerButtons}
          emissiveIntensity={hasStarted ? 2 : 1}
        />
      </mesh>

      <mesh position-z={-0.001} position-y={-0.001}>
        <planeBufferGeometry
          args={[size.widthAtDepth + 0.01, size.heightAtDepth + 0.01]}
        />

        <shaderMaterial
          ref={refShaderMaterialScreen}
          transparent
          uniforms={uniformsScreenShader}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          toneMapped={false}
        />
      </mesh>

      <mesh position-z={-0.0001} position-y={-0.002}>
        <planeBufferGeometry
          args={[size.widthAtDepth + 0.02, size.heightAtDepth + 0.01]}
        />
        {/* @ts-ignore */}
        <a.meshLambertMaterial

          map={texLayerCables} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          ref={refShipCables}
          transparent
          toneMapped={false}
          emissiveMap={texLayerCables}
          emissiveIntensity={hasStarted ? 60 : 1}
          emissive={color.hue}
          side={DoubleSide}
          opacity={0.1}
        />
      </mesh>

      <mesh position-z={0.01} position-y={-0.002}>
        <planeBufferGeometry
          args={[size.widthAtDepth + 0.02, size.heightAtDepth + 0.01]}
        />
        {/* @ts-ignore */}
        <a.meshLambertMaterial
          map={texLayerRibbon} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          ref={refShipRibbon}
          transparent
          toneMapped={false}
          emissiveMap={texLayerRibbon}
          emissiveIntensity={hasStarted ? 60 : 320}
          emissive={color.hue}
          side={DoubleSide}
          opacity={0.1}
        />
      </mesh>

      <mesh position-z={-0.0001} position-y={-0.002}>
        <planeBufferGeometry
          args={[size.widthAtDepth + 0.01, size.heightAtDepth + 0.01]}
        />
        {/* @ts-ignore */}
        <a.meshLambertMaterial

          map={texLayerScreenBorder} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          ref={refScreenBorder}
          transparent
          toneMapped={false}
          emissiveMap={texLayerScreenBorder}
          emissiveIntensity={hasStarted ? 5 : 1}
          emissive={color.hue}
          side={DoubleSide}
          opacity={0.1}
        />
      </mesh>

      {/* THREE SCREENS PARTS */}
      <mesh>
        <planeBufferGeometry args={[size.widthAtDepth, size.heightAtDepth]} />
        {/* @ts-ignore */}
        <a.meshLambertMaterial

          map={texLayerThreeScreensRight} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refThreeScreensRight}
          transparent
          toneMapped={false}
          emissiveMap={texLayerThreeScreensRight}
          emissiveIntensity={hasStarted ? 2 : 1}
          emissive={color.hue}
          side={DoubleSide}
        />
      </mesh>

      <InteriorStartup width={size.widthAtDepth} height={size.heightAtDepth} />

      <mesh>
        <planeBufferGeometry args={[size.widthAtDepth, size.heightAtDepth]} />
        {/* @ts-ignore */}
        <a.meshLambertMaterial

          map={texLayerThreeScreensLeft} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refThreeScreensLeft}
          transparent
          toneMapped={false}
          emissiveMap={texLayerThreeScreensLeft}
          emissiveIntensity={hasStarted ? 2 : 1}
          emissive={color.hue}
          side={DoubleSide}
        />
      </mesh>
    </>
  );
};
