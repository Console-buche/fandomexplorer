// types.ts
import { RickAndMortySlice } from './fandomSlices/fandomSliceRickAndMorty';

export type GlobalState = {
  rickAndMorty: RickAndMortySlice;
  // more slices here
};
