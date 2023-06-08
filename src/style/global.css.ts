import { style } from '@vanilla-extract/css';

export const layoutStyle = style({
  width: '100vw',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
});

export const innerLayoutStyle = style({
  width: '100%',
  height: '100%',
});
