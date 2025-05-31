"use client"

import { useState, useEffect, useCallback } from "react"
import { secureGetItem, secureSetItem } from "@/utils/crypto"
import { sanitizeInput } from "@/utils/sanitize"

interface Task {
  id: number
  text: string
  completed: boolean
  type: "daily" | "longterm"
  createdAt: Date
}

const motivationalMessages = [
  "يلا يا بطل! 💪",
  "توكل على الله وابدأ! 🚀",
  "أنت قادر على ذلك! ⭐",
  "بسم الله نبدأ! 🌟",
  "الله معك، انطلق! 🎯",
  "يلا نشوف همتك! 🔥",
  "ثق بنفسك وابدأ! 💎",
  "بإذن الله ستنجح! 🌈",
]

const congratulationMessages = [
  "ماشاء الله عليك! 🎉",
  "أحسنت، يلا للمهمة التالية! 👏",
  "بارك الله فيك! 🌟",
  "ممتاز! استمر كده! 🚀",
  "الله يبارك فيك! 💫",
  "رائع! أنت في الطريق الصحيح! ⭐",
  "تسلم إيدك! يلا كمل! 🎯",
  "جزاك الله خيراً! 🌸",
]

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskInput, setTaskInput] = useState("")
  const [taskType, setTaskType] = useState<"daily" | "longterm">("daily")
  const [showMotivation, setShowMotivation] = useState<{ taskId: number; message: string } | null>(null)
  const [showCongratulation, setShowCongratulation] = useState<{ taskId: number; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)

  // تحميل المهام بطريقة آمنة
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      setSaveError(null)

      const savedTasks = await secureGetItem("tasks")

      if (savedTasks && Array.isArray(savedTasks)) {
        // التحقق من صحة كل مهمة
        const validTasks = savedTasks.filter((task: any) => {
          try {
            // التحقق من البنية الأساسية
            if (!task || typeof task !== "object") return false

            // التحقق من الخصائص المطلوبة
            if (!task.hasOwnProperty("id") || !task.hasOwnProperty("text") || !task.hasOwnProperty("completed")) {
              return false
            }

            // تنظيف النص
            task.text = sanitizeInput(task.text)

            // التحقق من طول النص
            if (!task.text || task.text.length === 0 || task.text.length > 200) {
              return false
            }

            // التحقق من النوع
            if (!["daily", "longterm"].includes(task.type)) {
              task.type = "daily"
            }

            // التحقق من التاريخ
            if (task.createdAt) {
              task.createdAt = new Date(task.createdAt)
            } else {
              task.createdAt = new Date()
            }

            return true
          } catch (error) {
            console.warn("Invalid task found and removed:", error)
            return false
          }
        })

        setTasks(validTasks)
      } else {
        // إذا لم توجد مهام، ابدأ بقائمة فارغة
        setTasks([])
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
      setSaveError("فشل في تحميل المهام - سيتم إنشاء قائمة جديدة")
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // حفظ المهام بطريقة آمنة
  const saveTasks = useCallback(async (tasksToSave: Task[]) => {
    try {
      const success = await secureSetItem("tasks", tasksToSave)
      if (!success) {
        setSaveError("فشل في حفظ المهام")
      } else {
        setSaveError(null)
      }
    } catch (error) {
      console.error("Error saving tasks:", error)
      setSaveError("خطأ في حفظ البيانات")
    }
  }, [])

  // تحميل المهام عند بدء التطبيق
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // حفظ المهام عند تغييرها
  useEffect(() => {
    if (!isLoading && tasks.length >= 0) {
      saveTasks(tasks)
    }
  }, [tasks, isLoading, saveTasks])

  const addTask = useCallback(() => {
    try {
      const cleanText = sanitizeInput(taskInput)

      // التحقق من صحة النص
      if (!cleanText) {
        alert("يرجى كتابة نص صالح للمهمة")
        return
      }

      if (cleanText.length < 2) {
        alert("نص المهمة قصير جداً (الحد الأدنى: حرفان)")
        return
      }

      if (cleanText.length > 200) {
        alert("نص المهمة طويل جداً (الحد الأقصى: 200 حرف)")
        return
      }

      // التحقق من عدد المهام
      if (tasks.length >= 100) {
        alert("لا يمكن إضافة أكثر من 100 مهمة")
        return
      }

      // التحقق من تكرار المهمة
      const isDuplicate = tasks.some(
        (task) => task.text.toLowerCase() === cleanText.toLowerCase() && task.type === taskType,
      )

      if (isDuplicate) {
        alert("هذه المهمة موجودة بالفعل")
        return
      }

      const newTask: Task = {
        id: Date.now() + Math.random(), // إضافة عشوائية لتجنب التكرار
        text: cleanText,
        completed: false,
        type: taskType,
        createdAt: new Date(),
      }

      setTasks((prevTasks) => [newTask, ...prevTasks])
      setTaskInput("")

      // عرض رسالة تحفيزية
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      setShowMotivation({ taskId: newTask.id, message: randomMessage })
      setTimeout(() => setShowMotivation(null), 3000)
    } catch (error) {
      console.error("Error adding task:", error)
      alert("حدث خطأ في إضافة المهمة")
    }
  }, [taskInput, taskType, tasks])

  const toggleTask = useCallback((id: number) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === id) {
            const updatedTask = { ...task, completed: !task.completed }

            // إذا تم إكمال المهمة، عرض رسالة تهنئة
            if (updatedTask.completed) {
              const randomMessage = congratulationMessages[Math.floor(Math.random() * congratulationMessages.length)]
              setShowCongratulation({ taskId: id, message: randomMessage })
              setTimeout(() => setShowCongratulation(null), 4000)
            }

            return updatedTask
          }
          return task
        }),
      )
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }, [])

  const deleteTask = useCallback((id: number) => {
    try {
      if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }, [])

  const dailyTasks = tasks.filter((task) => task.type === "daily")
  const longtermTasks = tasks.filter((task) => task.type === "longterm")

  if (isLoading) {
    return (
      <section>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المهام...</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">📝 إدارة المهام</h2>
        <p className="text-gray-600">نظم مهامك اليومية وأهدافك طويلة المدى</p>
        {saveError && (
          <div className="mt-2 text-yellow-600 text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
            ⚠️ {saveError}
          </div>
        )}
      </div>

      {/* رسائل التحفيز والتهنئة */}
      {showMotivation && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {showMotivation.message}
        </div>
      )}

      {showCongratulation && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {showCongratulation.message}
        </div>
      )}

      {/* إضافة مهمة جديدة - تصميم محسن للموبايل */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-xl mb-8 border border-emerald-200">
        <h3 className="text-xl font-bold mb-4">➕ إضافة مهمة جديدة</h3>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <button
            onClick={() => setTaskType("daily")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              taskType === "daily" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📅 مهام يومية
          </button>
          <button
            onClick={() => setTaskType("longterm")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              taskType === "longterm" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🎯 أهداف طويلة المدى
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder={
              taskType === "daily" ? "مثال: قراءة 10 صفحات من كتاب..." : "مثال: تعلم لغة جديدة خلال 6 أشهر..."
            }
            className="flex-1 p-3 border rounded-lg text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            maxLength={200}
            disabled={tasks.length >= 100}
          />
          <button
            onClick={addTask}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
            disabled={!taskInput.trim() || tasks.length >= 100}
          >
            أضف
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>المهام: {tasks.length}/100</span>
          <span>{taskInput.length}/200</span>
        </div>
      </div>

      {/* المهام اليومية والأهداف طويلة المدى */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-emerald-800">📅 المهام اليومية ({dailyTasks.length})</h3>
          <div className="space-y-3">
            {dailyTasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-500">لا توجد مهام يومية بعد</p>
                <p className="text-sm text-gray-400">أضف مهمة جديدة لتبدأ</p>
              </div>
            ) : (
              dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      className={`flex-1 break-words ${
                        task.completed ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors flex-shrink-0"
                      aria-label="حذف المهمة"
                      title="حذف المهمة"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    تم الإنشاء: {new Date(task.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-800">🎯 الأهداف طويلة المدى ({longtermTasks.length})</h3>
          <div className="space-y-3">
            {longtermTasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-500">لا توجد أهداف طويلة المدى بعد</p>
                <p className="text-sm text-gray-400">حدد هدفاً طويل المدى لتحقيقه</p>
              </div>
            ) : (
              longtermTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      className={`flex-1 break-words ${
                        task.completed ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors flex-shrink-0"
                      aria-label="حذف المهمة"
                      title="حذف المهمة"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    تم الإنشاء: {new Date(task.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-emerald-800">{dailyTasks.filter((t) => t.completed).length}</div>
          <div className="text-sm text-emerald-600">مهام يومية مكتملة</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-800">{longtermTasks.filter((t) => t.completed).length}</div>
          <div className="text-sm text-blue-600">أهداف محققة</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-800">{dailyTasks.filter((t) => !t.completed).length}</div>
          <div className="text-sm text-yellow-600">مهام متبقية اليوم</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-800">{tasks.length}</div>
          <div className="text-sm text-purple-600">إجمالي المهام</div>
        </div>
      </div>

      {/* معلومات الحماية */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">🔒 معلومات الحماية والخصوصية:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• جميع بياناتك محفوظة محلياً في جهازك فقط</li>
          <li>• البيانات محمية بتشفير AES-256 القوي</li>
          <li>• لا يتم إرسال أي بيانات شخصية لخوادم خارجية</li>
          <li>• يتم التحقق من سلامة البيانات تلقائياً</li>
          <li>• البيانات تنتهي صلاحيتها بعد 30 يوم للحماية</li>
          <li>• يمكنك حذف جميع البيانات من إعدادات المتصفح</li>
        </ul>
      </div>
    </section>
  )
}
