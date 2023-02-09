import { style } from '@vanilla-extract/css';

export const pageLayoutStyle = style({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
});

export const pageHomeLoader = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  fontSize: '12rem',
  color: 'white',
});

export const pageCardContainer = style({
  display: 'flex',
  width: '100%',
  height: '100%',
});

export const pageCardContainerSelection = style([
  pageCardContainer,
  {
    justifyContent: 'end',
    color: '#F0EFEF',
  },
]);

export const pageCardHeader = style([
  pageCardContainer,
  {
    color: 'white',
    backgroundColor: '#3BB45D',
    borderRadius: 5,
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'space-between',
  },
]);

export const pageCardHeaderSelection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
  padding: '0 20px',
});
