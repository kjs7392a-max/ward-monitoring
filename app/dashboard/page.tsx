'use client'
import { useState } from 'react'
import { MOCK_SPACES, SIM_SCENARIOS } from '@/lib/data/mock'
import { TOKENS } from '@/lib/data/tokens'
import type { Space, EmergencyScenario } from '@/types/ward'
import PageHeader from '@/components/dashboard/PageHeader'
import KpiRow from '@/components/dashboard/KpiRow'
import SectionHeader from '@/components/dashboard/SectionHeader'
import SpaceCard from '@/components/dashboard/SpaceCard'
import RoomDetailModal from '@/components/dashboard/RoomDetailModal'
import EmergencyAlarm from '@/components/dashboard/EmergencyAlarm'
import SimSwitch from '@/components/dashboard/SimSwitch'

export default function DashboardPage() {
  const [detailRoom, setDetailRoom] = useState<Space | null>(null)
  const [alarm, setAlarm] = useState<EmergencyScenario | null>(null)

  const handleTriggerAlarm = async (scenario: EmergencyScenario) => {
    setAlarm(scenario)
    // FCM push will be wired in Task 14
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px 28px',
      background: 'linear-gradient(180deg, #a9c4ec 0%, #c9dcf1 35%, #e1ecf7 70%, #eef4fb 100%)',
      backgroundAttachment: 'fixed',
      color: TOKENS.text,
    }}>
      <PageHeader />
      <KpiRow />

      {/* 병동 전체 공간 */}
      <div style={{
        background: '#fff',
        border: `1px solid ${TOKENS.border}`,
        borderRadius: 10,
        padding: '16px 18px',
      }}>
        <SectionHeader icon="building" title="3병동 · 전체 공간" count={MOCK_SPACES.length} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MOCK_SPACES.length}, minmax(0, 1fr))`,
          gap: 14,
        }}>
          {MOCK_SPACES.map(space => (
            <SpaceCard
              key={space.id}
              space={space}
              onOpenDetail={setDetailRoom}
              onOpenCCTV={() => {}}
            />
          ))}
        </div>
      </div>

      <RoomDetailModal room={detailRoom} onClose={() => setDetailRoom(null)} />
      <EmergencyAlarm
        scenario={alarm}
        onAck={() => setAlarm(null)}
        onDismiss={() => setAlarm(null)}
      />
      <SimSwitch onTrigger={handleTriggerAlarm} />
    </div>
  )
}
