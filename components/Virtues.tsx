"use client"

import { useState } from "react"

const virtuesData = {
  hajj: {
    title: "📿 فضل العشر الأوائل من ذي الحجة",
    content: [
      {
        text: 'قال النبي ﷺ: "ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام"، يعني العشر الأوائل من ذي الحجة.',
        source: "رواه البخاري",
      },
      {
        text: "يُستحب فيها: الصيام، الذكر، الدعاء، الصدقة، وقراءة القرآن.",
        source: "",
      },
    ],
    video: "https://youtu.be/asO1fFdGtDU?si=BfKgZ381cDMvDKCH",
  },
  ramadan: {
    title: "🌙 فضل شهر رمضان المبارك",
    content: [
      {
        text: 'قال النبي ﷺ: "إذا دخل رمضان فُتحت أبواب الجنة، وغُلقت أبواب جهنم، وسُلسلت الشياطين".',
        source: "رواه البخاري ومسلم",
      },
      {
        text: 'قال النبي ﷺ: "من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه".',
        source: "رواه البخاري ومسلم",
      },
      {
        text: "فيه ليلة القدر التي هي خير من ألف شهر، والعمرة فيه تعدل حجة.",
        source: "",
      },
    ],
  },
  friday: {
    title: "🕌 فضل يوم الجمعة",
    content: [
      {
        text: 'قال النبي ﷺ: "خير يوم طلعت عليه الشمس يوم الجمعة، فيه خُلق آدم، وفيه أُدخل الجنة، وفيه أُخرج منها".',
        source: "رواه مسلم",
      },
      {
        text: 'قال النبي ﷺ: "من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين".',
        source: "رواه الحاكم",
      },
      {
        text: "فيه ساعة إجابة، ويُستحب فيه الإكثار من الصلاة على النبي ﷺ.",
        source: "",
      },
    ],
  },
  laylatul_qadr: {
    title: "✨ فضل ليلة القدر",
    content: [
      {
        text: "قال تعالى: {ليلة القدر خير من ألف شهر}، أي العبادة فيها خير من عبادة ألف شهر.",
        source: "سورة القدر",
      },
      {
        text: 'قال النبي ﷺ: "من قام ليلة القدر إيماناً واحتساباً غُفر له ما تقدم من ذنبه".',
        source: "رواه البخاري ومسلم",
      },
      {
        text: "تُطلب في الليالي الوترية من العشر الأواخر من رمضان، وأرجاها ليلة السابع والعشرين.",
        source: "",
      },
    ],
  },
  ashura: {
    title: "🌟 فضل يوم عاشوراء",
    content: [
      {
        text: 'قال النبي ﷺ: "صيام يوم عاشوراء أحتسب على الله أن يكفر السنة التي قبله".',
        source: "رواه مسلم",
      },
      {
        text: "هو اليوم الذي نجى الله فيه موسى عليه السلام وقومه من فرعون وجنوده.",
        source: "",
      },
      {
        text: "يُستحب صيام يوم قبله أو بعده، وهو العاشر من شهر محرم.",
        source: "",
      },
    ],
  },
  arafah: {
    title: "🏔️ فضل يوم عرفة",
    content: [
      {
        text: 'قال النبي ﷺ: "صيام يوم عرفة أحتسب على الله أن يكفر السنة التي قبله والسنة التي بعده".',
        source: "رواه مسلم",
      },
      {
        text: 'قال النبي ﷺ: "ما من يوم أكثر من أن يعتق الله فيه عبداً من النار من يوم عرفة".',
        source: "رواه مسلم",
      },
      {
        text: "هو يوم إكمال الدين، وفيه نزل قوله تعالى: {اليوم أكملت لكم دينكم}.",
        source: "",
      },
    ],
  },
  tahajjud: {
    title: "🌙 فضل قيام الليل (التهجد)",
    content: [
      {
        text: "قال تعالى: {ومن الليل فتهجد به نافلة لك عسى أن يبعثك ربك مقاماً محموداً}.",
        source: "سورة الإسراء",
      },
      {
        text: 'قال النبي ﷺ: "أفضل الصلاة بعد الفريضة صلاة الليل".',
        source: "رواه مسلم",
      },
      {
        text: 'قال النبي ﷺ: "ينزل ربنا كل ليلة إلى السماء الدنيا فيقول: من يدعوني فأستجيب له".',
        source: "رواه البخاري ومسلم",
      },
    ],
  },
  quran: {
    title: "📖 فضل قراءة القرآن",
    content: [
      {
        text: 'قال النبي ﷺ: "من قرأ حرفاً من كتاب الله فله به حسنة، والحسنة بعشر أمثالها".',
        source: "رواه الترمذي",
      },
      {
        text: 'قال النبي ﷺ: "خيركم من تعلم القرآن وعلمه".',
        source: "رواه البخاري",
      },
      {
        text: 'قال النبي ﷺ: "يقال لصاحب القرآن: اقرأ وارتق ورتل كما كنت ترتل في الدنيا".',
        source: "رواه أبو داود والترمذي",
      },
    ],
  },
}

