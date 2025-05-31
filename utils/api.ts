import { getCSRFToken } from "./sanitize"

/**
 * دالة مساعدة لإجراء طلبات API آمنة
 */
export async function fetchWithSecurity<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    // إضافة CSRF توكن
    const csrfToken = getCSRFToken()
    const headers = {
      ...options.headers,
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    }

    // إجراء الطلب
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "same-origin", // إرسال الكوكيز مع الطلب
    })

    // التحقق من نجاح الطلب
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    // تحليل الاستجابة
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

/**
 * دالة لجلب مواعيد الصلاة
 */
export async function fetchPrayerTimesAPI(city: string): Promise<any> {
  // التحقق من صحة المدينة
  if (!/^[a-zA-Z\u0600-\u06FF\s]{1,50}$/.test(city)) {
    throw new Error("اسم المدينة غير صالح")
  }

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Egypt&method=5`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching prayer times:", error)
    throw error
  }
}

/**
 * دالة لجلب نص السورة
 */
export async function fetchSurahAPI(surahNumber: number): Promise<any> {
  // التحقق من صحة رقم السورة
  if (surahNumber < 1 || surahNumber > 114 || !Number.isInteger(surahNumber)) {
    throw new Error("رقم السورة غير صالح")
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching surah:", error)
    throw error
  }
}
