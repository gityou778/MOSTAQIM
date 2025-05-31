import type React from "react"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return <div className="max-w-6xl mx-auto p-4 sm:p-6">{children}</div>
}
