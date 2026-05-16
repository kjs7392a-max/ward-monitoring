import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '병동 모니터링 시스템',
  description: '강박격리실 · 일반격리실 · 화장실 통합 관리 대시보드',
}

export const viewport: Viewport = {
  themeColor: '#a9c4ec',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
