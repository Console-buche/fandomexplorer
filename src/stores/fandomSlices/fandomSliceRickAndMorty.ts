import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { Vector3 } from 'three';
import { StoreApi } from 'zustand';

type SliceState = { rickAndMorty: RickAndMortySlice };

export type RickAndMortySlice = InitialState & Actions;

type InitialState = {
  name: string;
  initialPos: Vector3;
  filterBy: CharacterSchema['status'];
  initialPosByStatus: Record<CharacterSchema['status'], Vector3>;
};

type Actions = {
  reset: () => void;
  updateFilterBy: (filterBy: CharacterSchema['status']) => void;
  getPositionFromCurrentFilter: () => Vector3;
};

const initialState: InitialState = {
  name: 'LALALA JE SUIS LE STORE RICK AND MORTY',
  initialPos: new Vector3(0, 0, 240),
  filterBy: 'Alive',
  initialPosByStatus: {
    Alive: new Vector3(0, 0, 240),
    Dead: new Vector3(0, 0, 120),
    unknown: new Vector3(0, 0, 60),
  },
};

export const createFandomSliceRickAndMorty = (
  set: StoreApi<SliceState>['setState'],
  get: StoreApi<SliceState>['getState']
): RickAndMortySlice => ({
  ...initialState,

  updateFilterBy(filterBy: CharacterSchema['status']) {
    set((state) => ({
      ...state,
      rickAndMorty: { ...state.rickAndMorty, filterBy },
    }));
  },

  getPositionFromCurrentFilter() {
    return get().rickAndMorty.initialPosByStatus[get().rickAndMorty.filterBy];
  },

  reset() {
    set(({ rickAndMorty }) => ({
      rickAndMorty: { ...rickAndMorty, ...initialState },
    }));
  },
});
