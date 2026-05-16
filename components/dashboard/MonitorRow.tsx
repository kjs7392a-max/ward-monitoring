import Icon from '@/components/ui/Icon'
import { chipForLevel, MONITOR_CHIP, TOKENS } from '@/lib/data/tokens'

interface Props {
  label: string
  value: string
}

export default function MonitorRow({ label, value }: Props) {
  const { kind, label: chipLabel } = chipForLevel(value)
  const chip = MONITOR_CHIP[kind]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 13, color: TOKENS.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon name="activity" size={13} color={TOKENS.textMuted} />
        {label}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 800,
        background: chip.bg, border: `1px solid ${chip.border}`, color: chip.fg,
        padding: '2px 9px', borderRadius: 999,
      }}>
        {chipLabel}
      </span>
    </div>
  )
}
