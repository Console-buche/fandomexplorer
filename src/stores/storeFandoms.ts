import { StateCreator, create } from 'zustand';
import { createFandomSliceRickAndMorty } from './fandomSlices/fandomSliceRickAndMorty';
import { createFandomSliceDBZ } from './fandomSlices/fandomSliceDBZ';

type Universe = 'RickAndMorty' | 'DBZ';

// TODO : make this dynamic and don't hardcore everything. Make it generic and get from the universe
type UniverseSlice =
  | ReturnType<typeof createFandomSliceRickAndMorty>
  | ReturnType<typeof createFandomSliceDBZ>;

type InitialState = {
  selectedUniverse: Universe;
  universes: Map<Universe, UniverseSlice>;
};

type Store = InitialState & Actions;
type Actions = {
  updateSelectedUniverse: (universe: Universe) => void;
  reset: () => void;
  getSelectedUniverse: () => UniverseSlice | undefined;
  selectedUniverseName: () => string | undefined;
};

const initialState: InitialState = {
  selectedUniverse: 'DBZ',
  universes: new Map([
    ['RickAndMorty', createFandomSliceRickAndMorty()],
    ['DBZ', createFandomSliceDBZ()],
  ]),
};

const storeCreator: StateCreator<Store> = (set, get, api) => ({
  ...initialState,

  updateSelectedUniverse(universe: Universe) {
    set(() => ({ selectedUniverse: universe }));
  },

  selectedUniverseName() {
    const selectedUniv = get().getSelectedUniverse();
    if (selectedUniv) {
      const name = selectedUniv((state) => state.name);
      return name;
    }
  },

  reset() {
    set(() => ({ ...initialState }));
  },

  getSelectedUniverse() {
    const state = get().universes.get(get().selectedUniverse);
    return state;
  },
});

export const useStoreFandoms = create<Store>(storeCreator);
