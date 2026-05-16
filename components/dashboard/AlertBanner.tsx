import Icon from '@/components/ui/Icon'
import type { SpaceAlert } from '@/types/ward'

interface Props { alert: SpaceAlert }

const STYLES = {
  warn:   { bg: '#dbe7f4', border: '#92acc7', fg: '#1f5fa8' },
  danger: { bg: '#eddada', border: '#c79e9e', fg: '#8a2424' },
}

export default function AlertBanner({ alert }: Props) {
  const s = STYLES[alert.kind]
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.fg,
      borderRadius: 6, padding: '7px 10px',
      display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
    }}>
      <Icon name="warn" size={13} color={s.fg} />
      <span>{alert.label}</span>
      {alert.detail && <span style={{ fontWeight: 400 }}>— {alert.detail}</span>}
    </div>
  )
}
