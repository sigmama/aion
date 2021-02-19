import { NbJSThemeOptions, COSMIC_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const COSMIC_THEME = {
  name: 'cosmic',
  base: 'cosmic',
  variables: {
    echarts: {
      bg: baseThemeVariables.bg,
      textColor: baseThemeVariables.fgText,
      axisLineColor: baseThemeVariables.fgText,
      splitLineColor: baseThemeVariables.separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: baseThemeVariables.primary,
      areaOpacity: '1',
    },
  },
} as NbJSThemeOptions;
