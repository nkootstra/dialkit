// dialkit/vanilla — Framework-free adapter
// Use this with plain JavaScript, Svelte, Vue, or any framework

export { createDialKit } from './createDialKit';
export type { DialKitInstance } from './createDialKit';

// Re-export core for convenience
export { DialStore } from '../core';
export type {
  SpringConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  Preset,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from '../core';
