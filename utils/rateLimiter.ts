import { RateLimiterMemory } from "rate-limiter-flexible"

// إعدادات Rate Limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: "mustaqeem_api",
  points: 10, // عدد الطلبات المسموحة
  duration: 60, // في 60 ثانية
  blockDuration: 300, // حظر لمدة 5 دقائق عند التجاوز
})

// Rate Limiter للبوت الذكي
const chatRateLimiter = new RateLimiterMemory({
  keyPrefix: "mustaqeem_chat",
  points: 5, // 5 رسائل فقط
  duration: 60, // في الدقيقة
  blockDuration: 600, // حظر لمدة 10 دقائق
})

// Rate Limiter للمهام
const taskRateLimiter = new RateLimiterMemory({
  keyPrefix: "mustaqeem_tasks",
  points: 20, // 20 مهمة في الدقيقة
  duration: 60,
  blockDuration: 180, // حظر لمدة 3 دقائق
})

export async function checkRateLimit(ip: string, type: "general" | "chat" | "task" = "general"): Promise<boolean> {
  try {
    let limiter = rateLimiter

    switch (type) {
      case "chat":
        limiter = chatRateLimiter
        break
      case "task":
        limiter = taskRateLimiter
        break
      default:
        limiter = rateLimiter
    }

    await limiter.consume(ip)
    return true
  } catch (rejRes: any) {
    // إذا تم تجاوز الحد، إرجاع false
    return false
  }
}

export function getRateLimitInfo(ip: string, type: "general" | "chat" | "task" = "general") {
  let limiter = rateLimiter

  switch (type) {
    case "chat":
      limiter = chatRateLimiter
      break
    case "task":
      limiter = taskRateLimiter
      break
    default:
      limiter = rateLimiter
  }

  return limiter.get(ip)
}
