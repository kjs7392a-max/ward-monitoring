import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './client'

export async function loginNurse(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logoutNurse(): Promise<void> {
  await signOut(auth)
}

export function onNurseAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
