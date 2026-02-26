import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { DialStore } from '../../store/DialStore';
import type { PanelConfig } from '../../store/DialStore';
import { Panel } from './Panel';

export type DialPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface DialRootProps {
  position?: DialPosition;
}

export function DialRoot(props: DialRootProps) {
  const [panels, setPanels] = createSignal<PanelConfig[]>([]);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
    setPanels(DialStore.getPanels());
    const unsub = DialStore.subscribeGlobal(() => {
      setPanels(DialStore.getPanels());
    });
    onCleanup(unsub);
  });

  return (
    <Show when={mounted() && typeof window !== 'undefined' && panels().length > 0}>
      <Portal mount={document.body}>
        <div class="dialkit-root">
          <div class="dialkit-panel" data-position={props.position ?? 'top-right'}>
            <For each={panels()}>
              {(panel) => <Panel panel={panel} />}
            </For>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
