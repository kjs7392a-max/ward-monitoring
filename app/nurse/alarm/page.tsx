'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { TOKENS } from '@/lib/data/tokens'
import { MOCK_SPACES } from '@/lib/data/mock'

function AlarmContent() {
  const params = useSearchParams()
  const spaceId = params.get('spaceId')
  const space = MOCK_SPACES.find(s => s.id === spaceId)

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', width: '100%', maxWidth: 400, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: TOKENS.text, margin: '0 0 8px' }}>알람 확인</h1>
        {space ? (
          <p style={{ fontSize: 15, color: TOKENS.textMuted, margin: 0 }}>
            {space.title}에서 알람이 발생했습니다.<br />즉시 확인해주세요.
          </p>
        ) : (
          <p style={{ fontSize: 15, color: TOKENS.textMuted, margin: 0 }}>
            알람이 발생했습니다. 즉시 확인해주세요.
          </p>
        )}
      </div>
    </div>
  )
}

export default function AlarmPage() {
  return (
    <Suspense>
      <AlarmContent />
    </Suspense>
  )
}
