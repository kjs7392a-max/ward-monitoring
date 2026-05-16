export type SpaceKind =
  | 'seclusion_restraint'
  | 'seclusion'
  | 'toilet'
  | 'bath'
  | 'general_4'
  | 'general_6'

export type SpaceStatus =
  | 'empty'
  | 'occupied'
  | 'inuse'
  | 'warn'
  | 'danger'
  | 'maint'

export type AlertKind = 'warn' | 'danger'
export type EventKind = 'ok' | 'warn' | 'danger' | 'info'
export type MonitorLevel = '안정' | '주의' | '위험' | '감지' | '있음' | '없음'

export interface SpaceAlert {
  kind: AlertKind
  label: string
  detail?: string
  since?: string
}

export interface BedSummary {
  bed: number
  patientId: string | null
  state: '안정' | '무동작' | '격한 움직임' | '낙상' | '비어있음'
}

export interface FallSafety {
  status: '안정' | '주의' | '위험'
  todayIncidents: number
  lastIncident?: string
}

export interface SpaceMonitors {
  hr?: MonitorLevel
  rr?: MonitorLevel
  fall?: MonitorLevel
  motion?: MonitorLevel
  heavyMotion?: MonitorLevel
  noMotion?: MonitorLevel
}

export interface Space {
  id: string
  kind: SpaceKind
  title: string
  ward: string
  status: SpaceStatus
  patientId?: string
  nurse?: string
  admittedAt?: string
  restraintStartedAt?: string
  startedAt?: string
  duration?: string
  todayUses?: number
  fallSafety?: FallSafety
  monitors?: SpaceMonitors
  occupiedCount?: number
  beds?: number
  bedSummary?: BedSummary[]
  alerts?: SpaceAlert[]
  lastUpdate: string
  cardOverride?: { bg: string; bd: string }
}

export interface KpiItem {
  id: string
  label: string
  value: number
  icon: string
  tint: string
}

export interface WardEvent {
  time: string
  ward: string
  room: string
  kind: EventKind
  label: string
  actor?: string | null
}

export interface TimelineEvent {
  time: string
  kind: EventKind
  label: string
}

export interface KindMeta {
  section: string
  icon: string
  monitorLabels: Record<string, string>
}

export interface NurseAssignment {
  nurseId: string
  nurseName: string
  nurseEmail: string
  fcmToken: string
  assignedAt: string
}

export interface EmergencyScenario {
  id: string
  spaceId: string
  spaceTitle: string
  category: string
  detail: string
  actionLabel: string
  icon: string
}