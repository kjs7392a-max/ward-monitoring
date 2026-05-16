'use client'
import { STATUS_META, KIND_META, TOKENS } from '@/lib/data/tokens'
import type { Space } from '@/types/ward'
import StatusChip from './StatusChip'
import MonitorRow from './MonitorRow'
import InfoLine from './InfoLine'
import AlertBanner from './AlertBanner'
import Icon from '@/components/ui/Icon'

interface Props {
  space: Space
  onOpenDetail: (space: Space) => void
  onOpenCCTV: (space: Space) => void
}

export default function SpaceCard({ space, onOpenDetail, onOpenCCTV }: Props) {
  const statusMeta = STATUS_META[space.status]
  const kindMeta = KIND_META[space.kind as keyof typeof KIND_META]
  const cardBg = space.cardOverride?.bg ?? statusMeta.cardBg
  const cardBd = space.cardOverride?.bd ?? statusMeta.cardBd
  const wardNum = space.ward.replace('W', '')
  const isToilet = space.kind === 'toilet'
  const isRestraint = space.kind === 'seclusion_restraint'

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBd}`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 320,
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minHeight: 40, gap: 8 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: TOKENS.text }}>
            {space.title}
          </div>
          <div style={{ fontSize: 11, color: '#2b578f', marginTop: 2 }}>
            {space.id} · {wardNum}병동
          </div>
        </div>
        <StatusChip status={space.status} />
      </div>

      {/* 기본 정보 */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {isToilet && (
          <div style={{ background: '#f1f5fa', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: TOKENS.textMuted }}>
            공용 공간 · 사용자 식별 안 됨
          </div>
        )}
        {space.patientId && <InfoLine icon="person" label="환자" value={space.patientId} />}
        {space.nurse && <InfoLine icon="id" label="담당 간호사" value={space.nurse} />}
        {space.admittedAt && <InfoLine icon="clock" label="입실 시각" value={space.admittedAt} />}
        {isRestraint && space.restraintStartedAt && (
          <InfoLine icon="warn" label="강박 시작" value={space.restraintStartedAt} valueColor={TOKENS.danger} />
        )}
        {isToilet && space.startedAt && <InfoLine icon="clock" label="사용 시작" value={space.startedAt} />}
        {isToilet && space.duration && <InfoLine icon="activity" label="경과 시간" value={space.duration} />}
        {isToilet && space.todayUses !== undefined && (
          <InfoLine icon="users" label="오늘 사용" value={`${space.todayUses}회`} />
        )}
      </div>

      {/* 화장실 낙상 안전도 */}
      {isToilet && space.fallSafety && (
        <div style={{
          marginTop: 12,
          background: '#e1ecf5', border: '1px solid #a8c1d8', borderRadius: 8,
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: '#a8c1d8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="falling" size={16} color="#163e6b" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: TOKENS.textMuted }}>낙상 안전도</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#163e6b' }}>{space.fallSafety.status}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: TOKENS.textMuted }}>오늘 발생</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: TOKENS.text }}>{space.fallSafety.todayIncidents}건</div>
          </div>
        </div>
      )}

      {/* 모니터 항목 */}
      {space.monitors && Object.keys(space.monitors).length > 0 && (
        <div style={{ marginTop: 12, borderTop: `1px dashed ${TOKENS.border}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {kindMeta && Object.entries(space.monitors).map(([key, value]) => {
            const label = kindMeta.monitorLabels[key as keyof typeof kindMeta.monitorLabels] ?? key
            return <MonitorRow key={key} label={label} value={value as string} />
          })}
        </div>
      )}

      {/* 활성 경고 배너 */}
      {space.alerts && space.alerts.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {space.alerts.map((alert, i) => <AlertBanner key={i} alert={alert} />)}
        </div>
      )}

      {/* 푸터 */}
      <div style={{ marginTop: 'auto', paddingTop: 10 }}>
        <div style={{ fontSize: 11, color: TOKENS.textSubtle, marginBottom: 8 }}>
          마지막 업데이트: {space.lastUpdate}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onOpenDetail(space)}
            style={{
              flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600,
              background: '#fff', border: `1px solid ${TOKENS.borderStrong}`,
              borderRadius: 6, cursor: 'pointer', color: TOKENS.text,
              fontFamily: 'inherit',
            }}
          >
            상세보기
          </button>
          <button
            onClick={() => onOpenCCTV(space)}
            style={{
              flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600,
              background: '#fff', border: `1px solid ${TOKENS.borderStrong}`,
              borderRadius: 6, cursor: 'pointer', color: TOKENS.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              fontFamily: 'inherit',
            }}
          >
            <Icon name="eye" size={12} />
            CCTV
          </button>
        </div>
      </div>
    </div>
  )
}
