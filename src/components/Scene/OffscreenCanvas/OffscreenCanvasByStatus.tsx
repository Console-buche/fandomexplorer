import { StrictObject } from '@/utils/strictObject';
import { useQueryGetCharactersFromFileWithLoadedImages } from '@/services/getCharacters/useQueryGetCharacters';
import { OffscreenCanvas } from './OffscreenCanvas';

export const OffscreenCanvasByStatus = () => {
  const charactersByStatus = useQueryGetCharactersFromFileWithLoadedImages();

  if (!charactersByStatus.data) {
    return null;
  }

  const characterDataAsEntries = StrictObject.entries(charactersByStatus.data);

  return (
    <>
      {characterDataAsEntries.map(([status, character]) => (
        <OffscreenCanvas
          key={status}
          cellSize={30}
          height={2048 * 2}
          width={2048 * 2}
          status={status}
          characters={character}
        />
      ))}
    </>
  );
};
