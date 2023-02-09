import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { create } from 'zustand';

type OffscreenCanvasRef = HTMLCanvasElement | null;

type State = {
  offscreenCanvas: Map<CharacterSchema['status'], OffscreenCanvasRef>;
};

type Actions = {
  setOffscreenCanvas: (
    offscreenCanvas: OffscreenCanvasRef,
    status: CharacterSchema['status']
  ) => void;
};

const initialState: State = {
  offscreenCanvas: new Map(),
};

export const useOffscreenCanvasStore = create<State & Actions>((set) => ({
  ...initialState,
  setOffscreenCanvas: (
    offscreenCanvas: OffscreenCanvasRef,
    status: CharacterSchema['status']
  ) =>
    set((state) => {
      const currentOffscreenCanvas = new Map(state.offscreenCanvas);
      currentOffscreenCanvas.set(status, offscreenCanvas);
      return { offscreenCanvas: currentOffscreenCanvas };
    }),
}));
