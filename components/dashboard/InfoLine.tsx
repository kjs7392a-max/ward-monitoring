import Icon from '@/components/ui/Icon'
import { TOKENS } from '@/lib/data/tokens'

interface Props {
  icon: string
  label: string
  value: string
  valueColor?: string
}

export default function InfoLine({ icon, label, value, valueColor }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <Icon name={icon} size={13} color={TOKENS.textMuted} />
      <span style={{ color: TOKENS.textMuted }}>{label}:</span>
      <span style={{ fontWeight: 700, color: valueColor || TOKENS.text }}>{value}</span>
    </div>
  )
}
