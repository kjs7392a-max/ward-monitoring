import { adminMessaging, adminDb } from '@/lib/firebase/admin'

interface SendAlarmOptions {
  spaceId: string
  spaceTitle: string
  category: string
  detail: string
}

/** 특정 공간의 담당 간호사에게 FCM 푸시 전송 */
export async function sendAlarmToAssignedNurse(
  opts: SendAlarmOptions
): Promise<{ sent: boolean; nurseId?: string }> {
  const assignmentDoc = await adminDb.collection('assignments').doc(opts.spaceId).get()
  if (!assignmentDoc.exists) return { sent: false }

  const assignment = assignmentDoc.data()!
  const fcmToken: string = assignment.fcmToken
  if (!fcmToken) return { sent: false }

  await adminMessaging.send({
    token: fcmToken,
    notification: {
      title: `⚠️ ${opts.spaceTitle} ${opts.category}`,
      body: opts.detail,
    },
    data: {
      spaceId:    opts.spaceId,
      spaceTitle: opts.spaceTitle,
      category:   opts.category,
    },
    android: {
      priority: 'high',
      notification: { channelId: 'ward-alarm', priority: 'max', defaultSound: true },
    },
    apns: {
      payload: { aps: { sound: 'default', badge: 1, contentAvailable: true } },
    },
    webpush: {
      headers: { Urgency: 'high' },
      notification: { requireInteraction: true },
    },
  })

  return { sent: true, nurseId: assignment.nurseId as string }
}

/** 전체 간호사에게 FCM 푸시 (담당 없을 때 fallback) */
export async function sendAlarmToAll(opts: SendAlarmOptions): Promise<void> {
  const snapshot = await adminDb.collection('nurses').get()
  const tokens = snapshot.docs
    .map(d => d.data().fcmToken as string)
    .filter(Boolean)
  if (tokens.length === 0) return

  await adminMessaging.sendEachForMulticast({
    tokens,
    notification: {
      title: `⚠️ ${opts.spaceTitle} ${opts.category}`,
      body: opts.detail,
    },
    data: { spaceId: opts.spaceId },
  })
}
