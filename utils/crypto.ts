/**
 * وحدة التشفير الآمنة المحسنة مع التوافق العكسي
 */

// التحقق من دعم Web Crypto API
function isWebCryptoSupported(): boolean {
  return typeof window !== "undefined" && window.crypto && window.crypto.subtle
}

// توليد مفتاح عشوائي قوي لكل مستخدم
async function generateSecureKey(): Promise<CryptoKey | null> {
  if (!isWebCryptoSupported()) return null

  // التحقق من وجود مفتاح مخزن
  const storedKeyData = sessionStorage.getItem("_secure_key")

  if (storedKeyData) {
    try {
      // استعادة المفتاح المخزن
      const keyData = JSON.parse(storedKeyData)
      const importedKey = await window.crypto.subtle.importKey(
        "jwk",
        keyData,
        {
          name: "AES-GCM",
          length: 256,
        },
        false,
        ["encrypt", "decrypt"],
      )
      return importedKey
    } catch (error) {
      console.error("Error importing stored key:", error)
      // في حالة الخطأ، إنشاء مفتاح جديد
    }
  }

  // إنشاء مفتاح جديد
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )

    // تخزين المفتاح بتنسيق JWK
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key)
    sessionStorage.setItem("_secure_key", JSON.stringify(exportedKey))

    return key
  } catch (error) {
    console.error("Error generating secure key:", error)
    return null
  }
}

// تحويل النص إلى بايتات
function str2ab(str: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

// تحويل البايتات إلى نص
function ab2str(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

// تحويل آمن إلى Base64
function safeBase64Encode(data: Uint8Array): string {
  try {
    return btoa(String.fromCharCode(...data))
  } catch (error) {
    // استخدام طريقة بديلة للبيانات الكبيرة
    let binary = ""
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i])
    }
    return btoa(binary)
  }
}

// تحويل آمن من Base64
function safeBase64Decode(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  } catch (error) {
    console.error("Base64 decode error:", error)
    throw new Error("فشل في فك تشفير البيانات - البيانات تالفة")
  }
}

// تشفير البيانات باستخدام Web Crypto API
export async function encryptData(data: string): Promise<string> {
  if (!isWebCryptoSupported()) {
    // استخدام تشفير بسيط كبديل
    return fallbackEncrypt(data)
  }

  try {
    const key = await generateSecureKey()
    if (!key) {
      return fallbackEncrypt(data)
    }

    // إنشاء IV عشوائي
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    // تشفير البيانات
    const dataBuffer = str2ab(data)
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBuffer,
    )

    // دمج IV مع البيانات المشفرة
    const result = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encryptedBuffer), iv.length)

    // إضافة علامة للتمييز بين النظام الجديد والقديم
    return "v2:" + safeBase64Encode(result)
  } catch (error) {
    console.error("Encryption error:", error)
    // استخدام التشفير البديل في حالة الخطأ
    return fallbackEncrypt(data)
  }
}

// فك تشفير البيانات
export async function decryptData(encryptedData: string): Promise<string> {
  if (!encryptedData) {
    throw new Error("البيانات المشفرة فارغة")
  }

  // التحقق من نوع التشفير
  if (encryptedData.startsWith("v2:")) {
    // النظام الجديد
    return await decryptWithWebCrypto(encryptedData.substring(3))
  } else {
    // النظام القديم أو البيانات غير المشفرة
    return await decryptLegacyData(encryptedData)
  }
}

// فك التشفير باستخدام Web Crypto API
async function decryptWithWebCrypto(encryptedData: string): Promise<string> {
  if (!isWebCryptoSupported()) {
    throw new Error("Web Crypto API غير مدعوم")
  }

  try {
    const key = await generateSecureKey()
    if (!key) {
      throw new Error("فشل في الحصول على مفتاح التشفير")
    }

    // تحويل من Base64
    const encryptedBytes = safeBase64Decode(encryptedData)

    // التحقق من الحد الأدنى لحجم البيانات
    if (encryptedBytes.length < 12) {
      throw new Error("البيانات المشفرة قصيرة جداً")
    }

    // استخراج IV والبيانات المشفرة
    const iv = encryptedBytes.slice(0, 12)
    const ciphertext = encryptedBytes.slice(12)

    // فك التشفير
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext,
    )

    return ab2str(decryptedBuffer)
  } catch (error) {
    console.error("Web Crypto decryption error:", error)
    throw new Error("فشل في فك تشفير البيانات")
  }
}

// فك تشفير البيانات القديمة أو غير المشفرة
async function decryptLegacyData(data: string): Promise<string> {
  try {
    // محاولة تحليل البيانات كـ JSON مباشرة (بيانات غير مشفرة)
    JSON.parse(data)
    return data
  } catch {
    // محاولة فك التشفير بالنظام القديم
    try {
      return fallbackDecrypt(data)
    } catch (error) {
      console.error("Legacy decryption failed:", error)
      // إذا فشل كل شيء، إرجاع البيانات كما هي
      return data
    }
  }
}

