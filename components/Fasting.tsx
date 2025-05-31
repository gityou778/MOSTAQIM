"use client"

import { useState } from "react"

const fastingTypes = {
  obligatory: {
    title: "🌙 الصيام الواجب",
    color: "bg-red-100 border-red-500",
    items: [
      {
        name: "صيام رمضان",
        description: "صيام شهر رمضان المبارك",
        benefits: [
          "ركن من أركان الإسلام الخمسة",
          "تطهير النفس والجسد",
          "تقوية الإرادة والصبر",
          "الشعور مع الفقراء والمحتاجين",
          "مضاعفة الأجر والثواب",
        ],
        evidence: "قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ}",
      },
    ],
  },
  recommended: {
    title: "⭐ الصيام المستحب",
    color: "bg-green-100 border-green-500",
    items: [
      {
        name: "صيام شعبان",
        description: "الإكثار من الصيام في شهر شعبان",
        benefits: [
          "تحضير للنفس لاستقبال رمضان",
          "اتباع سنة النبي ﷺ",
          "تطهير النفس قبل الشهر الكريم",
          "اكتساب الأجر والثواب",
        ],
        evidence:
          "عن عائشة رضي الله عنها قالت: (لم أر النبي ﷺ استكمل صيام شهر إلا رمضان، وما رأيته أكثر صياماً منه في شعبان)",
      },
      {
        name: "صيام رجب",
        description: "الصيام في الشهر الحرام رجب",
        benefits: ["صيام في الأشهر الحرم", "تعظيم حرمات الله", "اكتساب الأجر المضاعف", "تهذيب النفس"],
        evidence: "الأشهر الحرم لها فضل خاص، وقد كان السلف يكثرون من العبادة فيها",
      },
      {
        name: "العشر الأوائل من ذي الحجة",
        description: "صيام الأيام التسعة الأولى من ذي الحجة",
        benefits: ["أفضل أيام الدنيا للعمل الصالح", "أجر عظيم ومضاعف", "تحضير ليوم عرفة", "اغتنام الأيام المباركة"],
        evidence:
          "قال النبي ﷺ: (ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام) يعني العشر الأوائل من ذي الحجة",
      },
      {
        name: "ستة أيام من شوال",
        description: "صيام ستة أيام من شهر شوال",
        benefits: ["أجر صيام الدهر كله", "إكمال نقص صيام رمضان", "استمرار في العبادة بعد رمضان", "اكتساب الأجر العظيم"],
        evidence: "قال النبي ﷺ: (من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر)",
      },
      {
        name: "صيام الاثنين والخميس",
        description: "صيام يومي الاثنين والخميس من كل أسبوع",
        benefits: ["تعرض الأعمال على الله في هذين اليومين", "اتباع سنة النبي ﷺ", "انتظام في العبادة", "تطهير الذنوب"],
        evidence: "قال النبي ﷺ: (تعرض الأعمال يوم الاثنين والخميس، فأحب أن يعرض عملي وأنا صائم)",
      },
      {
        name: "الأيام البيض",
        description: "صيام أيام 13، 14، 15 من كل شهر هجري",
        benefits: ["صيام ثلاثة أيام من كل شهر", "أجر صيام الدهر", "تنظيم العبادة شهرياً", "اتباع السنة النبوية"],
        evidence: "قال النبي ﷺ: (صيام ثلاثة أيام من كل شهر صيام الدهر كله)",
      },
      {
        name: "يوم عاشوراء",
        description: "صيام يوم 10 من شهر محرم",
        benefits: [
          "يكفر ذنوب السنة الماضية",
          "يوم نجى الله فيه موسى عليه السلام",
          "من أعظم أيام السنة",
          "أجر عظيم ومغفرة",
        ],
        evidence: "قال النبي ﷺ: (صيام يوم عاشوراء أحتسب على الله أن يكفر السنة التي قبله)",
      },
      {
        name: "يوم عرفة",
        description: "صيام يوم 9 من ذي الحجة لغير الحاج",
        benefits: ["يكفر ذنوب سنتين", "من أعظم الأيام عند الله", "يوم إكمال الدين", "مغفرة عظيمة"],
        evidence: "قال النبي ﷺ: (صيام يوم عرفة أحتسب على الله أن يكفر السنة التي قبله والسنة التي بعده)",
      },
    ],
  },
  forbidden: {
    title: "🚫 الصيام المحرم والمكروه",
    color: "bg-red-100 border-red-500",
    items: [
      {
        name: "يوم العيد",
        description: "صيام يومي عيد الفطر والأضحى",
        ruling: "محرم شرعاً",
        reason: "أيام فرح وأكل وشرب وذكر لله",
      },
      {
        name: "أيام التشريق",
        description: "أيام 11، 12، 13 من ذي الحجة",
        ruling: "محرم لغير الحاج",
        reason: "أيام أكل وشرب وذكر لله، إلا للحاج إذا لم يجد الهدي",
      },
      {
        name: "صيام الدهر",
        description: "صيام جميع أيام السنة دون انقطاع",
        ruling: "مكروه",
        reason: "يرهق النفس ويخالف هدي النبي ﷺ",
      },
      {
        name: "صيام الجمعة منفرداً",
        description: "صيام يوم الجمعة وحده",
        ruling: "مكروه",
        reason: "إلا إذا صام قبله أو بعده يوماً آخر",
      },
    ],
  },
}

export default function Fasting() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🌙 دليل الصيام الشامل</h2>
        <p className="text-gray-600">تعرف على أنواع الصيام وفوائدها وأحكامها</p>
      </div>

      <div className="space-y-6">
        {Object.entries(fastingTypes).map(([key, section]) => (
          <div key={key} className={`rounded-xl border-r-4 p-6 ${section.color}`}>
            <button onClick={() => toggleSection(key)} className="w-full text-right">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                {section.title}
                <span className="text-2xl">{expandedSection === key ? "▼" : "▶"}</span>
              </h3>
            </button>

            {expandedSection === key && (
              <div className="space-y-4 mt-4">
                {section.items.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                    <p className="text-gray-700 mb-3">{item.description}</p>

                    {item.benefits && (
                      <div className="mb-3">
                        <h5 className="font-semibold text-green-800 mb-2">الفوائد:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {item.benefits.map((benefit, i) => (
                            <li key={i} className="text-gray-600">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.ruling && (
                      <div className="mb-3">
                        <span className="font-semibold text-red-800">الحكم: </span>
                        <span className="text-gray-700">{item.ruling}</span>
                      </div>
                    )}

                    {item.reason && (
                      <div className="mb-3">
                        <span className="font-semibold text-blue-800">السبب: </span>
                        <span className="text-gray-700">{item.reason}</span>
                      </div>
                    )}

                    {item.evidence && (
                      <div className="bg-blue-50 p-3 rounded border-r-2 border-blue-400">
                        <h5 className="font-semibold text-blue-800 mb-1">الدليل:</h5>
                        <p className="text-sm text-blue-700 italic">{item.evidence}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">📝 ملاحظة مهمة:</h3>
        <p className="text-yellow-700">
          هذه المعلومات مستقاة من مصادر موثوقة، ولكن يُنصح بالرجوع إلى العلماء المختصين للاستفسارات الفقهية المحددة.
        </p>
      </div>
    </section>
  )
}
