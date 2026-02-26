import { createSignal, createRenderEffect, onMount, onCleanup, For } from 'solid-js';
import { animate } from 'motion';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: [SegmentedControlOption<T>, SegmentedControlOption<T>];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  let containerRef!: HTMLDivElement;
  let pillRef!: HTMLDivElement;
  const buttonRefs = new Map<T, HTMLButtonElement>();
  const [pillReady, setPillReady] = createSignal(false);

  let hasAnimated = false;
  let pillAnim: any = null;

  const measurePill = () => {
    const button = buttonRefs.get(props.value);
    if (!button || !containerRef) return null;
    const containerRect = containerRef.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    return {
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    };
  };

  const setPillImmediate = (left: number, width: number) => {
    if (!pillRef) return;
    pillRef.style.left = `${left}px`;
    pillRef.style.width = `${width}px`;
  };

  const updatePill = (shouldAnimate: boolean) => {
    const next = measurePill();
    if (!next) return;

    if (!pillReady()) {
      setPillImmediate(next.left, next.width);
      setPillReady(true);
      return;
    }

    if (!shouldAnimate || !hasAnimated) {
      pillAnim?.stop();
      pillAnim = null;
      setPillImmediate(next.left, next.width);
      return;
    }

    pillAnim?.stop();
    pillAnim = animate(pillRef, {
      left: next.left,
      width: next.width,
    }, {
      type: 'spring',
      visualDuration: 0.2,
      bounce: 0.15,
      onComplete: () => {
        pillAnim = null;
      },
    });
  };

  createRenderEffect(() => {
    const _ = props.value;
    if (!pillReady()) return;
    updatePill(true);
  });

  onMount(() => {
    requestAnimationFrame(() => {
      updatePill(false);
      hasAnimated = true;
    });

    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => updatePill(false));
    ro.observe(containerRef);

    onCleanup(() => {
      pillAnim?.stop();
      ro.disconnect();
    });
  });

  return (
    <div ref={containerRef} class="dialkit-segmented">
      <div
        ref={pillRef}
        class="dialkit-segmented-pill"
        style={{ left: '0px', width: '0px', visibility: pillReady() ? 'visible' : 'hidden' }}
      />
      <For each={props.options}>
        {(option) => (
          <button
            ref={(el) => {
              if (!el) return;
              buttonRefs.set(option.value, el);
            }}
            onClick={() => props.onChange(option.value)}
            class="dialkit-segmented-button"
            data-active={String(props.value === option.value)}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
