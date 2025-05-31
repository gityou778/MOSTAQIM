"use client"

import { useState, useEffect } from "react"

interface PrayerTime {
  name: string
  time: string
  arabicName: string
  icon: string
}

export default function PrayerNotification({ prayerTimes }: { prayerTimes: Record<string, string> }) {
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  // تحويل مواعيد الصلاة إلى كائنات
  useEffect(() => {
    if (!prayerTimes || Object.keys(prayerTimes).length === 0) return

    const prayers: PrayerTime[] = [
      { name: "Fajr", time: prayerTimes.Fajr, arabicName: "الفجر", icon: "🌅" },
      { name: "Dhuhr", time: prayerTimes.Dhuhr, arabicName: "الظهر", icon: "🌞" },
      { name: "Asr", time: prayerTimes.Asr, arabicName: "العصر", icon: "🌤️" },
      { name: "Maghrib", time: prayerTimes.Maghrib, arabicName: "المغرب", icon: "🌇" },
      { name: "Isha", time: prayerTimes.Isha, arabicName: "العشاء", icon: "🌙" },
    ]

    // تحديد الصلاة التالية
    updateNextPrayer(prayers)

    // تحديث كل دقيقة
    const interval = setInterval(() => {
      updateNextPrayer(prayers)
    }, 60000)

    return () => clearInterval(interval)
  }, [prayerTimes])

  // تحديث الصلاة التالية والوقت المتبقي
  function updateNextPrayer(prayers: PrayerTime[]) {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    // تحويل أوقات الصلاة إلى دقائق
    const prayerMinutes = prayers.map((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      return {
        ...prayer,
        minutes: hours * 60 + minutes,
      }
    })

    // ترتيب الصلوات حسب الوقت
    prayerMinutes.sort((a, b) => a.minutes - b.minutes)

    // البحث عن الصلاة التالية
    let next = prayerMinutes.find((prayer) => prayer.minutes > currentTime)

    // إذا لم توجد صلاة تالية، فالصلاة التالية هي أول صلاة في اليوم التالي
    if (!next) {
      next = prayerMinutes[0]
      // حساب الوقت المتبقي حتى الصلاة التالية (في اليوم التالي)
      const minutesRemaining = 24 * 60 - currentTime + next.minutes
      setTimeRemaining(formatTimeRemaining(minutesRemaining))
    } else {
      // حساب الوقت المتبقي حتى الصلاة التالية
      const minutesRemaining = next.minutes - currentTime
      setTimeRemaining(formatTimeRemaining(minutesRemaining))
    }

    setNextPrayer(next)

    // التحقق من وقت الإشعار
    checkNotificationTime(next)
  }

  // تنسيق الوقت المتبقي
  function formatTimeRemaining(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours} ساعة و ${mins} دقيقة`
    } else {
      return `${mins} دقيقة`
    }
  }

  // التحقق من وقت الإشعار
  function checkNotificationTime(prayer: PrayerTime) {
    if (!notificationsEnabled || !prayer) return

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [hours, minutes] = prayer.time.split(":").map(Number)
    const prayerTime = hours * 60 + minutes

    // إرسال إشعار قبل 10 دقائق من وقت الصلاة
    if (prayerTime - currentTime === 10) {
      sendNotification(
        `حان وقت الاستعداد لصلاة ${prayer.arabicName}`,
        `سيدخل وقت صلاة ${prayer.arabicName} بعد 10 دقائق`,
      )
    }

    // إرسال إشعار عند دخول وقت الصلاة
    if (prayerTime === currentTime) {
      sendNotification(`حان وقت صلاة ${prayer.arabicName}`, `حان الآن وقت صلاة ${prayer.arabicName}، حي على الصلاة`)
    }
  }

  // إرسال إشعار
  function sendNotification(title: string, body: string) {
    if (!("Notification" in window)) return

    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body, icon: "/favicon.ico" })
        }
      })
    }
  }

  // طلب إذن الإشعارات
  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      alert("متصفحك لا يدعم الإشعارات")
      return
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setNotificationsEnabled(true)
        localStorage.setItem("prayer-notifications", "enabled")
        sendNotification("تم تفعيل إشعارات الصلاة", "سيتم إشعارك قبل دخول وقت الصلاة بـ 10 دقائق وعند دخول وقتها")
      } else {
        setNotificationsEnabled(false)
        localStorage.setItem("prayer-notifications", "disabled")
      }
    })
  }

  // تحميل إعدادات الإشعارات
  useEffect(() => {
    const notificationSetting = localStorage.getItem("prayer-notifications")
    setNotificationsEnabled(notificationSetting === "enabled")
  }, [])

  if (!nextPrayer) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-blue-800">⏰ الصلاة القادمة</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl mr-2">{nextPrayer.icon}</span>
            <div>
              <p className="font-bold text-lg text-blue-700">{nextPrayer.arabicName}</p>
              <p className="text-blue-600">{nextPrayer.time}</p>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-1">متبقي: {timeRemaining}</p>
        </div>

        <div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full"
            title="إعدادات الإشعارات"
          >
            {notificationsEnabled ? "🔔" : "🔕"}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">إعدادات الإشعارات</h4>
          <div className="flex items-center">
            <button
              onClick={requestNotificationPermission}
              className={`px-4 py-2 rounded-lg font-medium ${
                notificationsEnabled ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {notificationsEnabled ? "✅ الإشعارات مفعلة" : "تفعيل الإشعارات"}
            </button>
            <p className="mr-3 text-sm text-gray-600">
              {notificationsEnabled
                ? "سيتم إشعارك قبل الصلاة بـ 10 دقائق وعند دخول وقتها"
                : "فعّل الإشعارات لتذكيرك بأوقات الصلاة"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
