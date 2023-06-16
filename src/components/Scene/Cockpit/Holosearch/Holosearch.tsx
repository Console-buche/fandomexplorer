import { useStoreSearch } from '@/stores/storeSearch';
import { Text } from '@react-three/drei';
import { useEffect } from 'react';

type Holosearch = {
  isEditing: boolean;
};

export const Holosearch = ({ isEditing }: Holosearch) => {
  const currentSearch = useStoreSearch((state) => state.currentSearch);
  const inputSearch = useStoreSearch((state) => state.inputSearch);

  useEffect(() => {
    if (isEditing && inputSearch && inputSearch.current) {
      inputSearch.current.focus();
    }
  }, [isEditing, inputSearch]);

  return (
    <Text
      scale={0.06}
      position={[-0.15, 0, 0.1]}
      color="white"
      textAlign="left"
      anchorX={0}
    >
      {currentSearch}
    </Text>
  );
};
