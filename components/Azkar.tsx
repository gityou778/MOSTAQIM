"use client"

import { useState, useEffect } from "react"
import { secureGetItem, secureSetItem } from "@/utils/crypto"

interface AzkarProps {
  showReport?: boolean
}

const azkarData = {
  general: [
    {
      text: "سبحان الله",
      count: 33,
      virtue: "من قالها 33 مرة بعد كل صلاة مع الحمد لله والله أكبر غُفرت ذنوبه",
    },
    {
      text: "الحمد لله",
      count: 33,
      virtue: "من قالها 33 مرة بعد كل صلاة مع سبحان الله والله أكبر غُفرت ذنوبه",
    },
    {
      text: "الله أكبر",
      count: 34,
      virtue: "من قالها 34 مرة بعد كل صلاة مع سبحان الله والحمد لله غُفرت ذنوبه",
    },
    {
      text: "سبحان الله وبحمده",
      count: 100,
      virtue: "من قالها في يوم مائة مرة حُطت خطاياه وإن كانت مثل زبد البحر",
    },
    {
      text: "سبحان الله العظيم",
      count: 10,
      virtue: "كلمة خفيفة على اللسان، ثقيلة في الميزان، حبيبة إلى الرحمن",
    },
    {
      text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      count: 10,
      virtue: "من قالها 10 مرات كان كمن أعتق أربعة أنفس من ولد إسماعيل",
    },
    {
      text: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
      count: 3,
      virtue: "من قالها ثلاث مرات غُفر له ذنبه وإن كان فارًا من الزحف",
    },
    {
      text: "لا حول ولا قوة إلا بالله",
      count: 10,
      virtue: "كنز من كنوز الجنة، وهي دواء من تسعة وتسعين داء أيسرها الهم",
    },
    {
      text: "اللهم صل وسلم على نبينا محمد",
      count: 10,
      virtue: "من صلى علي واحدة صلى الله عليه بها عشرًا",
    },
    {
      text: "رب اغفر لي ذنبي وخطئي وجهلي",
      count: 3,
      virtue: "دعاء جامع للاستغفار من جميع أنواع الذنوب",
    },
  ],
  morning: [
    {
      text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      count: 1,
      virtue: "من أذكار الصباح المستجابة",
    },
    {
      text: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور",
      count: 1,
      virtue: "إقرار بأن الله هو مصدر الحياة والموت",
    },
    {
      text: "أصبحنا على فطرة الإسلام وعلى كلمة الإخلاص وعلى دين نبينا محمد صلى الله عليه وسلم وعلى ملة أبينا إبراهيم حنيفاً مسلماً وما كان من المشركين",
      count: 1,
      virtue: "تجديد الإيمان والولاء لله ورسوله",
    },
    {
      text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
      count: 1,
      virtue: "دعاء النبي ﷺ لمعاذ بن جبل رضي الله عنه",
    },
    {
      text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري",
      count: 3,
      virtue: "دعاء للعافية في البدن والحواس",
    },
  ],
  evening: [
    {
      text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      count: 1,
      virtue: "من أذكار المساء المستجابة",
    },
    {
      text: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير",
      count: 1,
      virtue: "إقرار بأن الله هو مصدر الحياة والموت",
    },
    {
      text: "أمسينا على فطرة الإسلام وعلى كلمة الإخلاص وعلى دين نبينا محمد صلى الله عليه وسلم وعلى ملة أبينا إبراهيم حنيفاً مسلماً وما كان من المشركين",
      count: 1,
      virtue: "تجديد الإيمان والولاء لله ورسوله",
    },
    {
      text: "اللهم أعوذ بك من الهم والحزن، وأعوذ بك من العجز والكسل، وأعوذ بك من الجبن والبخل، وأعوذ بك من غلبة الدين وقهر الرجال",
      count: 1,
      virtue: "دعاء جامع للاستعاذة من الشرور",
    },
  ],
  afterPrayer: [
    {
      text: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
      count: 3,
      virtue: "استغفار بعد الصلاة لتكفير النقص فيها",
    },
    {
      text: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
      count: 1,
      virtue: "دعاء النبي ﷺ بعد السلام من الصلاة",
    },
    {
      text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
      count: 10,
      virtue: "من قالها بعد كل صلاة لم يحل بينه وبين دخول الجنة إلا أن يموت",
    },
    {
      text: "سبحان الله",
      count: 33,
      virtue: "التسبيح بعد الصلاة من السنن المؤكدة",
    },
    {
      text: "الحمد لله",
      count: 33,
      virtue: "الحمد بعد الصلاة من السنن المؤكدة",
    },
    {
      text: "الله أكبر",
      count: 34,
      virtue: "التكبير بعد الصلاة من السنن المؤكدة",
    },
  ],
  sleep: [
    {
      text: "باسمك اللهم أموت وأحيا",
      count: 1,
      virtue: "دعاء النوم الذي علمه النبي ﷺ",
    },
    {
      text: "اللهم قني عذابك يوم تبعث عبادك",
      count: 3,
      virtue: "استعاذة من عذاب القبر وعذاب الآخرة",
    },
    {
      text: "سبحان الله والحمد لله ولا إله إلا الله والله أكبر",
      count: 1,
      virtue: "الباقيات الصالحات قبل النوم",
    },
    {
      text: "اللهم أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك، وألجأت ظهري إليك، رغبة ورهبة إليك",
      count: 1,
      virtue: "دعاء التفويض والتوكل على الله",
    },
  ],
}

