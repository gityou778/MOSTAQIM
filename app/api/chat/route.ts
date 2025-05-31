import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/utils/rateLimiter"
import { sanitizeInput, validateChatMessage, containsBlockedWords } from "@/utils/validation"

// قاعدة بيانات محسنة للأسئلة والأجوبة
const commonQuestions = [
  {
    keywords: ["صلاة", "الصلاة", "صلوات", "الصلوات", "الصلاه"],
    answer:
      "الصلاة هي الركن الثاني من أركان الإسلام، وهي عمود الدين. قال النبي ﷺ: «رأس الأمر الإسلام، وعموده الصلاة». وهي خمس صلوات في اليوم والليلة: الفجر، الظهر، العصر، المغرب، والعشاء.",
    sources: ["صحيح البخاري", "صحيح مسلم"],
    verified: true,
  },
  {
    keywords: ["صيام", "الصيام", "رمضان", "صوم", "الصوم"],
    answer:
      "الصيام هو الركن الرابع من أركان الإسلام. قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ}. وصيام رمضان واجب على كل مسلم بالغ عاقل قادر.",
    sources: ["القرآن الكريم - سورة البقرة"],
    verified: true,
  },
  {
    keywords: ["زكاة", "الزكاة", "صدقة", "الصدقة"],
    answer:
      "الزكاة هي الركن الثالث من أركان الإسلام. وهي حق معلوم في المال. قال تعالى: {وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ}. وتجب الزكاة على من يملك النصاب وحال عليه الحول.",
    sources: ["القرآن الكريم", "السنة النبوية"],
    verified: true,
  },
]

// دالة البحث المحسنة
function findAnswer(message: string): { answer: string; sources: string[]; verified: boolean } | null {
  const cleanMessage = sanitizeInput(message).toLowerCase()

  if (!cleanMessage || cleanMessage.length < 2) return null

  for (const item of commonQuestions) {
    if (item.keywords.some((keyword) => cleanMessage.includes(keyword.toLowerCase()))) {
      return {
        answer: item.answer,
        sources: item.sources || [],
        verified: item.verified || false,
      }
    }
  }

  return null
}

// ردود عامة محسنة
const generalResponses = [
  {
    text: "هذا سؤال مهم. أنصحك بالرجوع إلى العلماء المختصين أو كتب أهل العلم الموثوقة للحصول على إجابة دقيقة.",
    sources: ["دار الإفتاء", "الأزهر الشريف"],
    verified: false,
  },
  {
    text: "جزاك الله خيراً على هذا السؤال. يُفضل استشارة أهل العلم في هذا الأمر للحصول على إجابة مفصلة.",
    sources: ["علماء معتبرين", "كتب الفقه"],
    verified: false,
  },
]

// الحصول على IP العميل بطريقة آمنة
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const real = request.headers.get("x-real-ip")
  const remote = request.headers.get("remote-addr")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  return real || remote || "unknown"
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // الحصول على IP العميل
    const clientIP = getClientIP(request)

    // التحقق من Rate Limiting
    const rateLimitPassed = await checkRateLimit(clientIP, "chat")
    if (!rateLimitPassed) {
      return NextResponse.json(
        {
          error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة بعد 10 دقائق.",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: 600,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        },
      )
    }

    // قراءة البيانات مع التحقق من الحجم
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > 1024) {
      // 1KB max
      return NextResponse.json({ error: "حجم الطلب كبير جداً", code: "PAYLOAD_TOO_LARGE" }, { status: 413 })
    }

    const body = await request.json()

    // التحقق من صحة البيانات
    if (!validateChatMessage(body)) {
      return NextResponse.json({ error: "بيانات غير صالحة", code: "INVALID_DATA" }, { status: 400 })
    }

    const { message } = body

    // تنظيف المدخلات
    const cleanMessage = sanitizeInput(message)

    if (!cleanMessage || cleanMessage.length === 0) {
      return NextResponse.json(
        { error: "الرسالة فارغة أو تحتوي على محتوى غير صالح", code: "EMPTY_MESSAGE" },
        { status: 400 },
      )
    }

    if (cleanMessage.length < 2) {
      return NextResponse.json({ error: "الرسالة قصيرة جداً", code: "MESSAGE_TOO_SHORT" }, { status: 400 })
    }

    // التحقق من الكلمات المحظورة
    if (containsBlockedWords(cleanMessage)) {
      // تسجيل محاولة الهجوم
      console.warn(`Blocked content attempt from IP: ${clientIP}, Message: ${cleanMessage}`)

      return NextResponse.json({ error: "المحتوى غير مسموح", code: "BLOCKED_CONTENT" }, { status: 400 })
    }

    // البحث عن إجابة
    const localAnswer = findAnswer(cleanMessage)

    if (localAnswer) {
      return NextResponse.json({
        response: localAnswer.answer,
        sources: localAnswer.sources,
        verified: localAnswer.verified,
        disclaimer: "⚠️ للفتاوى المهمة والمسائل الشخصية، يُنصح بمراجعة العلماء المختصين.",
        processingTime: Date.now() - startTime,
      })
    }

    // رد عام
    const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)]

    return NextResponse.json({
      response: randomResponse.text,
      sources: randomResponse.sources,
      verified: randomResponse.verified,
      disclaimer: "⚠️ تذكر: للفتاوى المهمة راجع العلماء المختصين.",
      processingTime: Date.now() - startTime,
    })
  } catch (error) {
    // تسجيل الخطأ بدون كشف التفاصيل
    console.error("Chat API Error:", {
      timestamp: new Date().toISOString(),
      ip: getClientIP(request),
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      {
        error: "حدث خطأ داخلي في الخادم",
        code: "INTERNAL_ERROR",
        disclaimer: "⚠️ للفتاوى المهمة راجع العلماء المختصين.",
      },
      { status: 500 },
    )
  }
}

// منع الطرق غير المسموحة
export async function GET() {
  return NextResponse.json({ error: "الطريقة غير مسموحة", code: "METHOD_NOT_ALLOWED" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "الطريقة غير مسموحة", code: "METHOD_NOT_ALLOWED" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "الطريقة غير مسموحة", code: "METHOD_NOT_ALLOWED" }, { status: 405 })
}
