import { useState } from 'react';
import { Holosearch } from './Holosearch';
import { MeshProps } from '@react-three/fiber';

export const Holocomputer = (props: MeshProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <mesh
      position={[-0.9, -0.245, 0.1]}
      rotation-y={0.25}
      rotation-x={0.15}
      onPointerEnter={() => setIsEditing(true)}
      onPointerLeave={() => setIsEditing(false)}
    >
      <planeBufferGeometry args={[0.5, 0.2]} />
      <meshLambertMaterial
        color="purple"
        toneMapped={false}
        emissive="purple"
        transparent
        opacity={isEditing ? 1 : 0.1}
        depthWrite={false}
        emissiveIntensity={isEditing ? 20 : 0}
      />

      <Holosearch isEditing={isEditing} />
    </mesh>
  );
};
