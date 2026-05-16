# 배포 가이드

## 1. GitHub 레포 연결 (완료)
```bash
gh repo create ward-monitoring --public --source=. --remote=origin --push
```

GitHub 레포: https://github.com/kjs7392a-max/ward-monitoring

## 2. Vercel 프로젝트 생성
1. https://vercel.com → Add New Project
2. GitHub 레포 선택: ward-monitoring
3. Framework: Next.js (자동 감지)

## 3. Vercel 환경변수 설정 (모두 필수)
Firebase 콘솔(console.firebase.google.com) → 프로젝트 kjs7392as에서 값 확인

### 클라이언트 환경변수 (NEXT_PUBLIC_*)
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = kjs7392as.firebaseapp.com
- NEXT_PUBLIC_FIREBASE_PROJECT_ID = kjs7392as
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = kjs7392as.appspot.com
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_VAPID_KEY
  → Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시징 → 웹 푸시 인증서 → 키 쌍 생성

### 서버 환경변수 (Firebase Admin)
- FIREBASE_ADMIN_PROJECT_ID = kjs7392as
- FIREBASE_ADMIN_CLIENT_EMAIL
- FIREBASE_ADMIN_PRIVATE_KEY
  → Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성 → JSON 파일에서 추출

## 4. firebase-messaging-sw.js 실제 값 교체
`public/firebase-messaging-sw.js` 파일에서 REPLACE_WITH_ACTUAL_* 부분을 실제 Firebase 값으로 교체:
```js
firebase.initializeApp({
  apiKey:            '실제_API_KEY',
  authDomain:        'kjs7392as.firebaseapp.com',
  projectId:         'kjs7392as',
  storageBucket:     'kjs7392as.appspot.com',
  messagingSenderId: '실제_SENDER_ID',
  appId:             '실제_APP_ID',
})
```

## 5. Firebase 승인 도메인 추가
Firebase 콘솔 → Authentication → Settings → 승인된 도메인 → Vercel 도메인 추가
(예: ward-monitoring.vercel.app)

## 6. Firebase Authentication 간호사 계정 생성
Firebase 콘솔 → Authentication → Users → Add User
- 이메일: 간호사 이메일
- 비밀번호: 임시 비밀번호 (간호사에게 전달)

## 7. 배포 후 최종 확인 체크리스트
- [ ] /dashboard 접속 → 카드 3개, KPI 4개 표시
- [ ] 상세보기 모달 열림/닫힘
- [ ] SimSwitch 버튼 표시
- [ ] /nurse 접속 → 로그인 폼
- [ ] 로그인 후 /nurse/station 이동
- [ ] 스테이션 선택 → 알람 권한 요청 팝업
- [ ] 권한 허용 후 등록 완료 메시지
- [ ] 대시보드 SimSwitch → 간호사 폰 푸시 수신
- [ ] iOS: 홈 화면에 추가 후 PWA로 열림
- [ ] Android: 홈 화면에 추가 후 PWA로 열림

## 접속 URL
- 대시보드: https://ward-monitoring.vercel.app/dashboard
- 간호사 앱: https://ward-monitoring.vercel.app/nurse
