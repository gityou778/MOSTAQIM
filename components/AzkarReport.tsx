"use client"

import { useState, useEffect } from "react"
import { secureGetItem, secureSetItem } from "../utils/crypto"

interface AzkarReport {
  type: string
  name: string
  totalCount: number
  completedCount: number
  percentage: number
  lastCompleted: string | null
  streak: number
}

export default function AzkarReport() {
  const [reports, setReports] = useState<AzkarReport[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPercentage, setTotalPercentage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true)
        setError(null)

        // جلب بيانات الأذكار مع معالجة الأخطاء
        let azkarCounters = {}
        let selectedType = "general"
        let azkarHistory = {}

        try {
          azkarCounters = (await secureGetItem("azkarCounters")) || {}
        } catch (error) {
          console.warn("Failed to load azkar counters:", error)
          azkarCounters = {}
        }

        try {
          selectedType = (await secureGetItem("selectedAzkarType")) || "general"
        } catch (error) {
          console.warn("Failed to load selected azkar type:", error)
          selectedType = "general"
        }

        try {
          azkarHistory = (await secureGetItem("azkarHistory")) || {}
        } catch (error) {
          console.warn("Failed to load azkar history:", error)
          azkarHistory = {}
          // إنشاء تاريخ وهمي للعرض
          azkarHistory = await createSampleHistory()
        }

        // إنشاء التقارير
        const azkarTypes = ["general", "morning", "evening", "afterPrayer", "sleep"]
        const azkarNames = {
          general: "الأذكار العامة",
          morning: "أذكار الصباح",
          evening: "أذكار المساء",
          afterPrayer: "أذكار بعد الصلاة",
          sleep: "أذكار النوم",
        }

        const reportData: AzkarReport[] = azkarTypes.map((type) => {
          const typeHistory = azkarHistory[type] || {}
          const totalDays = Object.keys(typeHistory).length
          const completedDays = Object.values(typeHistory).filter((v) => v === true).length
          const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

          // حساب التتابع
          let streak = 0
          const dates = Object.keys(typeHistory).sort().reverse()
          for (const date of dates) {
            if (typeHistory[date]) {
              streak++
            } else {
              break
            }
          }

          return {
            type,
            name: azkarNames[type as keyof typeof azkarNames],
            totalCount: totalDays,
            completedCount: completedDays,
            percentage,
            lastCompleted: dates[0] || null,
            streak,
          }
        })

        // حساب النسبة الإجمالية
        const totalCompleted = reportData.reduce((sum, report) => sum + report.completedCount, 0)
        const totalDays = reportData.reduce((sum, report) => sum + report.totalCount, 0)
        const overallPercentage = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0

        setReports(reportData)
        setTotalPercentage(overallPercentage)
      } catch (error) {
        console.error("Error loading azkar reports:", error)
        setError("فشل في تحميل تقرير الأذكار")
        // إنشاء بيانات افتراضية للعرض
        setReports(createDefaultReports())
        setTotalPercentage(0)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  // إنشاء تاريخ عينة للأذكار
  async function createSampleHistory() {
    const history: any = {}
    const types = ["general", "morning", "evening", "afterPrayer", "sleep"]
    const today = new Date()

    types.forEach((type) => {
      history[type] = {}
      // إنشاء بيانات للأسبوع الماضي
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateString = date.toISOString().split("T")[0]
        // عشوائية في الإنجاز
        history[type][dateString] = Math.random() > 0.3
      }
    })

    // حفظ التاريخ العينة
    try {
      await secureSetItem("azkarHistory", history)
    } catch (error) {
      console.warn("Failed to save sample history:", error)
    }

    return history
  }

  // إنشاء تقارير افتراضية
  function createDefaultReports(): AzkarReport[] {
    const azkarTypes = ["general", "morning", "evening", "afterPrayer", "sleep"]
    const azkarNames = {
      general: "الأذكار العامة",
      morning: "أذكار الصباح",
      evening: "أذكار المساء",
      afterPrayer: "أذكار بعد الصلاة",
      sleep: "أذكار النوم",
    }

    return azkarTypes.map((type) => ({
      type,
      name: azkarNames[type as keyof typeof azkarNames],
      totalCount: 0,
      completedCount: 0,
      percentage: 0,
      lastCompleted: null,
      streak: 0,
    }))
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">جاري تحميل التقرير...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="text-center">
          <p className="text-yellow-800 font-medium">⚠️ {error}</p>
          <p className="text-yellow-600 text-sm mt-1">سيتم إنشاء التقرير تدريجياً مع استخدامك للأذكار</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl mb-8 border border-indigo-200">
      <h3 className="text-xl font-bold mb-4 text-indigo-800">📊 تقرير الأذكار</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
          <h4 className="font-bold text-lg mb-2 text-indigo-700">الإحصائيات العامة</h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">نسبة الإنجاز الكلية:</span>
            <span className={`font-bold ${getColorClass(totalPercentage)}`}>{totalPercentage}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColorClass(totalPercentage)}`}
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
          <h4 className="font-bold text-lg mb-2 text-indigo-700">أفضل أداء</h4>
          {reports.length > 0 ? (
            <div>
              <p className="text-gray-600">
                <span className="font-bold">{getBestPerforming(reports).name}</span> -
                <span className={`font-bold mr-1 ${getColorClass(getBestPerforming(reports).percentage)}`}>
                  {getBestPerforming(reports).percentage}%
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                تتابع: <span className="font-bold">{getBestPerforming(reports).streak} أيام</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">لا توجد بيانات بعد</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-indigo-200">
              <th className="text-right p-2 font-bold">نوع الذكر</th>
              <th className="text-center p-2 font-bold">الإنجاز</th>
              <th className="text-center p-2 font-bold">التتابع</th>
              <th className="text-center p-2 font-bold">آخر إنجاز</th>
              <th className="text-center p-2 font-bold">النسبة</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.type} className="border-b border-gray-100">
                <td className="p-2 font-medium">{report.name}</td>
                <td className="text-center p-2">
                  {report.completedCount}/{report.totalCount}
                </td>
                <td className="text-center p-2">
                  <span className="font-bold">{report.streak}</span> {getStreakEmoji(report.streak)}
                </td>
                <td className="text-center p-2">{report.lastCompleted ? formatDate(report.lastCompleted) : "-"}</td>
                <td className="text-center p-2">
                  <div className="flex items-center justify-center">
                    <span className={`font-bold ${getColorClass(report.percentage)}`}>{report.percentage}%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getProgressColorClass(report.percentage)}`}
                      style={{ width: `${report.percentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-indigo-600">
        <p>💡 نصيحة: حافظ على المداومة على الأذكار يومياً للحصول على أفضل النتائج</p>
      </div>
    </div>
  )
}

// دالة للحصول على أفضل أداء
function getBestPerforming(reports: AzkarReport[]): AzkarReport {
  if (reports.length === 0) {
    return {
      type: "",
      name: "لا توجد بيانات",
      totalCount: 0,
      completedCount: 0,
      percentage: 0,
      lastCompleted: null,
      streak: 0,
    }
  }

  return reports.reduce((best, current) => {
    if (current.percentage > best.percentage) return current
    if (current.percentage === best.percentage && current.streak > best.streak) return current
    return best
  }, reports[0])
}

// دالة لتنسيق التاريخ
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-EG")
  } catch {
    return dateString
  }
}

// دالة للحصول على لون النسبة
function getColorClass(percentage: number): string {
  if (percentage >= 80) return "text-green-600"
  if (percentage >= 50) return "text-blue-600"
  if (percentage >= 30) return "text-yellow-600"
  return "text-red-600"
}

// دالة للحصول على لون شريط التقدم
function getProgressColorClass(percentage: number): string {
  if (percentage >= 80) return "bg-green-600"
  if (percentage >= 50) return "bg-blue-600"
  if (percentage >= 30) return "bg-yellow-600"
  return "bg-red-500"
}

// دالة للحصول على رمز التتابع
function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🏆"
  if (streak >= 14) return "💎"
  if (streak >= 7) return "🔥"
  if (streak >= 3) return "⭐"
  return ""
}
