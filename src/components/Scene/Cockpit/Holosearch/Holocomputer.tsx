import { useReducer } from 'react';
import { Holosearch } from './Holosearch';

export const Holocomputer = () => {
  const [isEditing, setIsEditing] = useReducer((v) => !v, false);

  return (
    <mesh
      position={[-1, -0.245, 0.1]}
      rotation-y={0.25}
      rotation-x={0.15}
      onClick={() => setIsEditing()}
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
