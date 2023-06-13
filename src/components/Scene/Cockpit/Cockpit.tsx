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
  PerspectiveCamera,
  ShaderMaterial,
} from 'three';
import { Holodetails } from './Holodetails/Holodetails';
import { fragmentShader, vertexShader } from '../shaders/snow.shader';

let t = 0;
export const Cockpit = () => {
  const activeCharacter = useStoreCharacter((state) => state.activeCharacter);

  const tex = useTexture('assets/cockpit_cut_no_layers_v2.png');
  const texLayerButtons = useTexture('assets/cockpit_cut_layer_buttons_v2.png');
  const texLayerThreeScreens = useTexture(
    'assets/cockpit_cut_layer_screen_3_parts.png'
  );
  const texLayerScreen = useTexture('assets/cockpit_cut_layer_screen.png');
  const three = useThree();
  const camera = three.camera as PerspectiveCamera;
  const ref = useRef<Mesh>(null);

  const refThreeScreens = useRef<MeshLambertMaterial>(null);
  const refButtons = useRef<MeshLambertMaterial>(null);
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
    // if (scroll.delta > 0) {
    //   scrollTiltBuffer = MathUtils.clamp(scrollTiltBuffer + scroll.delta, 0, 5);
    // } else {
    //   scrollTiltBuffer = MathUtils.clamp(scrollTiltBuffer - 0.03, 0, 2);
    // }
    // const lerpedRot = MathUtils.lerp(
    //   ref.current.rotation.z,
    //   scrollTiltBuffer > 2 ? scrollDirection * 0.05 : 0,
    //   0.1
    // );
    // ref.current.rotation.z = lerpedRot;

    if (
      !refThreeScreens.current ||
      !refButtons.current ||
      !refShaderMaterialScreen.current
    ) {
      return;
    }

    t++;
    refButtons.current.emissiveIntensity = Math.abs(
      Math.sin(clock.getElapsedTime()) * 25
    );

    refThreeScreens.current.emissiveIntensity = Math.abs(
      Math.sin(clock.getElapsedTime() * 0.01) * 50
    );

    refShaderMaterialScreen.current.uniforms.uTime.value =
      clock.getElapsedTime();
  });
  return (
    <ScreenSpace depth={depth}>
      <Plane
        scale={1.01}
        ref={ref}
        args={[size.widthAtDepth, size.heightAtDepth]}
        material-map={tex}
        material-alphaTest={0.1}
      />
      <mesh>
        <planeBufferGeometry args={[size.widthAtDepth, size.heightAtDepth]} />
        <meshLambertMaterial
          map={texLayerButtons} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refButtons}
          transparent
          toneMapped={false}
          emissive={0xffffff}
          emissiveMap={texLayerButtons}
          emissiveIntensity={2}
        />
      </mesh>

      <mesh>
        <planeBufferGeometry
          args={[size.widthAtDepth + 0.01, size.heightAtDepth + 0.01]}
        />
        {/* <meshLambertMaterial
          map={texLayerScreen} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          transparent
          toneMapped={false}
          side={DoubleSide}
        /> */}
        <shaderMaterial
          ref={refShaderMaterialScreen}
          transparent
          uniforms={uniformsScreenShader}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <mesh>
        <planeBufferGeometry args={[size.widthAtDepth, size.heightAtDepth]} />
        <meshLambertMaterial
          map={texLayerThreeScreens} // TODO: render some button in a different RenderTexture, to control light pulsing diffrent rythm
          alphaTest={0.1}
          ref={refThreeScreens}
          transparent
          toneMapped={false}
          emissiveMap={texLayerThreeScreens}
          emissiveIntensity={2}
          emissive={0xffffff}
          side={DoubleSide}
        />
      </mesh>
      {/* <Holoball
        position-z={-10}
        position-x={size.widthAtDepth * 3.9}
        position-y={-size.heightAtDepth}
      /> */}
      {/* <Holodetails character={activeCharacter} scale={0.1} /> */}
    </ScreenSpace>
  );
};
