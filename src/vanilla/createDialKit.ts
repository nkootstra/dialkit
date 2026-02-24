// Vanilla JS adapter for DialKit — no framework required
// Use this in plain JavaScript, Svelte, Vue, or any other framework

import { DialStore, buildResolvedValues } from '../core';
import type { DialConfig, DialValue, ResolvedValues } from '../core';

export interface DialKitInstance<T extends DialConfig> {
  /** Get current resolved values */
  getValues(): ResolvedValues<T>;
  /** Subscribe to value changes. Returns unsubscribe function. */
  subscribe(listener: (values: ResolvedValues<T>) => void): () => void;
  /** Subscribe to action triggers. Returns unsubscribe function. */
  onAction(listener: (action: string) => void): () => void;
  /** Clean up and unregister the panel */
  destroy(): void;
  /** The panel ID (for advanced store interactions) */
  readonly panelId: string;
}

let instanceCounter = 0;

/**
 * Create a DialKit panel instance without any framework.
 *
 * Works with vanilla JS, Svelte, Vue, or any other framework.
 * The UI panel is rendered by your framework's DialRoot equivalent,
 * or you can read values programmatically.
 *
 * @example
 * ```js
 * import { createDialKit } from 'dialkit/vanilla';
 *
 * const dial = createDialKit('My Panel', {
 *   opacity: [1, 0, 1, 0.01],
 *   blur: [24, 0, 100],
 *   color: '#ff5500',
 * });
 *
 * // Get current values
 * const values = dial.getValues();
 * console.log(values.opacity, values.blur, values.color);
 *
 * // React to changes
 * const unsub = dial.subscribe((values) => {
 *   document.body.style.opacity = String(values.opacity);
 * });
 *
 * // Cleanup when done
 * dial.destroy();
 * ```
 */
export function createDialKit<T extends DialConfig>(
  name: string,
  config: T,
): DialKitInstance<T> {
  const panelId = `${name}-vanilla-${++instanceCounter}`;

  DialStore.registerPanel(panelId, name, config);

  function getValues(): ResolvedValues<T> {
    const flatValues = DialStore.getValues(panelId);
    return buildResolvedValues(config, flatValues, '') as ResolvedValues<T>;
  }

  function subscribe(listener: (values: ResolvedValues<T>) => void): () => void {
    return DialStore.subscribe(panelId, () => {
      listener(getValues());
    });
  }

  function onAction(listener: (action: string) => void): () => void {
    return DialStore.subscribeActions(panelId, listener);
  }

  function destroy(): void {
    DialStore.unregisterPanel(panelId);
  }

  return {
    getValues,
    subscribe,
    onAction,
    destroy,
    get panelId() { return panelId; },
  };
}
