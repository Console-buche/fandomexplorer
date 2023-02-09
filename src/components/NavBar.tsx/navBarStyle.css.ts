import { fontFace, style } from '@vanilla-extract/css';

export const Poppins = fontFace({
  src: `url('/fonts/Poppins-Bold.ttf') format('truetype-variations')`,
  fontDisplay: 'swap',
});

export const navBarStyle = style({
  height: '60px',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: Poppins,
});

export const navBarSearchStyle = style({
  width: '300px',
  padding: '10px',
});

export const navBarInnerStyle = style({
  padding: '10px 0',
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: Poppins,
  alignItems: 'center',
  color: '#F5C518',
});

export const linkStyle = style({
  color: '#E3E3E3',
  display: 'flex',
  gap: '10px',
});
