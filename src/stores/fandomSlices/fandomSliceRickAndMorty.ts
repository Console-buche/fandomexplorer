import { create } from 'zustand';

type InitialState = {
  name: string;
};

type Actions = {
  reset: () => void;
};

const initialState: InitialState = {
  name: 'LALALA JE SUIS LE STORE RICK AND MORTY',
};

export function createFandomSliceRickAndMorty() {
  return create<InitialState & Actions>((set) => ({
    ...initialState,

    reset() {
      set(initialState);
    },
  }));
}
