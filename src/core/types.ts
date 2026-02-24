// Core types for DialKit — framework-agnostic

export type SpringConfig = {
  type: 'spring';
  stiffness?: number;
  damping?: number;
  mass?: number;
  visualDuration?: number;
  bounce?: number;
};

export type ActionConfig = {
  type: 'action';
  label?: string;
};

export type SelectConfig = {
  type: 'select';
  options: (string | { value: string; label: string })[];
  default?: string;
};

export type ColorConfig = {
  type: 'color';
  default?: string;
};

export type TextConfig = {
  type: 'text';
  default?: string;
  placeholder?: string;
};

export type DialValue = number | boolean | string | SpringConfig | ActionConfig | SelectConfig | ColorConfig | TextConfig;

export type DialConfig = {
  [key: string]: DialValue | [number, number, number, number?] | DialConfig;
};

export type ResolvedValues<T extends DialConfig> = {
  [K in keyof T]: T[K] extends [number, number, number, number?]
    ? number
    : T[K] extends SpringConfig
      ? SpringConfig
      : T[K] extends SelectConfig
        ? string
        : T[K] extends ColorConfig
          ? string
          : T[K] extends TextConfig
            ? string
            : T[K] extends DialConfig
              ? ResolvedValues<T[K]>
              : T[K];
};

export type ControlMeta = {
  type: 'slider' | 'toggle' | 'spring' | 'folder' | 'action' | 'select' | 'color' | 'text';
  path: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  children?: ControlMeta[];
  defaultOpen?: boolean;
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
};

export type PanelConfig = {
  id: string;
  name: string;
  controls: ControlMeta[];
  values: Record<string, DialValue>;
};

export type Preset = {
  id: string;
  name: string;
  values: Record<string, DialValue>;
};
