import { create } from 'zustand';

type InitialState = {
  name: string;
};

type Actions = {
  reset: () => void;
};

const initialState: InitialState = {
  name: 'LALALA SLICE DBZ',
};

export function createFandomSliceDBZ() {
  return create<InitialState & Actions>((set) => ({
    ...initialState,

    reset() {
      set(initialState);
    },
  }));
}
