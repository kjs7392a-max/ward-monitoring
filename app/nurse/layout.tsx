export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
    }}>
      {children}
    </div>
  )
}
