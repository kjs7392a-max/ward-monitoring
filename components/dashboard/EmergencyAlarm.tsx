'use client'
import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import type { EmergencyScenario } from '@/types/ward'

interface Props {
  scenario: EmergencyScenario | null
  onAck: () => void
  onDismiss: () => void
}

export default function EmergencyAlarm({ scenario, onAck, onDismiss }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!scenario) { setElapsed(0); return }
    const interval = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [scenario])

  if (!scenario) return null

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(10,10,20,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'em-fade 0.2s ease' }}>
      <div style={{ width: 'min(640px, 100%)', background: '#1a2128', border: '2px solid #ef4444', borderRadius: 16, boxShadow: '0 0 0 6px rgba(239,68,68,0.18), 0 30px 80px rgba(0,0,0,0.55)', overflow: 'hidden' }}>
        {/* 헤더 - 깜빡임 (CSS animation class em-bar defined in globals) */}
        <div className="em-bar" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="warn" size={28} color="#fff" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>비상 알림 · EMERGENCY</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>지금 즉시 확인이 필요합니다</div>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 12px', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {mm}:{ss}
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 24, background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.5)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}>
            <Icon name={scenario.icon} size={56} color="#ef4444" />
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{scenario.spaceTitle}</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>{scenario.category}</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{scenario.detail}</div>
        </div>

        {/* 푸터 */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
          <button onClick={onDismiss} style={{ flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'inherit' }}>
            나중에 확인
          </button>
          <button onClick={onAck} style={{ flex: 2, padding: '12px 0', fontSize: 15, fontWeight: 800, background: '#ef4444', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(239,68,68,0.5)', fontFamily: 'inherit' }}>
            확인했습니다 · {scenario.actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
