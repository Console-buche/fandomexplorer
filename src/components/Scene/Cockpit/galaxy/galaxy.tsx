import { GroupProps } from '@react-three/fiber';
import { Orbit } from './Orbit';

export const Galaxy = (props: GroupProps) => {
  return (
    <group {...props} position-y={0.1}>
      <Orbit scale={0.1} radius={1} color="red" />
      <Orbit scale={0.1} radius={3} color="yellow" />
      <Orbit scale={0.1} radius={5} color="purple" />
    </group>
  );
};
