import Icon from '@/components/ui/Icon'
import { TOKENS } from '@/lib/data/tokens'
import { MOCK_KPI } from '@/lib/data/mock'

export default function KpiRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
      {MOCK_KPI.map(kpi => (
        <div key={kpi.id} style={{
          background: '#fff', border: `1px solid ${TOKENS.border}`,
          borderRadius: 10, padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 6,
              background: kpi.tint,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={kpi.icon} size={14} color={TOKENS.text} />
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: TOKENS.textMuted }}>
              {kpi.label}
            </span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', fontFeatureSettings: '"tnum"', color: TOKENS.text }}>
            {kpi.value}
          </div>
        </div>
      ))}
    </div>
  )
}
