import CryptoJS from "crypto-js"

// إنشاء مفتاح تشفير آمن مشتق من معلومات المستخدم والمتصفح
function generateSecureKey(): string {
  // مفتاح أساسي قوي
  const BASE_KEY = "mustaqeem_secure_key_2025_v2"

  if (typeof window === "undefined") return BASE_KEY

  try {
    // الحصول على معرف فريد للمستخدم أو إنشاء واحد إذا لم يكن موجوداً
    let deviceId = localStorage.getItem("_device_id")
    if (!deviceId) {
      deviceId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("_device_id", deviceId)
    }

    // إضافة معلومات المتصفح للمفتاح
    const browserInfo = [
      navigator.userAgent.slice(0, 20),
      navigator.language,
      screen.colorDepth,
      screen.width + "x" + screen.height,
    ].join(":")

    // دمج المعلومات لإنشاء مفتاح فريد
    return `${BASE_KEY}_${deviceId}_${browserInfo}`
  } catch (error) {
    // في حالة الخطأ، استخدم المفتاح الأساسي
    console.warn("Could not generate secure key, using fallback")
    return BASE_KEY
  }
}

// الحصول على مفتاح التشفير
const ENCRYPTION_KEY = generateSecureKey()
const IV_LENGTH = 16 // For AES, this is always 16

// تشفير قوي باستخدام AES-256
function encryptData(data: string): string {
  try {
    // إضافة بيانات عشوائية للتشفير لمنع هجمات التحليل
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString()
    const timestamp = Date.now().toString()

    // دمج البيانات مع salt والتاريخ
    const dataToEncrypt = `${salt}|${timestamp}|${data}`

    // تشفير البيانات
    const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("فشل في تشفير البيانات")
  }
}

// فك التشفير
function decryptData(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)

    if (!decrypted) {
      throw new Error("فشل في فك التشفير")
    }

    // استخراج البيانات الأصلية من النص المفكوك
    const parts = decrypted.split("|")
    if (parts.length < 3) {
      throw new Error("بيانات تالفة")
    }

    // التحقق من عمر البيانات (اختياري)
    const timestamp = Number.parseInt(parts[1])
    const maxAgeMs = 30 * 24 * 60 * 60 * 1000 // 30 يوم
    if (Date.now() - timestamp > maxAgeMs) {
      throw new Error("البيانات منتهية الصلاحية")
    }

    // إرجاع البيانات الأصلية فقط (بدون salt والتاريخ)
    return parts.slice(2).join("|")
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("فشل في فك تشفير البيانات")
  }
}

// تنظيف البيانات من المحتوى الضار
function sanitizeData(data: any): any {
  if (typeof data === "string") {
    // إزالة جميع العلامات الخطيرة
    return data
      .replace(/[<>'"&\\/]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+=/gi, "")
      .substring(0, 1000) // حد أقصى للطول
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item))
  }

  if (typeof data === "object" && data !== null) {
    const sanitized: any = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[sanitizeData(key)] = sanitizeData(data[key])
      }
    }
    return sanitized
  }

  return data
}

// التحقق من صحة البيانات
function validateData(data: any, schema: any): boolean {
  try {
    if (!data || typeof data !== "object") return false

    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        if (!(key in data)) return false
        if (typeof data[key] !== schema[key]) return false
      }
    }

    return true
  } catch (error) {
    console.error("Data validation error:", error)
    return false
  }
}

// حفظ آمن للبيانات
export function secureSetItem(key: string, value: any): boolean {
  try {
    if (typeof window === "undefined") return false

    // تنظيف البيانات
    const sanitizedValue = sanitizeData(value)

    // تحويل إلى JSON
    const stringValue = JSON.stringify(sanitizedValue)

    // تشفير البيانات
    const encryptedValue = encryptData(stringValue)

    // حفظ في localStorage مع timestamp للتحقق من الصلاحية
    const dataWithTimestamp = {
      data: encryptedValue,
      timestamp: Date.now(),
      checksum: CryptoJS.MD5(stringValue).toString(),
    }

    localStorage.setItem(key, JSON.stringify(dataWithTimestamp))
    return true
  } catch (error) {
    console.error("Secure storage save error:", error)
    return false
  }
}

// استرجاع آمن للبيانات
export function secureGetItem(key: string): any {
  try {
    if (typeof window === "undefined") return null

    const storedData = localStorage.getItem(key)
    if (!storedData) return null

    const parsedData = JSON.parse(storedData)

    // التحقق من وجود البيانات المطلوبة
    if (!parsedData.data || !parsedData.timestamp || !parsedData.checksum) {
      // محاولة استرجاع البيانات القديمة
      try {
        return JSON.parse(storedData)
      } catch {
        return null
      }
    }

    // التحقق من صلاحية البيانات (30 يوم)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
    if (Date.now() - parsedData.timestamp > thirtyDaysInMs) {
      localStorage.removeItem(key)
      return null
    }

    // فك التشفير
    const decryptedValue = decryptData(parsedData.data)

    // التحقق من سلامة البيانات
    const calculatedChecksum = CryptoJS.MD5(decryptedValue).toString()
    if (calculatedChecksum !== parsedData.checksum) {
      console.warn("Data integrity check failed")
      localStorage.removeItem(key)
      return null
    }

    return JSON.parse(decryptedValue)
  } catch (error) {
    console.error("Secure storage retrieve error:", error)
    // محاولة استرجاع البيانات بالطريقة القديمة
    try {
      const rawValue = localStorage.getItem(key)
      return rawValue ? JSON.parse(rawValue) : null
    } catch {
      return null
    }
  }
}

// حذف آمن للبيانات
export function secureRemoveItem(key: string): boolean {
  try {
    if (typeof window === "undefined") return false

    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error("Secure storage remove error:", error)
    return false
  }
}

// تنظيف جميع البيانات المنتهية الصلاحية
export function cleanExpiredData(): void {
  try {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    keys.forEach((key) => {
      try {
        const data = localStorage.getItem(key)
        if (data) {
          const parsedData = JSON.parse(data)
          if (parsedData.timestamp && Date.now() - parsedData.timestamp > thirtyDaysInMs) {
            localStorage.removeItem(key)
          }
        }
      } catch {
        // تجاهل الأخطاء للبيانات التالفة
      }
    })
  } catch (error) {
    console.error("Clean expired data error:", error)
  }
}

// التحقق من سلامة البيانات المخزنة
export function validateStoredData(data: any, expectedStructure: any): boolean {
  return validateData(data, expectedStructure)
}
