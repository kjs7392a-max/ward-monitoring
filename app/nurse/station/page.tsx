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

  // 화면 꺼짐 방지 (근무 중 화면 유지)
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as Navigator & { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen')
        }
      } catch { /* 미지원 기기 무시 */ }
    }
    requestWakeLock()
    // 화면이 다시 활성화되면 재요청
    const handleVisibility = () => { if (document.visibilityState === 'visible') requestWakeLock() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      wakeLock?.release()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // 서비스워커로부터 알람 메시지 수신 (포그라운드 + 백그라운드 탭 모두 처리)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'WARD_ALARM') {
        setAlarm({
          spaceTitle: event.data.data?.spaceTitle ?? event.data.notification?.title ?? '병동 알람',
          category:   event.data.data?.category   ?? '',
          detail:     event.data.notification?.body ?? '',
        })
      }
      if (event.data?.type === 'WARD_ALARM_TAP') {
        setAlarm({
          spaceTitle: '병동 알람',
          category:   '확인 필요',
          detail:     '즉시 확인해주세요.',
        })
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)
    return () => navigator.serviceWorker.removeEventListener('message', handler)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>근무 중 · 화면 유지</span>
        </div>
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
