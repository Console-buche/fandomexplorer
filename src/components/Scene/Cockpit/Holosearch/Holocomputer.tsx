import { useReducer } from 'react';
import { Holosearch } from './Holosearch';

export const Holocomputer = () => {
  const [isEditing, setIsEditing] = useReducer((v) => !v, false);

  return (
    <mesh
      position={[-1, -0.25, 0]}
      rotation-y={0.25}
      rotation-x={0.1}
      onClick={() => setIsEditing()}
    >
      <planeBufferGeometry args={[0.5, 0.25]} />
      <meshLambertMaterial
        color="purple"
        toneMapped={false}
        emissive="purple"
        emissiveIntensity={isEditing ? 20 : 0}
      />

      <Holosearch isEditing={isEditing} />
    </mesh>
  );
};
