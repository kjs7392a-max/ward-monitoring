'use client'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/nurse/LoginForm'

export default function NursePage() {
  const router = useRouter()

  const handleSuccess = (_uid: string, _email: string) => {
    router.push('/nurse/station')
  }

  return <LoginForm onSuccess={handleSuccess} />
}
