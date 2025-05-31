import { z } from "zod"
import DOMPurify from "dompurify"

// تنظيف النصوص من المحتوى الضار
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return ""

  // استخدام DOMPurify لتنظيف المحتوى
  let cleaned = ""

  if (typeof window !== "undefined") {
    cleaned = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    })
  } else {
    // تنظيف أساسي للخادم
    cleaned = input
      .replace(/<[^>]*>/g, "")
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

// مخططات التحقق من البيانات
export const TaskSchema = z.object({
  id: z.number(),
  text: z.string().min(1).max(200),
  completed: z.boolean(),
  type: z.enum(["daily", "longterm"]),
  createdAt: z.date(),
})

export const HabitSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(10),
  streak: z.number().min(0),
  lastCompleted: z.string().nullable(),
  completedToday: z.boolean(),
  weeklyHistory: z.record(z.boolean()),
  createdAt: z.string(),
})

export const ChatMessageSchema = z.object({
  message: z.string().min(1).max(500),
})

// التحقق من صحة المهام
export function validateTask(task: any): boolean {
  try {
    TaskSchema.parse(task)
    return true
  } catch {
    return false
  }
}

// التحقق من صحة العادات
export function validateHabit(habit: any): boolean {
  try {
    HabitSchema.parse(habit)
    return true
  } catch {
    return false
  }
}

// التحقق من صحة رسائل الدردشة
export function validateChatMessage(message: any): boolean {
  try {
    ChatMessageSchema.parse(message)
    return true
  } catch {
    return false
  }
}

// فلترة الكلمات المحظورة
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

// التحقق من قوة كلمة المرور (للاستخدام المستقبلي)
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف كبير واحد على الأقل")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف صغير واحد على الأقل")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("يجب أن تحتوي على رقم واحد على الأقل")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("يجب أن تحتوي على رمز خاص واحد على الأقل")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
