// dialkit/core — Framework-agnostic core
// Use this to build adapters for any framework (React, Vue, Svelte, vanilla JS)

export { DialStore } from './DialStore';
export { buildResolvedValues } from './resolveValues';
export { generateSpringCurve, resolveSpringPhysics } from './springMath';
export {
  decimalsForStep,
  roundValue,
  snapToDecile,
  expandShorthandHex,
  isHexColor,
  toTitleCase,
  normalizeSelectOptions,
  getFirstOptionValue,
} from './utils';

export type {
  SpringConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
  Preset,
} from './types';
