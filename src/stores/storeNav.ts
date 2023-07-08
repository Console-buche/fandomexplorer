import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Material, Vector3 } from 'three';
import { create } from 'zustand';

export type PathName = '/' | '/about' | '/contact';

type PositionsByStatus = Record<CharacterSchema['status'], Vector3[]>;

type InitialState = {
  currentPath: PathName;
  previousPath: PathName;
  positions404: PositionsByStatus;
};

type Actions = {
  reset: () => void;
  updatePathName: (pathName: PathName) => void;
  setPositions404: (
    positions: Vector3[],
    status: CharacterSchema['status']
  ) => void;
};

const initialState: InitialState = {
  currentPath: '/',
  previousPath: '/',
  positions404: {
    Alive: [],
    Dead: [],
    unknown: [],
  },
};

export const useStoreNav = create<InitialState & Actions>((set) => ({
  ...initialState,

  updatePathName(pathName) {
    set((state) => ({
      previousPath: state.currentPath,
      currentPath: pathName,
    }));
  },

  setPositions404(positions, status) {
    set((state) => ({
      positions404: {
        ...state.positions404,
        [status]: positions,
      },
    }));
  },

  reset() {
    set(initialState);
  },
}));
