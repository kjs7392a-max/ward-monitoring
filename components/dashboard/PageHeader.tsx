import { TOKENS } from '@/lib/data/tokens'

export default function PageHeader() {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: TOKENS.text, margin: 0 }}>
        병동 모니터링 시스템
      </h1>
      <p style={{ fontSize: 13, color: TOKENS.textMuted, margin: '4px 0 0' }}>
        강박격리실 · 일반격리실 · 화장실 통합 관리 대시보드
      </p>
    </div>
  )
}
