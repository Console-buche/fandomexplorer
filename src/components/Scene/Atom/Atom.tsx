import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreCharacter } from '@/stores/storeCharacter';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  BufferAttribute,
  DoubleSide,
  InstancedBufferAttribute,
  Matrix4,
  Mesh,
  Texture,
  Vector3,
} from 'three';

type Atom = {
  isActive?: boolean;
  speed: number;
  tileIndex: number;
  character: CharacterSchema;
} & MeshProps;

function computeLookAtRotationMatrix(
  objectPosition: Vector3,
  targetPosition: Vector3,
  upDirection: Vector3
): Matrix4 {
  const zAxis = objectPosition.clone().sub(targetPosition).normalize();
  const xAxis = upDirection.clone().cross(zAxis).normalize();
  const yAxis = zAxis.clone().cross(xAxis).normalize();

  const rotationMatrix = new Matrix4();
  rotationMatrix.makeBasis(xAxis, yAxis, zAxis);

  return rotationMatrix;
}
export const Atom = ({
  character,
  speed,
  position,
  isActive,
  tileIndex,
  ...AtomProps
}: Atom) => {
  const ref = useRef<Mesh>(null);
  const refTIndex = useRef<InstancedBufferAttribute>(null);
  const updateActiveItem = useStoreCharacter(
    (state) => state.updateActiveCharacter
  );

  const tIndexAttr = useMemo(() => {
    // calc same normals for all tris
    const c = Array.from(
      {
        length: 3 * 4, // 3 elements on 4 vertices
      },
      (_, i) => {
        return [tileIndex];
      }
    );
    const tIndex = new Float32Array(c.flat());

    return tIndex;
  }, [tileIndex]);

  useFrame(({ camera }) => {
    if (!ref.current) {
      return null;
    }

    if (position && position instanceof Vector3) {
      ref.current.position.lerp(position, speed);

      const direction = new Vector3();
      ref.current.getWorldPosition(direction);
      direction.sub(new Vector3(0, 0, 0)); // In your case, parent position is (0,0,0)
      direction.normalize();

      // Get the up direction of the parent circle
      const parentUp = ref.current.parent?.up.clone() ?? new Vector3(0, 1, 0);

      // Compute the rotation matrix
      const rotationMatrix = computeLookAtRotationMatrix(
        ref.current.position,
        direction,
        parentUp
      );

      // Set the Atom's rotation
      ref.current.rotation.setFromRotationMatrix(rotationMatrix);
    }
  });

  return (
    <mesh
      ref={ref}
      {...AtomProps}
      onPointerEnter={() => updateActiveItem(character)}
    >
      <planeGeometry args={[2.5, 2]}>
        <instancedBufferAttribute
          attach="attributes-tileIndex"
          ref={refTIndex}
          array={tIndexAttr}
          count={tIndexAttr.length / 3}
          itemSize={1}
        />
      </planeGeometry>
    </mesh>
  );
};
