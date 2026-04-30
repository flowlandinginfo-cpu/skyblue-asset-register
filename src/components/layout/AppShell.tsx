'use client'

import { Sidebar } from './Sidebar'
import { ChatWidget } from '../chat/ChatWidget'

export function AppShell({ children }: { children: React.ReactNode }) {
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
