import { Material, Vector3 } from 'three';
import { create } from 'zustand';

export type PathName = '/' | '/about' | '/contact';

type InitialState = {
  currentPath: PathName;
};

type Actions = {
  reset: () => void;
  updatePathName: (pathName: PathName) => void;
};

const initialState: InitialState = {
  currentPath: '/',
};

export const useStoreNav = create<InitialState & Actions>((set) => ({
  ...initialState,

  updatePathName(pathName) {
    set({ currentPath: pathName });
  },

  reset() {
    set(initialState);
  },
}));
