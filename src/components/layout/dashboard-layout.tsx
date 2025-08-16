import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="lg:px-10 lg:py-10">
        <main className="py-8">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">{children}</div>
        </main>
      </div>
    </div>
  )
}