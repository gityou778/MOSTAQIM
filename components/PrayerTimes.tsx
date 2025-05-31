"use client"

import { useState, useEffect } from "react"

interface PrayerTimings {
  [key: string]: string
}

interface PrayerTimesProps {
  onUpdateTimes?: (times: Record<string, string>) => void
}

export default function PrayerTimes({ onUpdateTimes }: PrayerTimesProps) {
  const [city, setCity] = useState("Cairo")
  const [times, setTimes] = useState<PrayerTimings>({})
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchPrayerTimes = async (selectedCity: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Egypt&method=5`,
      )
      const data = await response.json()
      setTimes(data.data.timings)

      // تحديث مواعيد الصلاة في المكون الرئيسي
      if (onUpdateTimes) {
        onUpdateTimes(data.data.timings)
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrayerTimes(city)
  }, [city])

  const prayerNames: { [key: string]: string } = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  }

  const prayerIcons: { [key: string]: string } = {
    Fajr: "🌅",
    Sunrise: "☀️",
    Dhuhr: "🌞",
    Asr: "🌤️",
    Maghrib: "🌇",
    Isha: "🌙",
  }

  const cities = [
    { value: "Cairo", label: "القاهرة" },
    { value: "Alexandria", label: "الإسكندرية" },
    { value: "Arish", label: "العريش" },
    { value: "Aswan", label: "أسوان" },
    { value: "Luxor", label: "الأقصر" },
    { value: "Mansoura", label: "المنصورة" },
    { value: "Tanta", label: "طنطا" },
    { value: "Suez", label: "السويس" },
  ]

  return (
    <section>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🕋 مواعيد الصلاة</h2>
        <div className="text-lg font-mono bg-gray-100 inline-block px-4 py-2 rounded-lg">
          {currentTime.toLocaleTimeString("ar-EG")}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">اختر المدينة:</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border rounded-lg text-lg">
          {cities.map((cityOption) => (
            <option key={cityOption.value} value={cityOption.value}>
              {cityOption.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل مواعيد الصلاة...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(times)
            .filter(([name]) => prayerNames[name])
            .map(([name, time]) => (
              <div
                key={name}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{prayerIcons[name]}</div>
                  <div className="font-bold text-lg text-emerald-800">{prayerNames[name]}</div>
                  <div className="text-2xl font-mono font-bold text-emerald-600">{time}</div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">📍 المواعيد حسب توقيت {cities.find((c) => c.value === city)?.label}</p>
      </div>
    </section>
  )
}
