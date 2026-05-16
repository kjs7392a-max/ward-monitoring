'use client'
import { TOKENS, KIND_META, chipForLevel, MONITOR_CHIP } from '@/lib/data/tokens'
import { MOCK_ROOM_TIMELINE } from '@/lib/data/mock'
import type { Space } from '@/types/ward'
import Icon from '@/components/ui/Icon'
import StatusChip from './StatusChip'

interface Props { room: Space | null; onClose: () => void }

const EVENT_COLORS = {
  ok:     { bg: '#e1ecf5', border: '#a8c1d8', fg: '#2e6b8c' },
  warn:   { bg: '#dbe7f4', border: '#92acc7', fg: '#163e6b' },
  danger: { bg: '#eddada', border: '#c79e9e', fg: '#6e1c1c' },
  info:   { bg: '#dde8f3', border: '#9eb3c9', fg: '#1f4778' },
}

export default function RoomDetailModal({ room, onClose }: Props) {
  if (!room) return null
  const kindMeta = KIND_META[room.kind as keyof typeof KIND_META]
  const timeline = MOCK_ROOM_TIMELINE[room.id] ?? [{ time: '방금', kind: 'ok' as const, label: '센서 정상 갱신' }]
  const wardNum = room.ward.replace('W', '')

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
      >
        {/* 헤더 */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${TOKENS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text }}>
              {kindMeta?.section ?? room.title} 상세 정보
            </span>
            <StatusChip status={room.status} />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontFamily: 'inherit' }}>
            <Icon name="x" size={18} color={TOKENS.textMuted} />
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 공간/환자 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: TOKENS.textMuted, marginBottom: 4 }}>공간 정보</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{room.title}</div>
              <div style={{ fontSize: 12, color: TOKENS.textMuted }}>{room.id} · {wardNum}병동</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: TOKENS.textMuted, marginBottom: 4 }}>환자 정보</div>
              {room.patientId
                ? <div style={{ fontWeight: 800, fontSize: 14 }}>{room.patientId}</div>
                : <div style={{ fontSize: 12, color: TOKENS.textMuted }}>공용 공간 · 사용자 식별 안 됨</div>
              }
            </div>
          </div>

          {/* 모니터링 항목 */}
          {room.monitors && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TOKENS.textMuted, marginBottom: 8 }}>모니터링 항목</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(room.monitors).map(([key, value]) => {
                  const label = kindMeta?.monitorLabels[key as keyof typeof kindMeta.monitorLabels] ?? key
                  const { kind } = chipForLevel(value as string)
                  const chip = MONITOR_CHIP[kind]
                  return (
                    <div key={key} style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: TOKENS.text }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, background: chip.bg, border: `1px solid ${chip.border}`, color: chip.fg, padding: '2px 9px', borderRadius: 999 }}>
                        {value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 이벤트 로그 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: TOKENS.textMuted, marginBottom: 8 }}>이벤트 로그</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {timeline.map((ev, i) => {
                const c = EVENT_COLORS[ev.kind]
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, background: c.bg, border: `1px solid ${c.border}`, color: c.fg, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      {ev.time}
                    </span>
                    <span style={{ fontSize: 13, color: TOKENS.text }}>{ev.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${TOKENS.border}`, display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600, background: '#fff', border: `1px solid ${TOKENS.borderStrong}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon name="check" size={14} />간호사 확인
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600, background: '#fff', border: `1px solid ${TOKENS.borderStrong}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon name="eye" size={14} />CCTV 보기
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600, background: '#fff', border: `1px solid ${TOKENS.borderStrong}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
            <Icon name="logout" size={14} />퇴실 처리
          </button>
        </div>
      </div>
    </div>
  )
}
