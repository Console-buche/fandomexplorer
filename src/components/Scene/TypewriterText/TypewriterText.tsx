import Poppins from '@fonts/Poppins-Black.ttf';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ShaderMaterial, Vector3 } from 'three';

interface TypewriterTextProps {
  typewrittenText: string | undefined;
  prefix?: string;
  delay?: number;
  maxWidth?: number;
  position?: Vector3 | [number, number, number];
}

export const TypewriterText = ({
  delay = 25,
  maxWidth,
  typewrittenText = '',
  prefix = '',
  position = [0, 0, 0],
}: TypewriterTextProps) => {
  const [text, setText] = useState('');

  const refShader = useRef<ShaderMaterial>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWord = useRef<string | undefined>(undefined);

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
    lastWord.current = typewrittenText.length > 0 ? typewrittenText : text;

    let currentText = typewrittenText.length > 0 ? '' : lastWord.current;
    let currentIndex = typewrittenText.length > 0 ? 0 : lastWord.current.length;

    const animateTypewriter = () => {
      if (currentIndex < typewrittenText.length) {
        currentText += typewrittenText[currentIndex];
        setText(currentText);
        currentIndex++;
        animationTimeoutRef.current = setTimeout(animateTypewriter, delay);
      }
    };

    const animateTypewritterDeleteCharactersOneByOne = () => {
      if (currentIndex > 0) {
        currentText = currentText.slice(0, -1);
        setText(currentText);
        currentIndex--;
        animationTimeoutRef.current = setTimeout(
          animateTypewritterDeleteCharactersOneByOne,
          delay
        );
      }
    };

    animationTimeoutRef.current =
      typewrittenText.length > 0
        ? setTimeout(animateTypewriter, delay)
        : setTimeout(animateTypewritterDeleteCharactersOneByOne, delay);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, typewrittenText]);

  const pref = text && prefix ? prefix : '';

  return (
    <Text
      position={position}
      font={Poppins}
      letterSpacing={-0.025}
      textAlign="left"
      anchorX={0}
      anchorY={0}
      maxWidth={maxWidth}
      overflowWrap="break-word"
    >
      [{pref} {text}]
      <meshStandardMaterial
        toneMapped={false}
        emissive="#4B0082"
        emissiveIntensity={10}
        opacity={text.length > 0 ? 1 : 0.05}
        transparent
      />
    </Text>
  );
};
