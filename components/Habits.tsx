"use client"

import { useState, useEffect } from "react"

interface Habit {
  id: number
  name: string
  icon: string
  streak: number
  lastCompleted: string | null
  completedToday: boolean
  weeklyHistory: { [date: string]: boolean } // تاريخ اليوم: هل تم إنجازه أم لا
  createdAt: string
}

const defaultHabits = [
  { name: "قراءة القرآن", icon: "📖" },
  { name: "الصلاة في وقتها", icon: "🕌" },
  { name: "أذكار الصباح", icon: "🌅" },
  { name: "أذكار المساء", icon: "🌇" },
  { name: "ممارسة الرياضة", icon: "🏃‍♂️" },
  { name: "شرب الماء", icon: "💧" },
  { name: "القراءة", icon: "📚" },
  { name: "التأمل", icon: "🧘‍♂️" },
  { name: "النوم مبكراً", icon: "😴" },
  { name: "الاستيقاظ مبكراً", icon: "⏰" },
]

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== "undefined") {
      const savedHabits = localStorage.getItem("habits")
      return savedHabits ? JSON.parse(savedHabits) : []
    }
    return []
  })
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitIcon, setNewHabitIcon] = useState("⭐")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("habits", JSON.stringify(habits))
    }
  }, [habits])

  // دالة للحصول على تاريخ اليوم بصيغة YYYY-MM-DD
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]
  }

  // دالة للحصول على تواريخ الأسبوع الحالي
  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = الأحد، 1 = الاثنين، إلخ
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - currentDay) // بداية الأسبوع (الأحد)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date.toISOString().split("T")[0])
    }
    return weekDates
  }

  // دالة للحصول على أسماء أيام الأسبوع
  const getDayNames = () => {
    return ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
  }

  const addHabit = (name: string, icon: string) => {
    const newHabit: Habit = {
      id: Date.now(),
      name,
      icon,
      streak: 0,
      lastCompleted: null,
      completedToday: false,
      weeklyHistory: {},
      createdAt: getTodayDate(),
    }
    setHabits([...habits, newHabit])
  }

  const addCustomHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName, newHabitIcon)
      setNewHabitName("")
      setNewHabitIcon("⭐")
      setShowAddForm(false)
    }
  }

  const toggleHabit = (id: number) => {
    const today = getTodayDate()
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const wasCompletedToday = habit.weeklyHistory[today] || false
          const newWeeklyHistory = {
            ...habit.weeklyHistory,
            [today]: !wasCompletedToday,
          }

          // حساب السلسلة الجديدة
          let newStreak = habit.streak
          if (!wasCompletedToday) {
            // إذا تم إكمال العادة اليوم
            newStreak = habit.streak + 1
          } else {
            // إذا تم إلغاء إكمال العادة
            newStreak = Math.max(0, habit.streak - 1)
          }

          return {
            ...habit,
            completedToday: !wasCompletedToday,
            lastCompleted: !wasCompletedToday ? today : null,
            streak: newStreak,
            weeklyHistory: newWeeklyHistory,
          }
        }
        return habit
      }),
    )
  }

  const deleteHabit = (id: number) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-blue-600"
    if (streak >= 7) return "text-green-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return "🏆"
    if (streak >= 14) return "💎"
    if (streak >= 7) return "🔥"
    if (streak >= 3) return "⭐"
    return ""
  }

  // حساب إحصائيات الأسبوع
  const getWeeklyStats = () => {
    const weekDates = getCurrentWeekDates()
    const today = getTodayDate()

    let totalPossible = 0
    let totalCompleted = 0
    let todayCompleted = 0
    const todayTotal = habits.length

    habits.forEach((habit) => {
      weekDates.forEach((date) => {
        if (date <= today) {
          // فقط الأيام التي مرت أو اليوم الحالي
          totalPossible++
          if (habit.weeklyHistory[date]) {
            totalCompleted++
          }
        }
      })

      if (habit.weeklyHistory[today]) {
        todayCompleted++
      }
    })

    return {
      weeklyPercentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      todayPercentage: todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0,
      totalCompleted,
      totalPossible,
      todayCompleted,
      todayTotal,
    }
  }

  const stats = getWeeklyStats()

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🔄 العادات اليومية</h2>
        <p className="text-gray-600">بناء عادات إيجابية لحياة أفضل</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">
            {stats.todayCompleted}/{stats.todayTotal}
          </div>
          <div className="text-sm text-blue-600">اليوم</div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{stats.todayPercentage}%</div>
          <div className="text-sm text-green-600">نسبة اليوم</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">
            {stats.totalCompleted}/{stats.totalPossible}
          </div>
          <div className="text-sm text-purple-600">هذا الأسبوع</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-800">{stats.weeklyPercentage}%</div>
          <div className="text-sm text-yellow-600">نسبة الأسبوع</div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowWeeklyReport(!showWeeklyReport)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          📊 {showWeeklyReport ? "إخفاء" : "عرض"} التقرير الأسبوعي
        </button>
      </div>

      {/* التقرير الأسبوعي */}
      {showWeeklyReport && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 border border-indigo-200">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">📊 التقرير الأسبوعي</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-indigo-200">
                  <th className="text-right p-2 font-bold">العادة</th>
                  {getDayNames().map((day, index) => (
                    <th key={index} className="text-center p-2 font-bold">
                      {day}
                    </th>
                  ))}
                  <th className="text-center p-2 font-bold">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => {
                  const weekDates = getCurrentWeekDates()
                  const completedDays = weekDates.filter((date) => habit.weeklyHistory[date]).length
                  const percentage = Math.round((completedDays / 7) * 100)

                  return (
                    <tr key={habit.id} className="border-b border-gray-100">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span>{habit.icon}</span>
                          <span className="font-medium">{habit.name}</span>
                        </div>
                      </td>
                      {weekDates.map((date, index) => (
                        <td key={index} className="text-center p-2">
                          {habit.weeklyHistory[date] ? (
                            <span className="text-green-600 text-lg">✅</span>
                          ) : (
                            <span className="text-gray-300 text-lg">⭕</span>
                          )}
                        </td>
                      ))}
                      <td className="text-center p-2">
                        <span
                          className={`font-bold ${percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"}`}
                        >
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* إضافة عادة جديدة */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">➕ إضافة عادة جديدة</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {showAddForm ? "إلغاء" : "عادة مخصصة"}
          </button>
        </div>

        {/* العادات المقترحة */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {defaultHabits.map((habit, index) => (
            <button
              key={index}
              onClick={() => addHabit(habit.name, habit.icon)}
              className="bg-white hover:bg-blue-50 p-3 rounded-lg border border-gray-200 text-center transition-colors"
            >
              <div className="text-2xl mb-1">{habit.icon}</div>
              <div className="text-sm font-medium">{habit.name}</div>
            </button>
          ))}
        </div>

        {/* نموذج العادة المخصصة */}
        {showAddForm && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                placeholder="🎯"
                className="w-16 p-2 border rounded text-center text-xl"
              />
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="اسم العادة..."
                className="flex-1 p-2 border rounded"
                onKeyPress={(e) => e.key === "Enter" && addCustomHabit()}
              />
              <button onClick={addCustomHabit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                إضافة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* قائمة العادات */}
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">ابدأ رحلتك مع العادات الإيجابية</h3>
          <p className="text-gray-500">اختر عادة من القائمة أعلاه لتبدأ</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const today = getTodayDate()
            const completedToday = habit.weeklyHistory[today] || false

            return (
              <div
                key={habit.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  completedToday ? "bg-green-50 border-green-300" : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <button onClick={() => deleteHabit(habit.id)} className="text-red-500 hover:text-red-700 text-sm">
                    🗑️
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${getStreakColor(habit.streak)}`}>{habit.streak}</span>
                    <span className="text-sm text-gray-600">يوم متتالي</span>
                    <span className="text-lg">{getStreakBadge(habit.streak)}</span>
                  </div>
                </div>

                {/* عرض آخر 7 أيام */}
                <div className="flex justify-center gap-1 mb-3">
                  {getCurrentWeekDates().map((date, index) => {
                    const isCompleted = habit.weeklyHistory[date]
                    const isToday = date === today
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isToday ? "ring-2 ring-blue-400" : ""
                        } ${isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {isCompleted ? "✓" : "○"}
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    completedToday
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {completedToday ? "✅ تم اليوم" : "⭕ لم يتم بعد"}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* نصائح للعادات */}
      <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">💡 نصائح لبناء العادات:</h3>
        <ul className="text-amber-700 space-y-1 text-sm">
          <li>• ابدأ بعادة واحدة أو اثنتين فقط</li>
          <li>• اجعل العادة بسيطة في البداية (مثل قراءة صفحة واحدة)</li>
          <li>• اربط العادة الجديدة بعادة موجودة (مثل الذكر بعد الصلاة)</li>
          <li>• لا تيأس إذا فاتك يوم، المهم أن تعود في اليوم التالي</li>
          <li>• احتفل بإنجازاتك الصغيرة</li>
        </ul>
      </div>
    </section>
  )
}
