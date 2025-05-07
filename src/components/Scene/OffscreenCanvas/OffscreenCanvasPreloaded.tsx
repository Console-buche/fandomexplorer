import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useEffect, useRef, useState } from 'react';
import { useOffscreenCanvasStore } from './offscreenCanvas.store';
import { useFrame, useThree } from '@react-three/fiber';

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
      const img = new Image();
      img.src = imgs;
      img.width = size;
      img.height = size;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
      };

      setIsRdy(true);
    }

    setOffscreenCanvas(canvas, status);
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
