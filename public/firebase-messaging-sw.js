// firebase-messaging-sw.js

// ── 1. raw push 이벤트: 열려있는 앱에 직접 메시지 전달 (포그라운드 처리)
self.addEventListener('push', event => {
  let data = {}
  try { data = event.data?.json() ?? {} } catch { }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'WARD_ALARM',
          notification: data.notification,
          data: data.data,
        })
      })
    })
  )
})

// ── 2. Firebase 초기화 (백그라운드 알림 표시)
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

// 백그라운드 메시지 → 알림 표시
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification ?? {}
  self.registration.showNotification(title ?? '병동 알람', {
    body: body ?? '확인이 필요합니다.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'ward-alarm',
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300],
    data: payload.data,
  })
})

// ── 3. 알림 탭 → 앱 열기 (이미 열려있으면 포커스, 없으면 새 창)
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const spaceId = event.notification.data?.spaceId ?? ''
  const url = '/nurse/alarm?spaceId=' + spaceId

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clients) {
        if (client.url.includes('/nurse') && 'focus' in client) {
          client.focus()
          client.postMessage({ type: 'WARD_ALARM_TAP', spaceId })
          return
        }
      }
      // 없으면 새 창 열기
      return self.clients.openWindow(url)
    })
  )
})
