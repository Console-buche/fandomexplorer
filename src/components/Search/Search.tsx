import { CharacterSchema } from '@/services/getCharacters/userQueryGetCharacters.schema';
import { useStoreSearch } from '@/stores/storeSearch';
import { Checkbox } from './Checkbox';

export const Search = () => {
  const updateSearch = useStoreSearch((state) => state.updateSearch);
  const updateCurrentStatus = useStoreSearch(
    (state) => state.updateCurrentStatus
  );

  return (
    <form>
      <input
        type="text"
        placeholder="Enter name"
        onChange={(e) => updateSearch(e.target.value)}
      />
      <fieldset>
        <Checkbox<CharacterSchema['status']>
          value="Alive"
          onChange={updateCurrentStatus}
          defaultChecked
        />
        <Checkbox<CharacterSchema['status']>
          value="Dead"
          onChange={updateCurrentStatus}
          defaultChecked
        />
        <Checkbox<CharacterSchema['status']>
          value="unknown"
          onChange={updateCurrentStatus}
          defaultChecked
        />
      </fieldset>
    </form>
  );
};
