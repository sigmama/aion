import { NbJSThemeOptions, CORPORATE_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const CORPORATE_THEME = {
  name: 'corporate',
  base: 'corporate',
  variables: {
    echarts: {
      bg: baseThemeVariables.bg,
      textColor: baseThemeVariables.fgText,
      axisLineColor: baseThemeVariables.fgText,
      splitLineColor: baseThemeVariables.separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: baseThemeVariables.primary,
      areaOpacity: '0.7',
    },
  },
} as NbJSThemeOptions;
