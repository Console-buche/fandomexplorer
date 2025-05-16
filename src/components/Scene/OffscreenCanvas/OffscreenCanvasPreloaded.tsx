import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useEffect, useRef, useState } from 'react';
import { useOffscreenCanvasStore } from './offscreenCanvas.store';

interface OffscreenCanvasProps {
  size: number;
  status: CharacterSchema['status'];
}

export const OffscreenCanvasPreloaded = ({
  size,
  status,
}: OffscreenCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRdy, setIsRdy] = useState(false);

  const setOffscreenCanvas = useOffscreenCanvasStore(
    (state) => state.setOffscreenCanvas
  );
  const imgs = `assets/atlas_rm_status_${status.toLocaleLowerCase()}.png`;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      // Clear canvas first
      ctx.clearRect(0, 0, size, size);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Set up onload handler before setting src
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        setIsRdy(true);
        setOffscreenCanvas(canvas, status);
      };
      
      img.onerror = () => {
        console.error(`Failed to load atlas image: ${imgs}`);
        // Still set the canvas to prevent blocking the app
        setIsRdy(true);
        setOffscreenCanvas(canvas, status);
      };
      
      // Set properties and start loading
      img.width = size;
      img.height = size;
      img.src = imgs; // Set src last to start loading
    }
  }, [size, setOffscreenCanvas, status, imgs]);

  return (
    <canvas
      style={{ display: 'none' }}
      ref={canvasRef}
      width={size}
      height={size}
    />
  );
};
