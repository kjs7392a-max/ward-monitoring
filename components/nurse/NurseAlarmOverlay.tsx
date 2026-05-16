'use client'
import { useEffect, useState } from 'react'
import { TOKENS } from '@/lib/data/tokens'

interface AlarmInfo {
  spaceTitle: string
  category: string
  detail?: string
}

interface Props {
  alarm: AlarmInfo | null
  onAck: () => void
}

export default function NurseAlarmOverlay({ alarm, onAck }: Props) {
  const [visible, setVisible] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    if (alarm) {
      setVisible(true)
      setBlink(true)
      // 깜빡임 효과
      const interval = setInterval(() => setBlink(b => !b), 600)
      return () => clearInterval(interval)
    } else {
      setVisible(false)
    }
  }, [alarm])

  if (!visible || !alarm) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: blink ? 'rgba(180,0,0,0.92)' : 'rgba(120,0,0,0.92)',
      transition: 'background 0.3s',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '40px 28px', width: '100%', maxWidth: 380,
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
        {/* 아이콘 */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: blink ? '#ef4444' : '#b91c1c',
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          transition: 'background 0.3s',
        }}>
          🚨
        </div>

        <div style={{
          fontSize: 13, fontWeight: 700, color: '#ef4444',
          letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase',
        }}>
          긴급 알람
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, color: TOKENS.text, margin: '0 0 8px' }}>
          {alarm.spaceTitle}
        </h1>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#b91c1c', margin: '0 0 16px' }}>
          {alarm.category}
        </h2>

        {alarm.detail && (
          <p style={{ fontSize: 14, color: TOKENS.textMuted, margin: '0 0 28px', lineHeight: 1.6 }}>
            {alarm.detail}
          </p>
        )}

        <button
          onClick={onAck}
          style={{
            width: '100%', padding: '16px 0',
            background: '#1a2740', color: '#fff',
            border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          확인했습니다
        </button>
      </div>
    </div>
  )
}
