import { createFandomSliceDBZ } from './fandomSliceDBZ';
import {
  RickAndMortySlice,
  createFandomSliceRickAndMorty,
} from './fandomSliceRickAndMorty';

export type Universe = 'RickAndMorty' | 'DBZ';

// TODO : make this dynamic and don't hardcore everything. Make it generic and get from the universe
export type UniverseSlice =
  | ReturnType<typeof createFandomSliceRickAndMorty>
  | ReturnType<typeof createFandomSliceDBZ>;

export type FandomStoreState = RickAndMortySlice;
