import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Vector3 } from 'three';
import { StoreApi } from 'zustand';

type SliceState = { rickAndMorty: RickAndMortySlice };

export type RickAndMortySlice = InitialState & Actions;

type InitialPosAndRotX = {
  pos: Vector3;
  rotX: number;
};

type InitialState = {
  name: string;
  initialPos: Vector3;
  activeStatus: CharacterSchema['status'];
  previousStatus: CharacterSchema['status'];
  initialPosByStatus: Record<CharacterSchema['status'], InitialPosAndRotX>;
};

type Actions = {
  reset: () => void;
  updateActiveStatus: (filterBy: CharacterSchema['status']) => void;
  getPositionFromCurrentFilter: () => InitialPosAndRotX;
  getPositionFromPreviousFilter: () => InitialPosAndRotX;
};

const initialState: InitialState = {
  name: 'LALALA JE SUIS LE STORE RICK AND MORTY',
  initialPos: new Vector3(0, 0, 240),
  previousStatus: 'Alive',
  activeStatus: 'Alive',
  initialPosByStatus: {
    Alive: { pos: new Vector3(0, 0, 240), rotX: 0.05 },
    Dead: { pos: new Vector3(0, 0, 160), rotX: Math.PI / 3 },
    unknown: { pos: new Vector3(0, 0, 60), rotX: Math.PI / -3 },
  },
};

export const createFandomSliceRickAndMorty = (
  set: StoreApi<SliceState>['setState'],
  get: StoreApi<SliceState>['getState']
): RickAndMortySlice => ({
  ...initialState,

  updateActiveStatus(filterBy: CharacterSchema['status']) {
    set((state) => ({
      ...state,
      rickAndMorty: {
        ...state.rickAndMorty,
        previousStatus: state.rickAndMorty.activeStatus,
        activeStatus: filterBy,
      },
    }));
  },

  getPositionFromCurrentFilter() {
    return get().rickAndMorty.initialPosByStatus[
      get().rickAndMorty.activeStatus
    ];
  },

  getPositionFromPreviousFilter() {
    return get().rickAndMorty.initialPosByStatus[
      get().rickAndMorty.previousStatus
    ];
  },

  reset() {
    set(({ rickAndMorty }) => ({
      rickAndMorty: { ...rickAndMorty, ...initialState },
    }));
  },
});
