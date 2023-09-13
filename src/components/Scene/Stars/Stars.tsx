import { Merged, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

export const Planets = () => {
  const box1 = useMemo(
    () =>
      new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshStandardMaterial({ color: 'lime' })
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
          <Box position={[-2, 14, 0]} color="red" />
          <Box position={[-6, 14, 0]} color="tomato">
            <MeshDistortMaterial />
          </Box>
          <Sphere scale={0.7} position={[2, 14, 0]} color="green" />
          <Sphere scale={0.7} position={[3, 14, 0]} color="teal" />
          {Array.from({ length: 100 }, (_, i) => i).map((e) => (
            <Sphere
              key={`${e}-mergedSphere`}
              scale={0.7}
              position={[e - 50, 14, 0]}
              color={e % 2 === 0 ? 'teal' : 'yellow'}
            />
          ))}
        </>
      )}
    </Merged>
  );
};
