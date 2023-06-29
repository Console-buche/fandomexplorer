import { ScreenSpace } from '@react-three/drei';
import { Holodetails } from './Holodetails/Holodetails';
import { Holonavigation } from './Holonavigation';
import { Holocomputer } from './Holosearch';
import { Interior } from './Interior';

export const Cockpit = () => {
  return (
    <ScreenSpace depth={1}>
      <Interior />
      <Holodetails position-x={-15} position-y={-1} />
      <Holocomputer />
      <Holonavigation position-x={-0.65} position-y={-0.2} />
    </ScreenSpace>
  );
};
