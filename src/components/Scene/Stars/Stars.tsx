import { Merged, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { Star } from './Star.mesh';
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

function StarMesh() {
  return (
    <mesh>
      <sphereBufferGeometry args={[5, 32, 32]} />
      <MeshDistortMaterial
        flatShading
        color="blue"
        speed={0}
        distort={Math.random() * 0.15 + 0.15}
      />
    </mesh>
  );
}

export const Planets = () => {
  const box1 = useMemo(
    () =>
      new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({ color: 'red' })
      ),
    []
  );
  const box2 = useMemo(
    () =>
      new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({ color: 'tomato' })
      ),
    []
  );
  const sphere1 = useMemo(
    () =>
      new Mesh(
        new SphereGeometry(0.7, 32, 32),
        new MeshStandardMaterial({ color: 'green' })
      ),
    []
  );

  useEffect(() => {
    box1.position.set(-2, -2, 0);
    sphere1.position.set(2, 1, 0);
  }, [box1, sphere1]);

  return (
    <Merged meshes={[box1, sphere1]}>
      {(Box, Sphere) => (
        <>
          <Box position={[-2, -2, 0]} color="red" />
          <Box position={[-3, -3, 0]} color="tomato" />
          <Sphere scale={0.7} position={[2, 1, 0]} color="green" />
          <Sphere scale={0.7} position={[3, 2, 0]} color="teal" />
        </>
      )}
    </Merged>
  );
};
