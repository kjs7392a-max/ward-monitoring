export const TOKENS = {
  bgPage:        '#e8eef5',
  bgCard:        '#ffffff',
  bgMuted:       '#f1f5fa',
  bgEmpty:       '#eef2f7',
  bgWarn:        '#cfdef0',
  bgDanger:      '#f3e6e6',
  bgInfo:        '#dde8f3',
  border:        '#cdd6e0',
  borderStrong:  '#b6c0cd',
  borderWarn:    '#6a8aae',
  borderDanger:  '#c08a8a',
  borderInfo:    '#9eb3c9',
  text:          '#1a2740',
  textMuted:     '#516175',
  textSubtle:    '#7d8a9b',
  warn:          '#1f5fa8',
  danger:        '#8a2424',
  info:          '#2e5a91',
  ok:            '#2e6b8c',
} as const

export type TokenKey = keyof typeof TOKENS

export const STATUS_META = {
  empty:    { label: '비어 있음', chipBg: '#dde4ec', chipFg: '#516175', cardBg: TOKENS.bgEmpty,  cardBd: TOKENS.border },
  occupied: { label: '점유 중',   chipBg: '#cfdcec', chipFg: '#1f4778', cardBg: TOKENS.bgInfo,   cardBd: TOKENS.borderInfo },
  inuse:    { label: '사용 중',   chipBg: '#cfdcec', chipFg: '#1f4778', cardBg: TOKENS.bgInfo,   cardBd: TOKENS.borderInfo },
  warn:     { label: '주의',     chipBg: '#bccddf', chipFg: '#163e6b', cardBg: TOKENS.bgWarn,   cardBd: TOKENS.borderWarn },
  danger:   { label: '위험',     chipBg: '#dcb5b5', chipFg: '#6e1c1c', cardBg: TOKENS.bgDanger, cardBd: TOKENS.borderDanger },
  maint:    { label: '점검 중',   chipBg: '#dde4ec', chipFg: '#3a4858', cardBg: '#f1f4f7',       cardBd: TOKENS.border },
} as const

export const KIND_META = {
  seclusion_restraint: {
    section: '강박격리실',
    icon: 'shield',
    monitorLabels: { hr: '순환상태', rr: '호흡상태' },
  },
  seclusion: {
    section: '일반격리실',
    icon: 'door',
    monitorLabels: { fall: '낙상', motion: '움직임' },
  },
  toilet: {
    section: '화장실',
    icon: 'door',
    monitorLabels: { fall: '낙상' },
  },
} as const

export function chipForLevel(v: string): { kind: 'danger' | 'warn' | 'ok'; label: string } {
  if (v === '위험') return { kind: 'danger', label: '위험' }
  if (v === '주의') return { kind: 'warn',   label: '주의' }
  if (v === '감지') return { kind: 'danger', label: '감지' }
  if (v === '있음') return { kind: 'warn',   label: '있음' }
  if (v === '없음') return { kind: 'ok',     label: '없음' }
  return { kind: 'ok', label: v || '안정' }
}

export const MONITOR_CHIP = {
  danger: { bg: '#eddada', border: '#c79e9e', fg: '#8a2424' },
  warn:   { bg: '#dbe7f4', border: '#92acc7', fg: '#1f5fa8' },
  ok:     { bg: '#e1ecf5', border: '#a8c1d8', fg: '#2e6b8c' },
} as const
