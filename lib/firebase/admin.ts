import { App, initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getMessaging, Messaging } from 'firebase-admin/messaging'

let _app: App | null = null

function getAdminApp(): App {
  if (_app) return _app
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (!privateKey || privateKey === 'placeholder') {
    throw new Error('Firebase Admin private key not configured. Set FIREBASE_ADMIN_PRIVATE_KEY in environment variables.')
  }
  if (getApps().length) {
    _app = getApps()[0]
    return _app
  }
  // Vercel 환경변수에서 private key 파싱 — 따옴표 제거 + \n 변환
  const parsedKey = privateKey
    .replace(/^["']|["']$/g, '')   // 앞뒤 따옴표 제거
    .replace(/\\n/g, '\n')          // \n 문자열 → 실제 줄바꿈

  _app = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  parsedKey,
    }),
  })
  return _app
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}

export function getAdminMessaging(): Messaging {
  return getMessaging(getAdminApp())
}
