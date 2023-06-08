import { Material } from 'three';
import { create } from 'zustand';

type InitialState = {
  material: Material | Material[] | undefined;
};

type Actions = {
  reset: () => void;
  updateMaterial: (material: Material | Material[] | undefined) => void;
};

const initialState: InitialState = {
  material: undefined,
};

export const useStoreScreen = create<InitialState & Actions>((set) => ({
  ...initialState,

  updateMaterial(material) {
    set({ material });
  },

  reset() {
    set(initialState);
  },
}));
