import { create } from 'zustand';
import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';

type Character = CharacterSchema | undefined;
type Characters = CharacterSchema[] | undefined;

type InitialState = {
  cart: Characters;
  activeCharacter: Character;
};

type Actions = {
  updateActiveCharacter: (activeCharacter: Character) => void;
  reset: () => void;
};

const initialState: InitialState = {
  cart: undefined,
  activeCharacter: undefined,
};

export const useStoreCharacter = create<InitialState & Actions>((set) => ({
  ...initialState,

  updateActiveCharacter(activeCharacter) {
    set({ activeCharacter });
  },

  reset() {
    set(initialState);
  },
}));
