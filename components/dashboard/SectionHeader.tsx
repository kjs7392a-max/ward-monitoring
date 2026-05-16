import Icon from '@/components/ui/Icon'
import { TOKENS } from '@/lib/data/tokens'

interface Props { icon: string; title: string; count: number }

export default function SectionHeader({ icon, title, count }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ width: 26, height: 26, borderRadius: 6, background: '#f1f3f5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} color={TOKENS.text} />
      </span>
      <span style={{ fontSize: 14, fontWeight: 800, color: TOKENS.text }}>{title}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: TOKENS.textMuted, background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>
        {count}개
      </span>
    </div>
  )
}
