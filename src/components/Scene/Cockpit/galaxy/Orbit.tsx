import { Sphere } from '@react-three/drei';
import { GroupProps, MeshProps, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { DoubleSide, Mesh } from 'three';

type Orbit = {
  radius: number;
  color: string;
} & GroupProps;

export const Orbit = ({ radius, color, ...props }: Orbit) => {
  const ref = useRef<Mesh>(null);
  const refRing = useRef<Mesh>(null);

  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    if (ref.current && refRing.current) {
      refRing.current.geometry.rotateX(Math.PI / 2);
      refRing.current.rotation.x = 0.2;
      refRing.current.rotation.z = 0.2;
      ref.current.geometry.translate(radius, 0, 0);
      ref.current.rotation.y = Math.random() * Math.PI * 2;
      //   refRing.current.geometry.rotateY(-0.25);
    }
  }, [radius]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y += (0.1 * props.scale) / 4;
  });
  return (
    <group {...props}>
      <mesh ref={refRing}>
        <ringBufferGeometry args={[radius, radius + 0.15, 30, 1]} />
        <meshBasicMaterial
          color="white"
          side={DoubleSide}
          opacity={0.3}
          transparent
        />
        <Sphere
          args={[0.7, 32]}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          ref={ref}
          material-color={isHovered ? 'white' : color}
        />
      </mesh>
    </group>
  );
};
