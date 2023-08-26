import Poppins from '@fonts/Poppins-Black.ttf';
import { Text } from '@react-three/drei';
import { MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MeshStandardMaterial, ShaderMaterial, Vector3 } from 'three';

type TypewriterTextProps = {
  typewrittenText: string | undefined;
  textWrapper?: { head: string; tail: string };
  prefix?: string;
  delay?: number;
  fontSize?: number;
  letterSpacing?: number;
  maxWidth?: number;
  emissiveIntensity?: number;
  outLine?: number;
  fontFamily?: string;
  textMaterial: MeshStandardMaterial;
} & MeshProps;

export const TypewriterText = ({
  delay = 25,
  maxWidth,
  letterSpacing = -0.025,
  typewrittenText = '',
  fontSize = 0.4,
  prefix = '',
  textWrapper = { head: '[', tail: ']' },
  emissiveIntensity = 10,
  outLine,
  fontFamily = Poppins,
  textMaterial,
  ...meshProps
}: TypewriterTextProps) => {
  const [text, setText] = useState('');

  const refShader = useRef<ShaderMaterial>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWord = useRef<string | undefined>(undefined);

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
      font={fontFamily}
      letterSpacing={letterSpacing}
      textAlign="left"
      anchorX={0}
      anchorY={0}
      maxWidth={maxWidth}
      fontSize={fontSize}
      overflowWrap="break-word"
      material-emissiveIntensity={emissiveIntensity}
      material-opacity={text.length > 0 ? 1 : 0}
      material={textMaterial}
      {...meshProps}
    >
      {textWrapper.head}
      {pref} {text}
      {textWrapper.tail}
    </Text>
  );
};
