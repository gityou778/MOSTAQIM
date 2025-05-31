import DOMPurify from "dompurify"

/**
 * تنظيف المدخلات من المحتوى الضار
 * @param input النص المراد تنظيفه
 * @returns النص بعد التنظيف
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return ""

  let cleaned = ""

  if (typeof window !== "undefined") {
    // استخدام DOMPurify لتنظيف المحتوى
    cleaned = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // لا نسمح بأي وسوم HTML
      ALLOWED_ATTR: [], // لا نسمح بأي سمات
      FORBID_TAGS: ["style", "script", "iframe", "form", "object"],
      FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover"],
    })
  } else {
    // تنظيف أساسي للخادم
    cleaned = input
      .replace(/<[^>]*>/g, "") // إزالة وسوم HTML
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+=/gi, "")
  }

  // إزالة الأحرف الخطيرة
  cleaned = cleaned
    .replace(/[<>'"&\\/]/g, "")
    .replace(/\0/g, "") // null bytes
    .replace(/\x08/g, "") // backspace
    .replace(/\x0B/g, "") // vertical tab
    .replace(/\x0C/g, "") // form feed
    .replace(/\x0E/g, "") // shift out
    .replace(/\x0F/g, "") // shift in

  // تحديد الطول الأقصى
  return cleaned.substring(0, 500).trim()
}

/**
 * التحقق من صحة المدخلات
 * @param value القيمة المراد التحقق منها
 * @param type نوع البيانات
 * @param options خيارات إضافية
 */
export function validateInput(
  value: any,
  type: "string" | "number" | "email" | "city",
  options: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
  } = {},
): boolean {
  // التحقق من النوع
  if (type === "string") {
    if (typeof value !== "string") return false
    if (options.minLength !== undefined && value.length < options.minLength) return false
    if (options.maxLength !== undefined && value.length > options.maxLength) return false
    if (options.pattern && !options.pattern.test(value)) return false
    return true
  }

  if (type === "number") {
    const num = Number(value)
    if (isNaN(num)) return false
    if (options.min !== undefined && num < options.min) return false
    if (options.max !== undefined && num > options.max) return false
    return true
  }

  if (type === "email") {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return typeof value === "string" && emailRegex.test(value)
  }

  if (type === "city") {
    // التحقق من أن المدينة تحتوي فقط على أحرف عربية أو إنجليزية أو مسافات
    const cityRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/
    return typeof value === "string" && cityRegex.test(value) && value.length <= 50
  }

  return false
}

/**
 * إنشاء CSRF توكن
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * تخزين CSRF توكن
 */
export function storeCSRFToken(token: string): void {
  sessionStorage.setItem("csrf-token", token)
}

/**
 * الحصول على CSRF توكن
 */
export function getCSRFToken(): string {
  return sessionStorage.getItem("csrf-token") || generateAndStoreNewToken()
}

/**
 * إنشاء وتخزين توكن جديد
 */
function generateAndStoreNewToken(): string {
  const token = generateCSRFToken()
  storeCSRFToken(token)
  return token
}

/**
 * فلترة الكلمات المحظورة
 */
const BLOCKED_WORDS = [
  "script",
  "javascript",
  "eval",
  "function",
  "alert",
  "document",
  "window",
  "onclick",
  "onload",
  "onerror",
  "iframe",
  "embed",
  "object",
  "form",
  "input",
  "textarea",
  "select",
  "button",
  "link",
  "meta",
  "style",
  "hack",
  "exploit",
  "vulnerability",
  "injection",
  "malware",
  "virus",
  "phishing",
  "trojan",
  "backdoor",
  "rootkit",
  "keylogger",
  "spyware",
]

export function containsBlockedWords(text: string): boolean {
  const lowerText = text.toLowerCase()
  return BLOCKED_WORDS.some((word) => lowerText.includes(word))
}
