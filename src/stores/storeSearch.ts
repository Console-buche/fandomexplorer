import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { create } from 'zustand';

type InitialState = {
  currentSearch: string;
  inputSearch: React.RefObject<HTMLInputElement> | null;
  countPerStatus: Record<CharacterSchema['status'], number | undefined>;
};

type Actions = {
  reset: () => void;
  updateSearch: (currentSearch: string) => void;
  setInputSearch: (ref: React.RefObject<HTMLInputElement>) => void;
  updateCountPerStatus: (
    status: CharacterSchema['status'],
    count: number | undefined
  ) => void;
};

const initialState: InitialState = {
  currentSearch: '',
  inputSearch: null,
  countPerStatus: {
    Alive: undefined,
    Dead: undefined,
    unknown: undefined,
  },
};

export const useStoreSearch = create<InitialState & Actions>((set) => ({
  ...initialState,

  updateSearch(currentSearch) {
    set({ currentSearch });
  },

  setInputSearch(ref) {
    set({ inputSearch: ref });
  },

  updateCountPerStatus(status, count) {
    set((state) => ({
      countPerStatus: {
        ...state.countPerStatus,
        [status]: count,
      },
    }));
  },

  reset() {
    set(initialState);
  },
}));