export default function Virtues() {
  const [selectedVirtue, setSelectedVirtue] = useState<keyof typeof virtuesData>("hajj")

  const virtuesList = [
    { key: "hajj", name: "العشر من ذي الحجة", icon: "📿" },
    { key: "ramadan", name: "شهر رمضان", icon: "🌙" },
    { key: "friday", name: "يوم الجمعة", icon: "🕌" },
    { key: "laylatul_qadr", name: "ليلة القدر", icon: "✨" },
    { key: "ashura", name: "يوم عاشوراء", icon: "🌟" },
    { key: "arafah", name: "يوم عرفة", icon: "🏔️" },
    { key: "tahajjud", name: "قيام الليل", icon: "🌙" },
    { key: "quran", name: "قراءة القرآن", icon: "📖" },
  ]

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">📿 الفضائل والأعمال المستحبة</h2>
        <p className="text-gray-600">تعرف على فضائل الأعمال الصالحة في الإسلام</p>
      </div>

      {/* قائمة الفضائل */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {virtuesList.map((virtue) => (
          <button
            key={virtue.key}
            onClick={() => setSelectedVirtue(virtue.key as keyof typeof virtuesData)}
            className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
              selectedVirtue === virtue.key
                ? "bg-emerald-600 text-white"
                : "bg-white border border-gray-200 hover:border-emerald-300"
            }`}
          >
            <div className="text-2xl mb-1">{virtue.icon}</div>
            <div className="text-sm font-medium">{virtue.name}</div>
          </button>
        ))}
      </div>

      {/* عرض الفضيلة المختارة */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
        <h3 className="text-2xl font-bold mb-6 text-amber-800 text-center">{virtuesData[selectedVirtue].title}</h3>

        <div className="space-y-4">
          {virtuesData[selectedVirtue].content.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-r-4 border-amber-500">
              <p className="text-lg leading-relaxed mb-2 text-gray-800">{item.text}</p>
              {item.source && <div className="text-sm text-amber-700 font-medium">📚 {item.source}</div>}
            </div>
          ))}
        </div>

        {/* رابط الفيديو إذا كان متوفراً */}
        {virtuesData[selectedVirtue].video && (
          <div className="mt-6 text-center">
            <a
              href={virtuesData[selectedVirtue].video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📺 مشاهدة الفيديو
            </a>
          </div>
        )}
      </div>

      {/* ملاحظة مهمة */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📝 ملاحظة مهمة:</h3>
        <p className="text-blue-700">
          هذه النصوص مستقاة من القرآن الكريم والسنة النبوية الصحيحة. للمزيد من التفاصيل والأحكام الفقهية، يُنصح بالرجوع
          إلى العلماء المختصين وكتب أهل العلم الموثوقة.
        </p>
      </div>
    </section>
  )
}
