import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AiChat from '../components/AiChat'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function SocShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F19] text-slate-200">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <div className="min-h-0 flex-1 overflow-y-auto pb-24">
          <Outlet />
        </div>
      </div>
      <AiChat />
    </div>
  )
}

export default SocShell
