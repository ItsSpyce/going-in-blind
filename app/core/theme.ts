import { createGlobalStyle } from 'styled-components';

const createBreakpoint = (size: number) =>
  `@media and screen (min-width: ${size}px)`;

export const breakpoints = {
  xs: createBreakpoint(320),
  sm: createBreakpoint(460),
  md: createBreakpoint(720),
  lg: createBreakpoint(980),
  xl: createBreakpoint(1020),
  xxl: createBreakpoint(1400),
};

const grays = {
  gray100: 'black',
  gray900: 'white',
};

export const theme = {
  colors: {
    ...grays,
    backgroundDark: grays.gray100,
    backgroundLight: grays.gray900,
    textDark: grays.gray100,
    textLight: grays.gray900,
  },
  sizes: {},
};

export type GibTheme = typeof theme;

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
