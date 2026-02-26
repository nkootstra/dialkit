import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { animate } from 'motion';
import { DialStore } from '../../store/DialStore';
import type { Preset } from '../../store/DialStore';

interface PresetManagerProps {
  panelId: string;
  presets: Preset[];
  activePresetId: string | null;
  onAdd: () => void;
}

export function PresetManager(props: PresetManagerProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [pos, setPos] = createSignal({ top: 0, left: 0, width: 0 });
  const [portalTarget, setPortalTarget] = createSignal<HTMLElement | null>(null);
  let triggerRef!: HTMLButtonElement;
  let dropdownRef: HTMLDivElement | undefined;
  let chevronRef!: SVGSVGElement;
  let closeAnim: any = null;
  let chevronAnim: any = null;

  const hasPresets = () => props.presets.length > 0;
  const activePreset = () => props.presets.find((p) => p.id === props.activePresetId);

  onMount(() => {
    const root = triggerRef?.closest('.dialkit-root') as HTMLElement | null;
    setPortalTarget(root ?? document.body);

    if (chevronRef) {
      chevronRef.style.transform = `rotate(${isOpen() ? 180 : 0}deg)`;
      chevronRef.style.opacity = String(hasPresets() ? 0.6 : 0.25);
    }

    onCleanup(() => {
      closeAnim?.stop();
      chevronAnim?.stop();
    });
  });

  createEffect(() => {
    if (!chevronRef) return;
    const open = isOpen();
    const has = hasPresets();
    chevronAnim?.stop();
    chevronAnim = animate(
      chevronRef,
      { rotate: open ? 180 : 0, opacity: has ? 0.6 : 0.25 },
      { type: 'spring', visualDuration: 0.2, bounce: 0.15 }
    );
  });

  const updatePos = () => {
    const rect = triggerRef?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  const openDropdown = () => {
    if (!hasPresets()) return;
    updatePos();
    closeAnim?.stop();
    closeAnim = null;
    setMounted(true);
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    if (!dropdownRef) { setMounted(false); return; }
    closeAnim?.stop();
    closeAnim = animate(
      dropdownRef,
      { opacity: 0, y: 4, scale: 0.97 },
      { type: 'spring', visualDuration: 0.15, bounce: 0, onComplete: () => { setMounted(false); closeAnim = null; } }
    );
  };

  const toggle = () => { if (isOpen()) closeDropdown(); else openDropdown(); };

  // Close on click outside
  createEffect(() => {
    if (!isOpen()) return;
    const handleViewportChange = () => updatePos();
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef?.contains(target) || dropdownRef?.contains(target)) return;
      closeDropdown();
    };
    updatePos();
    document.addEventListener('mousedown', handler);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    onCleanup(() => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    });
  });

  const handleSelect = (presetId: string | null) => {
    if (presetId) DialStore.loadPreset(props.panelId, presetId);
    else DialStore.clearActivePreset(props.panelId);
    closeDropdown();
  };

  const handleDelete = (e: MouseEvent, presetId: string) => {
    e.stopPropagation();
    DialStore.deletePreset(props.panelId, presetId);
  };

  return (
    <div class="dialkit-preset-manager">
      <button
        ref={triggerRef}
        class="dialkit-preset-trigger"
        onClick={toggle}
        data-open={String(isOpen())}
        data-has-preset={String(!!activePreset())}
        data-disabled={String(!hasPresets())}
      >
        <span class="dialkit-preset-label">
          {activePreset() ? activePreset()!.name : 'Version 1'}
        </span>
        <svg
          ref={chevronRef}
          class="dialkit-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 9.5L12 15.5L18 9.5" />
        </svg>
      </button>

      <Show when={!!portalTarget()}>
        <Portal mount={portalTarget()!}>
          <Show when={mounted()}>
            <div
              ref={(el) => {
                dropdownRef = el;
                animate(
                  el,
                  { opacity: [0, 1], y: [4, 0], scale: [0.97, 1] },
                  { type: 'spring', visualDuration: 0.15, bounce: 0 }
                );
              }}
              class="dialkit-root dialkit-preset-dropdown"
              style={{
                position: 'fixed',
                top: `${pos().top}px`,
                left: `${pos().left}px`,
                'min-width': `${pos().width}px`,
              }}
            >
              <div
                class="dialkit-preset-item"
                data-active={String(!props.activePresetId)}
                onClick={() => handleSelect(null)}
              >
                <span class="dialkit-preset-name">Version 1</span>
              </div>

              <For each={props.presets}>
                {(preset) => (
                  <div
                    class="dialkit-preset-item"
                    data-active={String(preset.id === props.activePresetId)}
                    onClick={() => handleSelect(preset.id)}
                  >
                    <span class="dialkit-preset-name">{preset.name}</span>
                    <button
                      class="dialkit-preset-delete"
                      onClick={(e) => handleDelete(e, preset.id)}
                      title="Delete preset"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 6.5L5.80734 18.2064C5.91582 19.7794 7.22348 21 8.80023 21H15.1998C16.7765 21 18.0842 19.7794 18.1927 18.2064L19 6.5" />
                        <path d="M10 11V16" />
                        <path d="M14 11V16" />
                        <path d="M3.5 6H20.5" />
                        <path d="M8.07092 5.74621C8.42348 3.89745 10.0485 2.5 12 2.5C13.9515 2.5 15.5765 3.89745 15.9291 5.74621" />
                      </svg>
                    </button>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Portal>
      </Show>
    </div>
  );
}
