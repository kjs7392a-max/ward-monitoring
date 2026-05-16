'use client'
import { useState } from 'react'
import { loginNurse } from '@/lib/firebase/auth'
import { TOKENS } from '@/lib/data/tokens'

interface Props {
  onSuccess: (uid: string, email: string) => void
}

export default function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await loginNurse(email, password)
      onSuccess(user.uid, user.email ?? email)
    } catch {
      setError('이메일 또는 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '32px 28px',
        width: '100%', maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: '#1a2740',
            margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>W</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: TOKENS.text, margin: 0 }}>병동 모니터링</h1>
          <p style={{ fontSize: 13, color: TOKENS.textMuted, margin: '4px 0 0' }}>간호사 로그인</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TOKENS.textMuted, display: 'block', marginBottom: 6 }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="nurse@hospital.com"
              style={{
                width: '100%', padding: '12px 14px',
                border: `1px solid ${TOKENS.border}`, borderRadius: 8,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TOKENS.textMuted, display: 'block', marginBottom: 6 }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px',
                border: `1px solid ${TOKENS.border}`, borderRadius: 8,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          {error && (
            <p style={{ fontSize: 12, color: TOKENS.danger, margin: 0 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8, padding: '14px 0',
              background: '#1a2740', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