// تشفير بديل بسيط (للتوافق)
function fallbackEncrypt(data: string): string {
  try {
    // تشفير بسيط باستخدام Base64 مع تشويش
    const encoded = btoa(unescape(encodeURIComponent(data)))
    const scrambled = encoded.split("").reverse().join("")
    return "fallback:" + scrambled
  } catch (error) {
    console.error("Fallback encryption error:", error)
    return data
  }
}

// فك تشفير بديل
function fallbackDecrypt(encryptedData: string): string {
  try {
    if (encryptedData.startsWith("fallback:")) {
      const scrambled = encryptedData.substring(9)
      const encoded = scrambled.split("").reverse().join("")
      return decodeURIComponent(escape(atob(encoded)))
    }
    return encryptedData
  } catch (error) {
    console.error("Fallback decryption error:", error)
    return encryptedData
  }
}

// تخزين آمن للبيانات
export async function secureSetItem(key: string, value: any): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false

    // تنظيف وتحويل البيانات إلى JSON
    const sanitizedValue = JSON.stringify(value)

    // إضافة طابع زمني
    const dataWithTimestamp = {
      data: sanitizedValue,
      timestamp: Date.now(),
      checksum: await generateChecksum(sanitizedValue),
    }

    // تشفير البيانات
    const encryptedValue = await encryptData(JSON.stringify(dataWithTimestamp))

    // تخزين البيانات المشفرة
    localStorage.setItem(key, encryptedValue)
    return true
  } catch (error) {
    console.error("Secure storage save error:", error)
    // محاولة حفظ البيانات بدون تشفير كبديل
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (fallbackError) {
      console.error("Fallback storage save error:", fallbackError)
      return false
    }
  }
}

// استرجاع آمن للبيانات
export async function secureGetItem(key: string): Promise<any> {
  try {
    if (typeof window === "undefined") return null

    const storedData = localStorage.getItem(key)
    if (!storedData) return null

    // محاولة فك التشفير
    try {
      const decryptedValue = await decryptData(storedData)
      const parsedData = JSON.parse(decryptedValue)

      // التحقق من وجود البنية المتوقعة
      if (parsedData && typeof parsedData === "object" && parsedData.data && parsedData.timestamp) {
        // التحقق من صلاحية البيانات
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
        if (Date.now() - parsedData.timestamp > thirtyDaysInMs) {
          localStorage.removeItem(key)
          return null
        }

        // التحقق من سلامة البيانات
        if (parsedData.checksum) {
          const calculatedChecksum = await generateChecksum(parsedData.data)
          if (calculatedChecksum !== parsedData.checksum) {
            console.warn("Data integrity check failed for key:", key)
            localStorage.removeItem(key)
            return null
          }
        }

        return JSON.parse(parsedData.data)
      } else {
        // البيانات في تنسيق قديم أو مختلف
        return parsedData
      }
    } catch (decryptError) {
      console.warn("Decryption failed, trying direct parse:", decryptError)
      // محاولة تحليل البيانات مباشرة (بيانات غير مشفرة)
      try {
        return JSON.parse(storedData)
      } catch (parseError) {
        console.error("Failed to parse stored data:", parseError)
        // حذف البيانات التالفة
        localStorage.removeItem(key)
        return null
      }
    }
  } catch (error) {
    console.error("Secure storage retrieve error:", error)
    return null
  }
}

// إنشاء قيمة تحقق للبيانات
async function generateChecksum(data: string): Promise<string> {
  if (!isWebCryptoSupported()) {
    // استخدام checksum بسيط
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // تحويل إلى 32bit integer
    }
    return hash.toString(16)
  }

  try {
    const msgBuffer = str2ab(data)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch (error) {
    console.error("Checksum generation error:", error)
    // استخدام checksum بسيط كبديل
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(16)
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

// تنظيف البيانات المنتهية الصلاحية
export async function cleanExpiredData(): Promise<void> {
  try {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

    for (const key of keys) {
      try {
        const item = await secureGetItem(key)
        if (!item) {
          // إذا فشل في قراءة البيانات، احذفها
          localStorage.removeItem(key)
        }
      } catch (error) {
        // تجاهل الأخطاء للبيانات التالفة واحذفها
        console.warn(`Removing corrupted data for key: ${key}`)
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error("Clean expired data error:", error)
  }
}

// دالة لإعادة تعيين جميع البيانات المشفرة
export async function resetEncryptedData(): Promise<void> {
  try {
    if (typeof window === "undefined") return

    // حذف مفتاح التشفير القديم
    sessionStorage.removeItem("_secure_key")

    // إعادة تشفير جميع البيانات بالنظام الجديد
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      try {
        const data = await secureGetItem(key)
        if (data) {
          await secureSetItem(key, data)
        }
      } catch (error) {
        console.warn(`Failed to re-encrypt data for key: ${key}`, error)
      }
    }
  } catch (error) {
    console.error("Reset encrypted data error:", error)
  }
}
