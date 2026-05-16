// firebase-messaging-sw.js
// TODO: Replace REPLACE_WITH_ACTUAL_* values with real Firebase config before deployment
// Find values at: Firebase Console → Project kjs7392as → Project Settings → Your apps

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            'REPLACE_WITH_ACTUAL_API_KEY',
  authDomain:        'kjs7392as.firebaseapp.com',
  projectId:         'kjs7392as',
  storageBucket:     'kjs7392as.appspot.com',
  messagingSenderId: 'REPLACE_WITH_ACTUAL_SENDER_ID',
  appId:             'REPLACE_WITH_ACTUAL_APP_ID',
})

const messaging = firebase.messaging()

// 백그라운드 메시지 처리
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification ?? {}
  self.registration.showNotification(title ?? '병동 알람', {
    body: body ?? '확인이 필요합니다.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'ward-alarm',
    requireInteraction: true,
    data: payload.data,
  })
})

// 알람 클릭 시 앱 열기
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/nurse/alarm?spaceId=' + (event.notification.data?.spaceId ?? ''))
  )
})
