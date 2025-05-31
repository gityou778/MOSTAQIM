import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "مُسْتَقِيم - أداتك الإسلامية الذكية",
  description: "تطبيق إسلامي شامل يحتوي على مواعيد الصلاة، إدارة المهام، الأذكار، والمزيد",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
