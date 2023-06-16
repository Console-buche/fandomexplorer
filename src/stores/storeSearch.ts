import { create } from 'zustand';

type InitialState = {
  currentSearch: string;
  inputSearch: React.RefObject<HTMLInputElement> | null;
};

type Actions = {
  reset: () => void;
  updateSearch: (currentSearch: string) => void;
  setInputSearch: (ref: React.RefObject<HTMLInputElement>) => void;
};

const initialState: InitialState = {
  currentSearch: '',
  inputSearch: null,
};

export const useStoreSearch = create<InitialState & Actions>((set) => ({
  ...initialState,

  updateSearch(currentSearch) {
    set({ currentSearch });
  },

  setInputSearch(ref) {
    set({ inputSearch: ref });
  },

  reset() {
    set(initialState);
  },
}));
