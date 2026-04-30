'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { ChatWidget } from '../chat/ChatWidget'

const AUTH_PATHS = ['/login', '/signup', '/pending']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p))

  // Auth pages: no sidebar, no chat widget
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content with sidebar offset */}
      <div className="flex-1 ml-[240px] transition-all duration-300">
        {children}
      </div>
      <ChatWidget />
    </div>
  )
}
