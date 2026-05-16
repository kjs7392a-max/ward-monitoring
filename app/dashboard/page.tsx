'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/client'
import { collection, onSnapshot } from 'firebase/firestore'
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
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'assignments'),
      (snapshot) => {
        const data: Record<string, string> = {}
        snapshot.docs.forEach(doc => {
          const d = doc.data()
          data[doc.id] = d.nurseName ?? d.nurseEmail ?? '담당 간호사'
        })
        setAssignments(data)
      },
      (error) => {
        console.error('담당 조회 실패:', error)
      }
    )
    return unsubscribe
  }, [])

  const handleTriggerAlarm = async (scenario: EmergencyScenario) => {
    // 1. 풀스크린 알람 표시
    setAlarm(scenario)

    // 2. 담당 간호사 폰에 FCM 푸시 전송
    try {
      await fetch('/api/alarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId:    scenario.spaceId,
          spaceTitle: scenario.spaceTitle,
          category:   scenario.category,
          detail:     scenario.detail,
        }),
      })
    } catch (err) {
      console.error('FCM 전송 실패:', err)
      // 알람 UI는 이미 표시됐으므로 푸시 실패해도 계속 진행
    }
  }

  const spacesWithAssignments = MOCK_SPACES.map(s => ({
    ...s,
    nurse: assignments[s.id] !== undefined ? assignments[s.id] : s.nurse,
  }))

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
        <SectionHeader icon="building" title="3병동 · 전체 공간" count={spacesWithAssignments.length} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${spacesWithAssignments.length}, minmax(0, 1fr))`,
          gap: 14,
        }}>
          {spacesWithAssignments.map(space => (
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
