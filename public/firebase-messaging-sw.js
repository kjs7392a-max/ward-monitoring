// firebase-messaging-sw.js
// TODO: Replace REPLACE_WITH_ACTUAL_* values with real Firebase config before deployment
// Find values at: Firebase Console → Project kjs7392as → Project Settings → Your apps

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            'AIzaSyCNmqhB_-RbU0ZzeG5IW9SskKgp7PXF83s',
  authDomain:        'ward-monitoring-985d0.firebaseapp.com',
  projectId:         'ward-monitoring-985d0',
  storageBucket:     'ward-monitoring-985d0.firebasestorage.app',
  messagingSenderId: '679751013845',
  appId:             '1:679751013845:web:3560ab835659c0aac1595c',
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
