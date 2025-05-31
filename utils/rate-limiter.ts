/**
 * نظام تقييد معدل الطلبات
 */

interface RateLimitInfo {
  count: number
  timestamp: number
  blocked: boolean
  blockExpiry?: number
}

// تخزين معلومات التقييد
const rateLimitStore: Record<string, Record<string, RateLimitInfo>> = {}

// إعدادات التقييد
const RATE_LIMITS = {
  general: { points: 10, duration: 60, blockDuration: 300 },
  chat: { points: 5, duration: 60, blockDuration: 600 },
  task: { points: 20, duration: 60, blockDuration: 180 },
}

/**
 * التحقق من تجاوز معدل الطلبات
 * @param key مفتاح التعريف (مثل IP أو معرف المستخدم)
 * @param type نوع الطلب
 * @returns هل تم تجاوز الحد أم لا
 */
export function checkRateLimit(key: string, type: "general" | "chat" | "task" = "general"): boolean {
  // إنشاء مخزن للنوع إذا لم يكن موجوداً
  if (!rateLimitStore[type]) {
    rateLimitStore[type] = {}
  }

  const now = Date.now()
  const store = rateLimitStore[type]
  const limits = RATE_LIMITS[type]

  // إنشاء سجل جديد إذا لم يكن موجوداً
  if (!store[key]) {
    store[key] = { count: 1, timestamp: now, blocked: false }
    return true
  }

  const record = store[key]

  // التحقق من انتهاء فترة الحظر
  if (record.blocked) {
    if (record.blockExpiry && now >= record.blockExpiry) {
      // إعادة تعيين السجل بعد انتهاء فترة الحظر
      record.blocked = false
      record.count = 1
      record.timestamp = now
      return true
    }
    return false
  }

  // التحقق من انتهاء فترة التقييد
  if (now - record.timestamp > limits.duration * 1000) {
    // إعادة تعيين العداد
    record.count = 1
    record.timestamp = now
    return true
  }

  // زيادة العداد والتحقق من تجاوز الحد
  record.count++
  if (record.count > limits.points) {
    // تفعيل الحظر
    record.blocked = true
    record.blockExpiry = now + limits.blockDuration * 1000
    return false
  }

  return true
}

/**
 * الحصول على معلومات التقييد
 */
export function getRateLimitInfo(key: string, type: "general" | "chat" | "task" = "general"): RateLimitInfo | null {
  if (!rateLimitStore[type]) return null
  return rateLimitStore[type][key] || null
}

/**
 * إعادة تعيين معلومات التقييد
 */
export function resetRateLimit(key: string, type: "general" | "chat" | "task" = "general"): void {
  if (rateLimitStore[type]) {
    delete rateLimitStore[type][key]
  }
}
