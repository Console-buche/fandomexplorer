import { useStoreFandoms } from '@/stores/storeFandoms';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ShaderMaterial, Vector3 } from 'three';
import Regular from '@pmndrs/assets/fonts/inter_black.woff';
import Firava from 'fonts/Firava.woff2';
import Poppins from '@fonts/Poppins-Black.ttf';

interface TypewriterTextProps {
  typewrittenText: string | undefined;
  prefix?: string;
  delay?: number;
  position?: Vector3 | [number, number, number];
}

export const TypewriterText = ({
  delay = 25,
  typewrittenText = '',
  prefix = '',
  position = [0, 0, 0],
}: TypewriterTextProps) => {
  const [text, setText] = useState('');
  const [currentName, setCurrentName] = useState('');

  const filterBy = useStoreFandoms((state) => state.rickAndMorty.filterBy);

  const updateFilterBy = useStoreFandoms(
    (state) => state.rickAndMorty.updateFilterBy
  );

  const refShader = useRef<ShaderMaterial>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      color: {
        value: new Vector3(1, 0, 1),
      },
    }),
    []
  );

  useFrame(() => {
    if (!refShader.current) {
      return;
    }

    refShader.current.uniforms.uTime.value += 1;
    refShader.current.uniformsNeedUpdate = true;
  });

  useEffect(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    let currentText = '';
    let currentIndex = 0;

    const animateTypewriter = () => {
      setCurrentName(typewrittenText); // Update currentName dynamically
      if (currentIndex < typewrittenText.length) {
        currentText += typewrittenText[currentIndex];
        setText(currentText);
        currentIndex++;
        animationTimeoutRef.current = setTimeout(animateTypewriter, delay);
      }
    };

    animationTimeoutRef.current = setTimeout(animateTypewriter, delay);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [delay, typewrittenText]);

  return (
    <Text
      position={position}
      font={Poppins}
      letterSpacing={-0.025}
      textAlign="left"
      anchorX={0}
    >
      [{prefix} {text}
      <meshStandardMaterial
        toneMapped={false}
        emissive="#4B0082"
        emissiveIntensity={10}
      />
    </Text>
  );
};
