"use client"

import { useState, useEffect } from "react"

export default function SaveNotification() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // عرض الإشعار عند تحميل الصفحة
    setShow(true)

    // إخفاء الإشعار بعد 5 ثوان
    const timer = setTimeout(() => {
      setShow(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <span className="text-xl">💾</span>
        <span>يتم حفظ بياناتك تلقائيًا في هذا الجهاز</span>
      </div>
    </div>
  )
}
