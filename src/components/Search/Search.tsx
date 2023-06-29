import { useStoreSearch } from '@/stores/storeSearch';
import { useEffect, useRef, useState } from 'react';

export const Search = () => {
  const [filter, setFilter] = useState('');
  const updateSearch = useStoreSearch((state) => state.updateSearch);
  const setInputSearch = useStoreSearch((state) => state.setInputSearch);

  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputSearchRef.current) {
      setInputSearch(inputSearchRef);
    }
  }, [inputSearchRef, setInputSearch]);

  useEffect(() => {
    updateSearch(filter);
  }, [filter, updateSearch]);

  return (
    <input
      style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
      ref={inputSearchRef}
      type="text"
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};
