import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect root path to dashboard
  redirect('/dashboard')
}