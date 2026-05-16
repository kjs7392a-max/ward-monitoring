import { NextRequest, NextResponse } from 'next/server'
import { sendAlarmToAssignedNurse, sendAlarmToAll } from '@/lib/fcm/send'

export async function POST(req: NextRequest) {
  const { spaceId, spaceTitle, category, detail } = await req.json()

  if (!spaceId || !category) {
    return NextResponse.json(
      { error: 'spaceId and category required' },
      { status: 400 }
    )
  }

  const result = await sendAlarmToAssignedNurse({
    spaceId,
    spaceTitle,
    category,
    detail,
  })

  if (!result.sent) {
    await sendAlarmToAll({ spaceId, spaceTitle, category, detail })
  }

  return NextResponse.json({ ok: true, ...result })
}
