'use client'
import { useState } from 'react'
import { TOKENS } from '@/lib/data/tokens'
import { MOCK_SPACES } from '@/lib/data/mock'

interface Props {
  nurseId: string
  nurseName: string
  nurseEmail: string
}

export default function StationPicker({ nurseId, nurseName, nurseEmail }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [error, setError] = useState('')

  const handleAssign = async (spaceId: string, spaceTitle: string) => {
    setLoading(true)
    setError('')
    let fcmToken: string | null = null

    try {
      // 1. FCM 권한 요청 및 토큰 획득 (선택적 — 실패해도 담당 등록은 진행)
      try {
        const { getMessagingInstance } = await import('@/lib/firebase/client')
        const messaging = await getMessagingInstance()
        if (messaging) {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            const { getToken } = await import('firebase/messaging')
            const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
            fcmToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
              serviceWorkerRegistration: swReg,
            })
          }
        }
      } catch {
        // FCM 미지원 기기 — 담당 등록은 계속 진행
        console.warn('FCM 초기화 실패 — 푸시 알람 없이 담당 등록')
      }

      // 2. FCM 토큰이 있으면 서버에 저장
      if (fcmToken) {
        await fetch('/api/fcm/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nurseId, nurseName, nurseEmail, fcmToken }),
        })
      }

      // 3. 담당 스테이션 Firestore에 저장 (FCM 없어도 반드시 저장)
      const { db } = await import('@/lib/firebase/client')
      const { doc, setDoc } = await import('firebase/firestore')
      await setDoc(doc(db, 'assignments', spaceId), {
        nurseId,
        nurseName,
        nurseEmail,
        fcmToken: fcmToken ?? null,
        pushEnabled: !!fcmToken,
        assignedAt: new Date().toISOString(),
      })

      setSelected(spaceId)
      setDone(true)
      setPushEnabled(!!fcmToken)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '오류가 발생했습니다.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const { db } = await import('@/lib/firebase/client')
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'assignments', selected))
      setSelected(null)
      setDone(false)
    } catch {
      setError('담당 해제 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const selectedSpace = MOCK_SPACES.find(s => s.id === selected)

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TOKENS.text, margin: '0 0 4px' }}>근무 스테이션 선택</h2>
      <p style={{ fontSize: 13, color: TOKENS.textMuted, margin: '0 0 24px' }}>
        담당 스테이션을 선택하면 해당 공간의 알람이 내 폰으로 전송됩니다.
      </p>

      {done && selectedSpace && (
        <div style={{
          background: '#e1ecf5', border: '1px solid #a8c1d8', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16,
          color: '#163e6b', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>✅ {selectedSpace.title} 담당 등록 완료{!pushEnabled ? ' (푸시 미지원 기기)' : ''}</span>
          <button
            onClick={handleUnassign}
            style={{ fontSize: 12, color: TOKENS.textMuted, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
          >
            담당 해제
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: '#eddada', border: '1px solid #c79e9e', borderRadius: 8,
          padding: '10px 14px', marginBottom: 16, color: '#8a2424', fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_SPACES.map(space => {
          const isActive = selected === space.id
          const wardNum = space.ward.replace('W', '')
          return (
            <button
              key={space.id}
              onClick={() => !isActive && !loading && handleAssign(space.id, space.title)}
              disabled={loading || isActive}
              style={{
                padding: '16px 18px', borderRadius: 10, textAlign: 'left',
                cursor: isActive || loading ? 'default' : 'pointer',
                background: isActive ? '#1a2740' : '#fff',
                border: `1px solid ${isActive ? '#1a2740' : TOKENS.border}`,
                color: isActive ? '#fff' : TOKENS.text,
                opacity: loading && !isActive ? 0.6 : 1,
                fontFamily: 'inherit',
                width: '100%',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800 }}>{space.title}</div>
              <div style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.6)' : TOKENS.textMuted, marginTop: 2 }}>
                {space.id} · {wardNum}병동{isActive ? ' · 현재 담당 중' : ''}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
