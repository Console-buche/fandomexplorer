import { Vector3 } from 'three';

interface LookAtOptions {
  position: Vector3;
  isSelected: boolean;
  displaceSelectedZ: number;
}

export function calculateLookAt(options: LookAtOptions): Vector3 {
  const { position, isSelected, displaceSelectedZ } = options;

  // Calculate the direction vector as the normalized position
  const direction = new Vector3().copy(position).normalize();

  // Set z displacement for selected element
  const finalPosition = new Vector3()
    .copy(position)
    .addScaledVector(direction, isSelected ? displaceSelectedZ : 0.0);

  // Look at direction
  const lookAt = finalPosition.clone().add(direction);

  return lookAt;
}
