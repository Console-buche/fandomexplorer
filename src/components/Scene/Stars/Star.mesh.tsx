import { MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

export const Star = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <sphereBufferGeometry args={[5, 32, 32]} />
      <MeshDistortMaterial
        flatShading
        color={'blue'}
        speed={0}
        distort={Math.random() * 0.15 + 0.15}
      />
    </mesh>
  );
};
