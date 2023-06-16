import { useStoreSearch } from '@/stores/storeSearch';
import { useEffect, useRef, useState } from 'react';

export const SearchTest = () => {
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
    const timeOut = setTimeout(() => {
      if (filter.length > 0 && filter.length < 3) {
        return;
      }
      updateSearch(filter);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [filter, updateSearch]);

  return (
    <input
      style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
      ref={inputSearchRef}
      type="text"
      placeholder="Search..."
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};
