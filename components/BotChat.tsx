"use client"

import { useState } from "react"

interface Message {
  id: number
  text: string
  isUser: boolean
}

export default function BotChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "السلام عليكم ورحمة الله وبركاته! 🕌\n\nأهلاً بك في المُجيب الذكي. يمكنني مساعدتك في الأسئلة الدينية والإسلامية.\n\nكيف يمكنني خدمتك اليوم؟",
      isUser: false,
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (userInput.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: userInput,
        isUser: true,
      }

      setMessages((prev) => [...prev, userMessage])
      const currentInput = userInput
      setUserInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: currentInput }),
        })

        const data = await response.json()

        const botMessage: Message = {
          id: Date.now() + 1,
          text: data.response || "عذراً، لم أتمكن من فهم سؤالك. يرجى إعادة صياغته.",
          isUser: false,
        }

        setMessages((prev) => [...prev, botMessage])
      } catch (error) {
        console.error("Chat error:", error)
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "🤖 عذراً، حدث خطأ. يرجى المحاولة مرة أخرى أو الرجوع للعلماء المختصين.",
          isUser: false,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const suggestions = [
    "ما هي أركان الإسلام؟",
    "كيف أتعلم الصلاة؟",
    "ما فضل صيام رمضان؟",
    "ما هي أفضل الأذكار؟",
    "كيف أقرأ القرآن؟",
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg z-50 transition-all hover:scale-110"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 h-[450px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">🤖 المُجيب الذكي</h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            <p className="text-sm text-emerald-100">اسألني أي سؤال ديني</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`mb-3 ${message.isUser ? "text-left" : "text-right"}`}>
                <div
                  className={`inline-block p-2 rounded-lg max-w-xs ${
                    message.isUser ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-right mb-3">
                <div className="inline-block bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">أسئلة مقترحة:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(suggestion)}
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-full"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="اكتب سؤالك..."
                className="flex-1 p-2 border rounded text-sm"
                onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !userInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm"
              >
                📤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">⚠️ للفتاوى المهمة، راجع العلماء المختصين</p>
          </div>
        </div>
      )}
    </>
  )
}
