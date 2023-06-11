import { create, StoreApi } from 'zustand';
import { createFandomSliceRickAndMorty } from './fandomSlices/fandomSliceRickAndMorty';
import { GlobalState } from './types';

export const useStoreFandoms = create<GlobalState>(
  (
    set: StoreApi<GlobalState>['setState'],
    get: StoreApi<GlobalState>['getState']
  ) => ({
    rickAndMorty: createFandomSliceRickAndMorty(set, get),
  })
);
