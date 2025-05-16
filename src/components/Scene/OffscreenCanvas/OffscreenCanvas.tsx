import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useEffect, useRef, useState } from 'react';
import { useOffscreenCanvasStore } from './offscreenCanvas.store';

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
      let loadedImagesCount = 0;
      const totalImages = imgs.filter(Boolean).length;
      
      // Clear canvas first to prevent artifacts
      ctx.clearRect(0, 0, width, height);

      // Create a promise for each image load
      const loadImage = (imageUrl: string, index: number) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            const x = (index % (width / imgWidth)) * imgWidth;
            const y = height - Math.floor(index / (width / imgWidth) + 1) * imgHeight;
            ctx.drawImage(img, x, y, imgWidth, imgHeight);
            loadedImagesCount++;
            
            if (loadedImagesCount === totalImages) {
              setIsRdy(true);
              setOffscreenCanvas(canvas, status);
            }
            resolve();
          };
          
          img.onerror = () => {
            console.error(`Failed to load image: ${imageUrl}`);
            loadedImagesCount++;
            
            if (loadedImagesCount === totalImages) {
              setIsRdy(true);
              setOffscreenCanvas(canvas, status);
            }
            resolve();
          };
          
          // Set properties and start loading
          img.width = imgWidth;
          img.height = imgHeight;
          img.src = imageUrl; // Set src last to start loading
        });
      };

      // Load all images
      Promise.all(
        imgs.map((imageUrl, index) => {
          if (imageUrl) {
            return loadImage(imageUrl, index);
          }
          return Promise.resolve();
        })
      );
    }
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