export default function Azkar({ showReport = false }: AzkarProps) {
  const [selectedType, setSelectedType] = useState<keyof typeof azkarData>(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem("selectedAzkarType")
      return (savedType as keyof typeof azkarData) || "general"
    }
    return "general"
  })
  const [counters, setCounters] = useState<{ [key: number]: number }>(() => {
    if (typeof window !== "undefined") {
      const savedCounters = localStorage.getItem("azkarCounters")
      return savedCounters ? JSON.parse(savedCounters) : {}
    }
    return {}
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("azkarCounters", JSON.stringify(counters))
    }
  }, [counters])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedAzkarType", selectedType)
    }
  }, [selectedType])

  // حفظ تقدم الأذكار للتقرير
  useEffect(() => {
    const saveAzkarProgress = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]
        const azkarHistory = (await secureGetItem("azkarHistory")) || {}

        if (!azkarHistory[selectedType]) {
          azkarHistory[selectedType] = {}
        }

        // التحقق من إكمال جميع الأذكار لهذا النوع
        const currentAzkar = azkarData[selectedType]
        const allCompleted = currentAzkar.every((zikr, index) => {
          const currentCount = counters[index] || 0
          return currentCount >= zikr.count
        })

        azkarHistory[selectedType][today] = allCompleted
        await secureSetItem("azkarHistory", azkarHistory)
      } catch (error) {
        console.error("Error saving azkar progress:", error)
      }
    }

    saveAzkarProgress()
  }, [counters, selectedType])

  const showAzkar = (type: keyof typeof azkarData) => {
    setSelectedType(type)
    setCounters({})
  }

  const incrementCounter = (index: number, maxCount: number) => {
    setCounters((prev) => ({
      ...prev,
      [index]: Math.min((prev[index] || 0) + 1, maxCount),
    }))
  }

  const resetCounter = (index: number) => {
    setCounters((prev) => ({
      ...prev,
      [index]: 0,
    }))
  }

  const azkarTypes = [
    { key: "general", name: "الأذكار العامة", icon: "✨", color: "bg-purple-500 hover:bg-purple-600" },
    { key: "morning", name: "أذكار الصباح", icon: "🌅", color: "bg-yellow-500 hover:bg-yellow-600" },
    { key: "evening", name: "أذكار المساء", icon: "🌇", color: "bg-purple-500 hover:bg-purple-600" },
    { key: "afterPrayer", name: "ما بعد الصلاة", icon: "🤲", color: "bg-green-500 hover:bg-green-600" },
    { key: "sleep", name: "أذكار النوم", icon: "🌙", color: "bg-indigo-500 hover:bg-indigo-600" },
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-center">🌄 الأذكار والأدعية</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {azkarTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => showAzkar(type.key as keyof typeof azkarData)}
            className={`${type.color} text-white p-4 rounded-xl text-center transition-all hover:scale-105 ${
              selectedType === type.key ? "ring-4 ring-white ring-opacity-50" : ""
            }`}
          >
            <div className="text-2xl mb-1">{type.icon}</div>
            <div className="text-sm font-medium">{type.name}</div>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-emerald-800 mb-4">
            {azkarTypes.find((t) => t.key === selectedType)?.name}
          </h3>

          {azkarData[selectedType].map((zikr, index) => {
            const currentCount = counters[index] || 0
            const isCompleted = currentCount >= zikr.count

            return (
              <div
                key={index}
                className={`p-6 rounded-xl border-r-4 transition-all ${
                  isCompleted ? "bg-green-100 border-green-500" : "bg-gray-50 border-gray-300"
                }`}
              >
                <p className="zikr-text text-lg mb-3 leading-relaxed">{zikr.text}</p>

                {zikr.virtue && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4 border-r-2 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">الفضل: </span>
                      {zikr.virtue}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => incrementCounter(index, zikr.count)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {isCompleted ? "✅ تم" : "تسبيح"}
                    </button>

                    <button
                      onClick={() => resetCounter(index)}
                      className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm"
                    >
                      إعادة
                    </button>
                  </div>

                  <div className="text-lg font-bold">
                    <span className={isCompleted ? "text-green-600" : "text-emerald-600"}>{currentCount}</span>
                    <span className="text-gray-500"> / {zikr.count}</span>
                  </div>
                </div>

                {zikr.count > 1 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-emerald-500"}`}
                        style={{ width: `${(currentCount / zikr.count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* نصائح للأذكار */}
      <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">💡 نصائح للأذكار:</h3>
        <ul className="text-amber-700 space-y-1 text-sm">
          <li>• احرص على الأذكار في أوقاتها المحددة</li>
          <li>• استحضر معنى الذكر أثناء قوله</li>
          <li>• ابدأ بالأذكار العامة إذا كنت مبتدئًا</li>
          <li>• لا تنس أذكار الصباح والمساء فهي حصن المؤمن</li>
          <li>• الأذكار بعد الصلاة لها فضل عظيم</li>
        </ul>
      </div>
    </section>
  )
}
