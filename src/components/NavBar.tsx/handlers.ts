import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';

export const handleOnChange = (
  v: string,
  update: (selectedCharacters: CharacterSchema[]) => void,
  characters: CharacterSchema[]
) => {
  const value = v.toLowerCase();
  if (value === '') {
    update(characters);
  }
  update(
    characters.filter((character) =>
      character.name.toLowerCase().includes(value)
    )
  );
};
