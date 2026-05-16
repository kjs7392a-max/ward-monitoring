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

      // 알람 소리 (Web Audio API로 삐 소리 반복)
      let audioCtx: AudioContext | null = null
      let stopped = false
      const playBeep = () => {
        if (stopped) return
        try {
          audioCtx = new AudioContext()
          const beep = (freq: number, start: number, dur: number) => {
            const osc = audioCtx!.createOscillator()
            const gain = audioCtx!.createGain()
            osc.connect(gain)
            gain.connect(audioCtx!.destination)
            osc.frequency.value = freq
            osc.type = 'sine'
            gain.gain.setValueAtTime(0.8, audioCtx!.currentTime + start)
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx!.currentTime + start + dur)
            osc.start(audioCtx!.currentTime + start)
            osc.stop(audioCtx!.currentTime + start + dur)
          }
          beep(880, 0, 0.2)
          beep(880, 0.3, 0.2)
          beep(880, 0.6, 0.4)
        } catch { /* 미지원 무시 */ }
      }
      playBeep()
      const soundInterval = setInterval(playBeep, 2000)

      // 깜빡임
      const blinkInterval = setInterval(() => setBlink(b => !b), 600)

      return () => {
        stopped = true
        clearInterval(soundInterval)
        clearInterval(blinkInterval)
        audioCtx?.close()
      }
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
