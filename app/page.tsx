"use client"

import { useState, useEffect } from "react"
import TaskManager from "@/components/TaskManager"
import PrayerTimes from "@/components/PrayerTimes"
import Fasting from "@/components/Fasting"
import Habits from "@/components/Habits"
import Azkar from "@/components/Azkar"
import QuranReader from "@/components/QuranReader"
import Virtues from "@/components/Virtues"
import SaveNotification from "@/components/SaveNotification"
import AzkarReport from "@/components/AzkarReport"
import PrayerNotification from "@/components/PrayerNotification"
import ResponsiveLayout from "@/components/ResponsiveLayout"
import { cleanExpiredData } from "@/utils/crypto"

export default function Home() {
  const [activeTab, setActiveTab] = useState("virtues")
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string>>({})

  // تهيئة الأمان عند بدء التطبيق
  useEffect(() => {
    // تنظيف البيانات المنتهية الصلاحية
    cleanExpiredData()

    // إضافة مستمع للتحقق من التلاعب بالبيانات
    const storageListener = () => {
      try {
        // التحقق من معرف الجهاز
        const deviceId = localStorage.getItem("_device_id")
        if (!deviceId) {
          console.warn("Device ID missing, possible tampering detected")
        }
      } catch (error) {
        console.error("Storage security check failed:", error)
      }
    }

    window.addEventListener("storage", storageListener)
    return () => window.removeEventListener("storage", storageListener)
  }, [])

  // تحديث مواعيد الصلاة
  const updatePrayerTimes = (times: Record<string, string>) => {
    setPrayerTimes(times)
  }

  const tabs = [
    { id: "virtues", name: "📿 الفضائل", component: <Virtues /> },
    { id: "tasks", name: "📝 المهام", component: <TaskManager /> },
    { id: "habits", name: "🔄 العادات", component: <Habits /> },
    { id: "fasting", name: "🌙 الصيام", component: <Fasting /> },
    { id: "prayer", name: "🕋 الصلاة", component: <PrayerTimes onUpdateTimes={updatePrayerTimes} /> },
    { id: "azkar", name: "🌄 الأذكار", component: <Azkar showReport={true} /> },
    { id: "quran", name: "📖 القرآن", component: <QuranReader /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100" dir="rtl">
      <header className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-6 shadow-lg">
        <ResponsiveLayout>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">🕌 مُسْتَقِيم</h1>
            <p className="text-emerald-100">أداتك الإسلامية الذكية للحياة اليومية والإنتاجية</p>
          </div>
        </ResponsiveLayout>
      </header>

      <nav className="bg-white shadow-md sticky top-0 z-10">
        <ResponsiveLayout>
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-3 whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </ResponsiveLayout>
      </nav>

      <main className="relative">
        <ResponsiveLayout>
          {/* إشعارات الصلاة */}
          {Object.keys(prayerTimes).length > 0 && <PrayerNotification prayerTimes={prayerTimes} />}

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {tabs.find((tab) => tab.id === activeTab)?.component}

            {/* عرض تقرير الأذكار في صفحة الأذكار */}
            {activeTab === "azkar" && <AzkarReport />}
          </div>
        </ResponsiveLayout>
      </main>

      <footer className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-6 text-center mt-8">
        <ResponsiveLayout>
          <p className="text-emerald-100">© 2025 مُسْتَقِيم - Islamic Productivity Tool</p>
          <p className="text-sm text-emerald-200 mt-1">جعله الله في ميزان حسناتنا</p>
        </ResponsiveLayout>
      </footer>

      <SaveNotification />
    </div>
  )
}
