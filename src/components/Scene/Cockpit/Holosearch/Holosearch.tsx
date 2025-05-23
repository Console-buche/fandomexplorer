import { useStoreSearch } from '@/stores/storeSearch';
import Poppins from '@fonts/Poppins-Black.ttf';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';

type Holosearch = {
  isEditing: boolean;
};

let t = 0;
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

  useFrame(() => {
    t += 1;
    if (inputSearch && inputSearch.current && t % 30 === 0 && t > 0) {
      inputSearch.current.focus();
    }
  });

  const placeholder =
    currentSearch === '' && !isEditing ? 'Search character' : undefined;

  return (
    <Text
      font={Poppins}
      scale={0.06}
      position={[-0.15, 0.02, 0.1]}
      color={placeholder ? 'lightgray' : 'white'}
      fontSize={0.6}
      textAlign="left"
      anchorX={0}
    >
      {placeholder || currentSearch} {blink}
    </Text>
  );
};
