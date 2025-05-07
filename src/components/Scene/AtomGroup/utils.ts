import { Vector3 } from 'three';

type PositionOnCircle = {
  elementId: number;
  elementsCount: number;
  radius?: number;
};

export function getPositionOnCircleWithSpecialElement({
  elementId,
  elementsCount,
  radius = 5,
  specialElementId = 0,
}: {
  elementId: number;
  elementsCount: number;
  radius?: number;
  specialElementId?: number;
}): [number, number, number] {
  const anglePerElement = 2 / elementsCount; // Each regular element gets this much space
  const extraSpaceForSpecialElements = 4; // 4 extra spaces for the special elements
  const specialAnglePerElement =
    2 / (elementsCount + extraSpaceForSpecialElements); // Each special element gets this much space
  const minSpaceAngle = specialAnglePerElement * 2; // Elements farthest from the special element in the varying size range
  const someSpaceAngle = specialAnglePerElement * 3; // Elements closer to the special element
  const moreSpaceAngle = specialAnglePerElement * 4; // Elements adjacent to the special element
  const specialElementAngle = specialAnglePerElement * 5; // The special element gets the maximum space

  let cumulativeAngle;

  if (
    elementId === specialElementId ||
    elementId === specialElementId - 1 ||
    elementId === specialElementId + 1 ||
    elementId === specialElementId - 2 ||
    elementId === specialElementId + 2 ||
    elementId === specialElementId - 3 ||
    elementId === specialElementId + 3
  ) {
    // This element is in the "special range"
    cumulativeAngle = anglePerElement * (specialElementId - 3);
    for (let i = specialElementId - 3; i <= elementId; i++) {
      if (i === specialElementId) {
        cumulativeAngle += specialElementAngle;
      } else if (i === specialElementId - 1 || i === specialElementId + 1) {
        cumulativeAngle += moreSpaceAngle;
      } else if (i === specialElementId - 2 || i === specialElementId + 2) {
        cumulativeAngle += someSpaceAngle;
      } else if (i === specialElementId - 3 || i === specialElementId + 3) {
        cumulativeAngle += minSpaceAngle;
      }
    }
  } else {
    // This element is a "regular" element
    cumulativeAngle = anglePerElement * elementId;
  }

  return [
    radius * Math.cos(cumulativeAngle * Math.PI),
    0,
    radius * Math.sin(cumulativeAngle * Math.PI),
  ];
}

export function positionOnCircle({
  elementId,
  elementsCount,
  radius = 5,
}: PositionOnCircle): [number, number, number] {
  return [
    radius * Math.cos((2 / elementsCount) * elementId * Math.PI),
    0,
    radius * Math.sin((2 / elementsCount) * elementId * Math.PI),
  ];
}

/**
 * Returns the position of an element along a set of vertices
 */
export function positionAlongVerticesSet(
  verticesSet: Vector3[],
  totalElementsCount: number,
  elementId: number
): [number, number, number] {
  // Get the ratio of elements per vertex
  const ratio = totalElementsCount / verticesSet.length;

  // Find the corresponding vertex for the element
  const vertexIndex = Math.floor(elementId / ratio);
  const vertex = verticesSet[vertexIndex];

  return [vertex.x, vertex.y, vertex.z];
}

export function positionOnCircleWithVariation({
  elementId,
  elementsCount,
  radius = 5,
  currentElementId = 0,
  displacementFactor = 1,
}: {
  elementId: number;
  elementsCount: number;
  radius?: number;
  currentElementId?: number;
  displacementFactor?: number;
}): [number, number, number] {
  let displacement = 0;
  if (Math.abs(elementId - currentElementId) <= 30) {
    // Use sine wave to generate a displacement for elements within 5 of the current element
    displacement =
      currentElementId === elementId
        ? 0
        : Math.sin(elementId) * displacementFactor;
  }

  return [
    (radius + displacement) *
      Math.cos((2 / elementsCount) * elementId * Math.PI),
    0,
    (radius + displacement) *
      Math.sin((2 / elementsCount) * elementId * Math.PI),
  ];
}

type PositionOnGrid = {
  elementId: number;
  rowLength: number;
  cellSize: number;
};

export function positionOnGrid({
  elementId,
  rowLength,
  cellSize,
}: PositionOnGrid): [number, number, number] {
  const x = (elementId % rowLength) * cellSize;
  const y = Math.floor(elementId / rowLength) * cellSize;
  const z = 0;
  return [x, y, z];
}

// ¨polar positionning

type PositionInGrowingCircle = {
  elementId: number;
  initialRadius: number;
  radiusIncrement: number;
  minElementSpacing: number;
  zCurveFactor?: number;
};

export function positionInGrowingCircle({
  elementId,
  initialRadius,
  radiusIncrement,
  minElementSpacing,
  zCurveFactor = 0,
}: PositionInGrowingCircle): [number, number, number] {
  // Determine which circle the current element belongs to
  let circleIndex = 0;
  let totalElements = 0;
  while (elementId >= totalElements) {
    const elementsInCurrentCircle = Math.max(
      1,
      Math.floor(
        (2 * Math.PI * (initialRadius + circleIndex * radiusIncrement)) /
          minElementSpacing
      )
    );
    totalElements += elementsInCurrentCircle;
    circleIndex++;
  }
  circleIndex--;

  // Calculate the elements that have been placed up to the previous circle
  const elementsUpToPreviousCircle =
    totalElements -
    Math.max(
      1,
      Math.floor(
        (2 * Math.PI * (initialRadius + circleIndex * radiusIncrement)) /
          minElementSpacing
      )
    );

  // Calculate the angle between each element in radians
  const elementsInCurrentCircle = Math.max(
    1,
    Math.floor(
      (2 * Math.PI * (initialRadius + circleIndex * radiusIncrement)) /
        minElementSpacing
    )
  );
  const angleStep = (2 * Math.PI) / elementsInCurrentCircle;

  // Calculate the polar coordinates for the current element
  const theta = (elementId - elementsUpToPreviousCircle) * angleStep;
  const r = initialRadius + circleIndex * radiusIncrement;

  // Convert polar coordinates to Cartesian coordinates
  const x = 1.11 * r * Math.cos(theta);
  const y = 0.96 * r * Math.sin(theta);
  const z = Math.pow(circleIndex, 2) * zCurveFactor;

  return [x, y, z];
}
