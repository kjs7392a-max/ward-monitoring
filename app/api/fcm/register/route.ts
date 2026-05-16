import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(req: NextRequest) {
  const { nurseId, nurseName, nurseEmail, fcmToken } = await req.json()

  if (!nurseId || !fcmToken) {
    return NextResponse.json(
      { error: 'nurseId and fcmToken required' },
      { status: 400 }
    )
  }

  await adminDb.collection('nurses').doc(nurseId).set(
    {
      nurseId,
      nurseName,
      nurseEmail,
      fcmToken,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  return NextResponse.json({ ok: true })
}
