import { STATUS_META } from '@/lib/data/tokens'
import type { SpaceStatus } from '@/types/ward'

interface Props { status: SpaceStatus }

export default function StatusChip({ status }: Props) {
  const meta = STATUS_META[status]
  return (
    <span style={{
      background: meta.chipBg,
      color: meta.chipFg,
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  )
}
