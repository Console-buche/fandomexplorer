import { useStoreSearch } from '@/stores/storeSearch';
import { Text } from '@react-three/drei';
import { useEffect, useState } from 'react';
import Poppins from '@fonts/Poppins-Black.ttf';

type Holosearch = {
  isEditing: boolean;
};

export const Holosearch = ({ isEditing }: Holosearch) => {
  const [blink, setBlink] = useState('');
  const currentSearch = useStoreSearch((state) => state.currentSearch);
  const inputSearch = useStoreSearch((state) => state.inputSearch);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((b) => (b === '' ? '|' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isEditing && inputSearch && inputSearch.current) {
      inputSearch.current.focus();
    }
  }, [isEditing, inputSearch]);

  return (
    <Text
      font={Poppins}
      scale={0.06}
      position={[-0.15, 0.02, 0.1]}
      color="white"
      textAlign="left"
      anchorX={0}
    >
      {currentSearch} {blink}
    </Text>
  );
};
