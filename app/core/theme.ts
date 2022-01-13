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

export const theme = {
  colors: {},
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
