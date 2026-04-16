import { redirect } from 'next/navigation'

// Redirect root to asset list
export default function HomePage() {
  redirect('/assets')
}
