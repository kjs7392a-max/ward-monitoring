'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onNurseAuthChange } from '@/lib/firebase/auth'
import StationPicker from '@/components/nurse/StationPicker'
import NurseAlarmOverlay from '@/components/nurse/NurseAlarmOverlay'
import { TOKENS } from '@/lib/data/tokens'
import type { User } from 'firebase/auth'

interface AlarmInfo { spaceTitle: string; category: string; detail?: string }

export default function StationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [alarm, setAlarm] = useState<AlarmInfo | null>(null)
  const router = useRouter()

  // 포그라운드 FCM 메시지 수신
  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    import('@/lib/firebase/client').then(({ getMessagingInstance }) => {
      getMessagingInstance().then(messaging => {
        if (!messaging) return
        import('firebase/messaging').then(({ onMessage }) => {
          unsubscribe = onMessage(messaging, payload => {
            const n = payload.notification
            const d = payload.data
            setAlarm({
              spaceTitle: d?.spaceTitle ?? n?.title ?? '알람',
              category:   d?.category  ?? '',
              detail:     n?.body ?? '',
            })
          })
        })
      })
    })
    return () => { unsubscribe?.() }
  }, [])

  useEffect(() => {
    const unsub = onNurseAuthChange(u => {
      if (!u) {
        router.replace('/nurse')
        return
      }
      setUser(u)
      setChecking(false)
    })
    return unsub
  }, [router])

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: TOKENS.textMuted }}>
        확인 중...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* 상단 바 */}
      <div style={{
        background: '#fff',
        borderBottom: `1px solid ${TOKENS.border}`,
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: TOKENS.text }}>병동 모니터링</span>
        <span style={{ fontSize: 13, color: TOKENS.textMuted }}>{user?.email}</span>
      </div>

      <StationPicker
        nurseId={user!.uid}
        nurseName={user?.displayName ?? user?.email ?? ''}
        nurseEmail={user?.email ?? ''}
      />

      {/* 포그라운드 알람 전체화면 팝업 */}
      <NurseAlarmOverlay alarm={alarm} onAck={() => setAlarm(null)} />
    </div>
  )
}
