"use client"

import { useState, useEffect } from "react"

const surahs = [
  { number: 1, name: "الفاتحة", verses: 7, type: "مكية" },
  { number: 2, name: "البقرة", verses: 286, type: "مدنية" },
  { number: 3, name: "آل عمران", verses: 200, type: "مدنية" },
  { number: 4, name: "النساء", verses: 176, type: "مدنية" },
  { number: 5, name: "المائدة", verses: 120, type: "مدنية" },
  { number: 6, name: "الأنعام", verses: 165, type: "مكية" },
  { number: 7, name: "الأعراف", verses: 206, type: "مكية" },
  { number: 8, name: "الأنفال", verses: 75, type: "مدنية" },
  { number: 9, name: "التوبة", verses: 129, type: "مدنية" },
  { number: 10, name: "يونس", verses: 109, type: "مكية" },
  { number: 11, name: "هود", verses: 123, type: "مكية" },
  { number: 12, name: "يوسف", verses: 111, type: "مكية" },
  { number: 13, name: "الرعد", verses: 43, type: "مدنية" },
  { number: 14, name: "إبراهيم", verses: 52, type: "مكية" },
  { number: 15, name: "الحجر", verses: 99, type: "مكية" },
  { number: 16, name: "النحل", verses: 128, type: "مكية" },
  { number: 17, name: "الإسراء", verses: 111, type: "مكية" },
  { number: 18, name: "الكهف", verses: 110, type: "مكية" },
  { number: 19, name: "مريم", verses: 98, type: "مكية" },
  { number: 20, name: "طه", verses: 135, type: "مكية" },
  { number: 21, name: "الأنبياء", verses: 112, type: "مكية" },
  { number: 22, name: "الحج", verses: 78, type: "مدنية" },
  { number: 23, name: "المؤمنون", verses: 118, type: "مكية" },
  { number: 24, name: "النور", verses: 64, type: "مدنية" },
  { number: 25, name: "الفرقان", verses: 77, type: "مكية" },
  { number: 26, name: "الشعراء", verses: 227, type: "مكية" },
  { number: 27, name: "النمل", verses: 93, type: "مكية" },
  { number: 28, name: "القصص", verses: 88, type: "مكية" },
  { number: 29, name: "العنكبوت", verses: 69, type: "مكية" },
  { number: 30, name: "الروم", verses: 60, type: "مكية" },
  { number: 31, name: "لقمان", verses: 34, type: "مكية" },
  { number: 32, name: "السجدة", verses: 30, type: "مكية" },
  { number: 33, name: "الأحزاب", verses: 73, type: "مدنية" },
  { number: 34, name: "سبأ", verses: 54, type: "مكية" },
  { number: 35, name: "فاطر", verses: 45, type: "مكية" },
  { number: 36, name: "يس", verses: 83, type: "مكية" },
  { number: 37, name: "الصافات", verses: 182, type: "مكية" },
  { number: 38, name: "ص", verses: 88, type: "مكية" },
  { number: 39, name: "الزمر", verses: 75, type: "مكية" },
  { number: 40, name: "غافر", verses: 85, type: "مكية" },
  { number: 41, name: "فصلت", verses: 54, type: "مكية" },
  { number: 42, name: "الشورى", verses: 53, type: "مكية" },
  { number: 43, name: "الزخرف", verses: 89, type: "مكية" },
  { number: 44, name: "الدخان", verses: 59, type: "مكية" },
  { number: 45, name: "الجاثية", verses: 37, type: "مكية" },
  { number: 46, name: "الأحقاف", verses: 35, type: "مكية" },
  { number: 47, name: "محمد", verses: 38, type: "مدنية" },
  { number: 48, name: "الفتح", verses: 29, type: "مدنية" },
  { number: 49, name: "الحجرات", verses: 18, type: "مدنية" },
  { number: 50, name: "ق", verses: 45, type: "مكية" },
  { number: 51, name: "الذاريات", verses: 60, type: "مكية" },
  { number: 52, name: "الطور", verses: 49, type: "مكية" },
  { number: 53, name: "النجم", verses: 62, type: "مكية" },
  { number: 54, name: "القمر", verses: 55, type: "مكية" },
  { number: 55, name: "الرحمن", verses: 78, type: "مدنية" },
  { number: 56, name: "الواقعة", verses: 96, type: "مكية" },
  { number: 57, name: "الحديد", verses: 29, type: "مدنية" },
  { number: 58, name: "المجادلة", verses: 22, type: "مدنية" },
  { number: 59, name: "الحشر", verses: 24, type: "مدنية" },
  { number: 60, name: "الممتحنة", verses: 13, type: "مدنية" },
  { number: 61, name: "الصف", verses: 14, type: "مدنية" },
  { number: 62, name: "الجمعة", verses: 11, type: "مدنية" },
  { number: 63, name: "المنافقون", verses: 11, type: "مدنية" },
  { number: 64, name: "التغابن", verses: 18, type: "مدنية" },
  { number: 65, name: "الطلاق", verses: 12, type: "مدنية" },
  { number: 66, name: "التحريم", verses: 12, type: "مدنية" },
  { number: 67, name: "الملك", verses: 30, type: "مكية" },
  { number: 68, name: "القلم", verses: 52, type: "مكية" },
  { number: 69, name: "الحاقة", verses: 52, type: "مكية" },
  { number: 70, name: "المعارج", verses: 44, type: "مكية" },
  { number: 71, name: "نوح", verses: 28, type: "مكية" },
  { number: 72, name: "الجن", verses: 28, type: "مكية" },
  { number: 73, name: "المزمل", verses: 20, type: "مكية" },
  { number: 74, name: "المدثر", verses: 56, type: "مكية" },
  { number: 75, name: "القيامة", verses: 40, type: "مكية" },
  { number: 76, name: "الإنسان", verses: 31, type: "مدنية" },
  { number: 77, name: "المرسلات", verses: 50, type: "مكية" },
  { number: 78, name: "النبأ", verses: 40, type: "مكية" },
  { number: 79, name: "النازعات", verses: 46, type: "مكية" },
  { number: 80, name: "عبس", verses: 42, type: "مكية" },
  { number: 81, name: "التكوير", verses: 29, type: "مكية" },
  { number: 82, name: "الانفطار", verses: 19, type: "مكية" },
  { number: 83, name: "المطففين", verses: 36, type: "مكية" },
  { number: 84, name: "الانشقاق", verses: 25, type: "مكية" },
  { number: 85, name: "البروج", verses: 22, type: "مكية" },
  { number: 86, name: "الطارق", verses: 17, type: "مكية" },
  { number: 87, name: "الأعلى", verses: 19, type: "مكية" },
  { number: 88, name: "الغاشية", verses: 26, type: "مكية" },
  { number: 89, name: "الفجر", verses: 30, type: "مكية" },
  { number: 90, name: "البلد", verses: 20, type: "مكية" },
  { number: 91, name: "الشمس", verses: 15, type: "مكية" },
  { number: 92, name: "الليل", verses: 21, type: "مكية" },
  { number: 93, name: "الضحى", verses: 11, type: "مكية" },
  { number: 94, name: "الشرح", verses: 8, type: "مكية" },
  { number: 95, name: "التين", verses: 8, type: "مكية" },
  { number: 96, name: "العلق", verses: 19, type: "مكية" },
  { number: 97, name: "القدر", verses: 5, type: "مكية" },
  { number: 98, name: "البينة", verses: 8, type: "مدنية" },
  { number: 99, name: "الزلزلة", verses: 8, type: "مدنية" },
  { number: 100, name: "العاديات", verses: 11, type: "مكية" },
  { number: 101, name: "القارعة", verses: 11, type: "مكية" },
  { number: 102, name: "التكاثر", verses: 8, type: "مكية" },
  { number: 103, name: "العصر", verses: 3, type: "مكية" },
  { number: 104, name: "الهمزة", verses: 9, type: "مكية" },
  { number: 105, name: "الفيل", verses: 5, type: "مكية" },
  { number: 106, name: "قريش", verses: 4, type: "مكية" },
  { number: 107, name: "الماعون", verses: 7, type: "مكية" },
  { number: 108, name: "الكوثر", verses: 3, type: "مكية" },
  { number: 109, name: "الكافرون", verses: 6, type: "مكية" },
  { number: 110, name: "النصر", verses: 3, type: "مدنية" },
  { number: 111, name: "المسد", verses: 5, type: "مكية" },
  { number: 112, name: "الإخلاص", verses: 4, type: "مكية" },
  { number: 113, name: "الفلق", verses: 5, type: "مكية" },
  { number: 114, name: "الناس", verses: 6, type: "مكية" },
]

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null)
  const [fontSize, setFontSize] = useState(24)
  const [searchTerm, setSearchTerm] = useState("")
  const [surahText, setSurahText] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredSurahs = surahs.filter(
    (surah) => surah.name.includes(searchTerm) || surah.number.toString().includes(searchTerm) || searchTerm === "",
  )

  // دالة لجلب نص السورة من API
  const fetchSurahText = async (surahNumber: number) => {
    setLoading(true)
    setError(null)
    setSurahText([])

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)

      if (!response.ok) {
        throw new Error("فشل في تحميل السورة")
      }

      const data = await response.json()

      if (data.status === "OK" && data.data && data.data.ayahs) {
        const verses = data.data.ayahs.map((ayah: any) => ayah.text)
        setSurahText(verses)
      } else {
        throw new Error("البيانات غير صحيحة")
      }
    } catch (err) {
      console.error("Error fetching surah:", err)
      setError("عذراً، حدث خطأ في تحميل السورة. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  // تحميل السورة عند اختيارها
  useEffect(() => {
    if (selectedSurah) {
      fetchSurahText(selectedSurah)
    }
  }, [selectedSurah])

  // دالة لتنسيق النص مثل المصحف
  const formatQuranText = (verses: string[], surahNumber: number) => {
    if (!verses.length) return ""

    // إضافة البسملة إذا لم تكن سورة التوبة
    let formattedText = ""

    if (surahNumber !== 9 && surahNumber !== 1) {
      formattedText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ "
    }

    // دمج جميع الآيات مع أرقامها
    verses.forEach((verse, index) => {
      // إزالة البسملة من بداية الآية إذا كانت موجودة
      const cleanVerse = verse.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, "")

      formattedText += cleanVerse

      // إضافة رقم الآية
      formattedText += ` ﴿${index + 1}﴾ `
    })

    return formattedText.trim()
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">📖 القرآن الكريم</h2>
        <p className="text-gray-600">اقرأ كتاب الله العزيز - جميع السور الـ 114</p>
      </div>

      {/* البحث والتحكم */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ابحث عن سورة بالاسم أو الرقم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">حجم الخط:</label>
            <input
              type="range"
              min="18"
              max="36"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-12">{fontSize}px</span>
          </div>
        </div>

        {/* اختيار السورة */}
        <select
          value={selectedSurah || ""}
          onChange={(e) => setSelectedSurah(Number(e.target.value) || null)}
          className="w-full p-3 border rounded-lg text-lg"
        >
          <option value="">اختر سورة للقراءة...</option>
          {filteredSurahs.map((surah) => (
            <option key={surah.number} value={surah.number}>
              {surah.number}. سورة {surah.name} ({surah.verses} آية - {surah.type})
            </option>
          ))}
        </select>
      </div>

      {/* عرض السورة */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* قائمة السور */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold mb-4">📋 فهرس السور</h3>
          <div className="bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah.number)}
                className={`w-full p-3 text-right border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedSurah === surah.number ? "bg-emerald-50 border-emerald-200" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <div className="font-bold text-sm">
                      {surah.number}. {surah.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {surah.verses} آية • {surah.type}
                    </div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold">
                    {surah.number}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* عرض نص السورة */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-600 mb-2">جاري تحميل السورة...</h3>
              <p className="text-gray-500">يرجى الانتظار</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-red-800 mb-2">خطأ في التحميل</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => selectedSurah && fetchSurahText(selectedSurah)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : selectedSurah && surahText.length > 0 ? (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-8">
              {/* عنوان السورة */}
              <div className="text-center mb-8">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg inline-block mb-4">
                  <h3 className="text-2xl font-bold">سورة {surahs.find((s) => s.number === selectedSurah)?.name}</h3>
                </div>
                <p className="text-gray-600">
                  {surahs.find((s) => s.number === selectedSurah)?.verses} آية •{" "}
                  {surahs.find((s) => s.number === selectedSurah)?.type}
                </p>
              </div>

              {/* البسملة منفصلة */}
              {selectedSurah !== 9 && (
                <div className="text-center mb-8">
                  <p
                    className="text-center leading-loose"
                    style={{
                      fontSize: `${fontSize + 4}px`,
                      fontFamily: "'Amiri', 'Traditional Arabic', 'Tahoma', serif",
                      lineHeight: "2.5",
                      color: "#1f2937",
                      fontWeight: "bold",
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* نص السورة بتنسيق المصحف */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-300">
                <div
                  className="text-justify leading-loose"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: "'Amiri', 'Traditional Arabic', 'Tahoma', serif",
                    lineHeight: "2.8",
                    color: "#1f2937",
                    direction: "rtl",
                    textAlign: "justify",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatQuranText(surahText, selectedSurah).replace(
                      /﴿(\d+)﴾/g,
                      '<span style="color: #059669; font-weight: bold; background: #d1fae5; padding: 2px 6px; border-radius: 50%; margin: 0 4px; font-size: 0.8em;">$1</span>',
                    ),
                  }}
                />
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  ⬆️ العودة للأعلى
                </button>
              </div>
            </div>
          ) : selectedSurah ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                سورة {surahs.find((s) => s.number === selectedSurah)?.name}
              </h3>
              <p className="text-yellow-700">اضغط على زر إعادة المحاولة لتحميل السورة</p>
              <button
                onClick={() => fetchSurahText(selectedSurah)}
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                تحميل السورة
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🕌</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">اختر سورة للقراءة</h3>
              <p className="text-gray-500">اختر سورة من القائمة على اليسار أو من القائمة المنسدلة أعلاه</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>📊 إجمالي السور: {surahs.length}</p>
                <p>🔍 نتائج البحث: {filteredSurahs.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📚 معلومات مهمة:</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• يحتوي التطبيق على جميع سور القرآن الكريم الـ 114</li>
          <li>• النصوص معروضة بتنسيق المصحف التقليدي مع أرقام الآيات</li>
          <li>• يمكنك البحث عن السور بالاسم أو الرقم</li>
          <li>• يمكنك تكبير وتصغير حجم الخط حسب راحتك</li>
          <li>• يتم تحميل السور من الإنترنت، تأكد من اتصالك بالشبكة</li>
        </ul>
      </div>
    </section>
  )
}
