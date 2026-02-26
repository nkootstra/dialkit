import { SegmentedControl } from './SegmentedControl';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle(props: ToggleProps) {
  return (
    <div class="dialkit-labeled-control">
      <span class="dialkit-labeled-control-label">{props.label}</span>
      <SegmentedControl
        options={[
          { value: 'off' as const, label: 'Off' },
          { value: 'on' as const, label: 'On' },
        ]}
        value={props.checked ? 'on' : 'off'}
        onChange={(val) => props.onChange(val === 'on')}
      />
    </div>
  );
}
