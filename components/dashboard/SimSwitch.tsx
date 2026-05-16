'use client'
import { SIM_SCENARIOS } from '@/lib/data/mock'
import { TOKENS } from '@/lib/data/tokens'
import Icon from '@/components/ui/Icon'
import type { EmergencyScenario } from '@/types/ward'

interface Props { onTrigger: (scenario: EmergencyScenario) => void }

export default function SimSwitch({ onTrigger }: Props) {
  return (
    <div style={{
      position: 'fixed', right: 18, top: 18, zIndex: 500,
      background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 10,
      padding: '12px 14px', width: 240, boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.2)', display: 'inline-block' }} />
        <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>알람 시뮬레이션</span>
        <span style={{ fontSize: 10, fontWeight: 700, background: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: 4 }}>TEST</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {SIM_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onTrigger(s)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fff7f7', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#b91c1c', fontFamily: 'inherit' }}
          >
            <Icon name={s.icon} size={13} color="#ef4444" />
            {s.spaceTitle} {s.category}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: TOKENS.textSubtle }}>
        테스트 전용 · 운영 시 숨김 처리
      </div>
    </div>
  )
}
