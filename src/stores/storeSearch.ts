import { create } from 'zustand';
import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';

type Item = CharacterSchema | undefined;
type Items = CharacterSchema[] | undefined;

type InitialState = {
  currentSearch: string;
  currentStatus: Set<CharacterSchema['status']>;
};

type Actions = {
  reset: () => void;
  updateSearch: (currentSearch: string) => void;
  updateCurrentStatus: (currentStatus: CharacterSchema['status']) => void;
};

const initialState: InitialState = {
  currentSearch: '',
  currentStatus: new Set(['Alive', 'Dead', 'unknown']),
};

export const useStoreSearch = create<InitialState & Actions>((set) => ({
  ...initialState,

  updateSearch(currentSearch) {
    set({ currentSearch });
  },

  updateCurrentStatus(currentStatus) {
    set((state) => {
      const newStatus = new Set(state.currentStatus);
      if (newStatus.has(currentStatus)) {
        newStatus.delete(currentStatus);
      } else {
        newStatus.add(currentStatus);
      }
      return { currentStatus: newStatus };
    });
  },

  reset() {
    set(initialState);
  },
}));
