// dialkit/react — React adapter
// Provides React components and hooks for DialKit

// Main hook
export { useDialKit } from './useDialKit';
export type { UseDialOptions } from './useDialKit';

// Root component (user mounts once)
export { DialRoot } from './DialRoot';
export type { DialPosition } from './DialRoot';

// Individual components (for advanced usage)
export { Slider } from './Slider';
export { Toggle } from './Toggle';
export { Folder } from './Folder';
export { ButtonGroup } from './ButtonGroup';
export { SpringControl } from './SpringControl';
export { SpringVisualization } from './SpringVisualization';
export { TextControl } from './TextControl';
export { SelectControl } from './SelectControl';
export { ColorControl } from './ColorControl';
export { PresetManager } from './PresetManager';
export { SegmentedControl } from './SegmentedControl';

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
