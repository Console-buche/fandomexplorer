import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export const CustomLineMaterial = () => {
  const materialRef = useRef();

  const lineMaterial = useMemo(
    () => (
      <meshLineMaterial
        ref={materialRef}
        transparent
        onBeforeCompile={(material, renderer) => {
          material.uniforms.camPos = { value: new Vector3() }; // Initialize the uniform
          material.vertexShader = `
            varying vec3 vPosition;
            ${material.vertexShader}
          `;
          material.vertexShader = material.vertexShader.replace(
            `void main() {`,
            `void main() {
              vPosition = position;
            `
          );

          material.fragmentShader = `
            varying vec3 vPosition;
            uniform vec3 camPos;

            void main() {
              vec3 fragToCam = camPos - vPosition;
              float distance = length(fragToCam);
              if (distance > 100.0) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
              } else {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 0.5);
              }
            }
          `;
        }}
      />
    ),
    []
  );

  // Access and update the camPos uniform in the useFrame loop
  useFrame(({ camera }) => {
    if (materialRef.current) {
      // materialRef.current.uniforms.camPos.value = camera.position;
    }
  });

  return { lineMaterial };
};
