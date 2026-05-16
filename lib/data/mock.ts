import type { Space, KpiItem, WardEvent, TimelineEvent, EmergencyScenario } from '@/types/ward'

export const MOCK_KPI: KpiItem[] = [
  { id: 'total',  label: '총 모니터링 공간', value: 3, icon: 'building', tint: '#dde4ec' },
  { id: 'inuse',  label: '현재 사용 중',     value: 3, icon: 'users',    tint: '#cfdcec' },
  { id: 'warn',   label: '주의 발생',       value: 1, icon: 'warn',     tint: '#bccddf' },
  { id: 'danger', label: '위험 발생',       value: 1, icon: 'shield',   tint: '#dcb5b5' },
]

export const MOCK_SPACES: Space[] = [
  {
    id: 'R-S01',
    kind: 'seclusion_restraint',
    title: '강박격리실 1호',
    ward: 'W1',
    status: 'danger',
    patientId: '김OO',
    nurse: '박OO',
    admittedAt: '08:15',
    restraintStartedAt: '13:40',
    monitors: { hr: '위험', rr: '주의' },
    alerts: [{ kind: 'danger', label: '순환상태 위험', detail: '즉시 확인', since: '14:32' }],
    lastUpdate: '14:34',
    cardOverride: { bg: '#ffcfd9', bd: '#f5a0ad' },
  },
  {
    id: 'R-S11',
    kind: 'seclusion',
    title: '일반격리실 1호',
    ward: 'W2',
    status: 'warn',
    patientId: '이OO',
    nurse: '이OO',
    admittedAt: '09:32',
    monitors: { fall: '안정', motion: '주의' },
    alerts: [{ kind: 'warn', label: '움직임 이상', detail: '부동작 5분 경과', since: '14:29' }],
    lastUpdate: '14:34',
  },
  {
    id: 'R-T01',
    kind: 'toilet',
    title: '화장실 1호',
    ward: 'W3',
    status: 'inuse',
    startedAt: '14:31',
    duration: '3분',
    todayUses: 14,
    fallSafety: { status: '안정', todayIncidents: 0, lastIncident: '7일 전' },
    monitors: { fall: '안정' },
    lastUpdate: '14:34',
  },
]

export const MOCK_EVENT_LOG: WardEvent[] = [
  { time: '14:32', ward: '1병동', room: 'R-S01', kind: 'danger', label: '순환상태 위험 감지',  actor: null },
  { time: '14:20', ward: '1병동', room: 'R-S01', kind: 'info',   label: '활력징후 측정',       actor: null },
  { time: '13:40', ward: '1병동', room: 'R-S01', kind: 'warn',   label: '강박 시작',           actor: '박OO' },
  { time: '08:15', ward: '1병동', room: 'R-S01', kind: 'ok',     label: '강박격리실 입실',     actor: '박OO' },
  { time: '14:29', ward: '2병동', room: 'R-S11', kind: 'warn',   label: '부동작 5분 경과',     actor: null },
  { time: '14:24', ward: '2병동', room: 'R-S11', kind: 'info',   label: '움직임 감소',         actor: null },
  { time: '09:32', ward: '2병동', room: 'R-S11', kind: 'ok',     label: '일반격리실 입실',     actor: '이OO' },
  { time: '14:31', ward: '3병동', room: 'R-T01', kind: 'info',   label: '사용 시작',           actor: null },
  { time: '14:18', ward: '3병동', room: 'R-T01', kind: 'ok',     label: '사용 종료 · 4분',     actor: null },
]

export const MOCK_ROOM_TIMELINE: Record<string, TimelineEvent[]> = {
  'R-S01': [
    { time: '08:15', kind: 'ok',     label: '입실 (간호사 박OO)' },
    { time: '13:40', kind: 'warn',   label: '강박 시작' },
    { time: '14:20', kind: 'info',   label: '활력징후 측정' },
    { time: '14:32', kind: 'danger', label: '순환상태 위험 감지' },
  ],
  'R-S11': [
    { time: '09:32', kind: 'ok',     label: '입실 (간호사 이OO)' },
    { time: '14:24', kind: 'info',   label: '움직임 감소' },
    { time: '14:29', kind: 'warn',   label: '부동작 5분 경과' },
  ],
  'R-T01': [
    { time: '14:31', kind: 'ok',     label: '사용 시작' },
  ],
}

export const SIM_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'toilet_fall',
    spaceId: 'R-T01',
    spaceTitle: '화장실 1호',
    category: '낙상 감지',
    detail: '화장실에서 낙상이 감지되었습니다. 즉시 확인이 필요합니다.',
    actionLabel: '확인했습니다',
    icon: 'falling',
  },
  {
    id: 'restraint_emergency',
    spaceId: 'R-S01',
    spaceTitle: '강박격리실 1호',
    category: '비상 상황',
    detail: '강박격리실에서 비상 상황이 감지되었습니다. 즉시 확인이 필요합니다.',
    actionLabel: '확인했습니다',
    icon: 'heart',
  },
]
