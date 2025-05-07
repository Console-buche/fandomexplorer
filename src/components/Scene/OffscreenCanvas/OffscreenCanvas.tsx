import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useEffect, useRef, useState } from 'react';
import { useOffscreenCanvasStore } from './offscreenCanvas.store';
import { useFrame, useThree } from '@react-three/fiber';

interface OffscreenCanvasProps {
  width: number;
  height: number;
  cellSize: number;
  status: CharacterSchema['status'];
  characters: CharacterSchema[];
}

export const OffscreenCanvas = ({
  width,
  height,
  status,
  cellSize,
  characters,
}: OffscreenCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRdy, setIsRdy] = useState(false);

  const setOffscreenCanvas = useOffscreenCanvasStore(
    (state) => state.setOffscreenCanvas
  );
  const imgs = characters?.map((c) => c.image);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const imgWidth = 128;
      const imgHeight = 128;

      imgs.forEach((im, index) => {
        if (im) {
          const img = new Image();
          img.src = im;
          img.width = imgWidth;
          img.height = imgHeight;
          img.crossOrigin = 'anonymous';

          const x = (index % (width / imgWidth)) * imgWidth;
          const y =
            height - Math.floor(index / (width / imgWidth) + 1) * imgHeight;

          img.onload = () => {
            ctx.drawImage(img, x, y, imgWidth, imgHeight);
          };
        }
      });

      setIsRdy(true);
    }

    setOffscreenCanvas(canvas, status);
  }, [cellSize, width, height, setOffscreenCanvas, status, imgs]);

  return (
    <canvas
      // style={{ display: 'none' }}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};
