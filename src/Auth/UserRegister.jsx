"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

const UserRegister = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (password.length < 6) {
        setError("⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        setLoading(false)
        return
      }

      console.log("محاولة تسجيل مستخدم جديد...")
      // تسجيل المستخدم باستخدام supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error("خطأ في التسجيل:", error)
        setError("⚠️ خطأ في التسجيل: " + error.message)
        return
      }

      if (data?.user) {
        console.log("تم إنشاء المستخدم في Auth، جاري إنشاء سجل في جدول users...")
        // حفظ بيانات المستخدم في جدول users
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: email,
            name: fullName,
            role: role,
          },
        ])

        if (insertError) {
          console.error("خطأ في حفظ البيانات:", insertError)
          setError("⚠️ خطأ في حفظ البيانات: " + insertError.message)
          return
        }

        console.log("تم إنشاء سجل المستخدم بنجاح، جاري التوجيه...")
        // توجيه المستخدم إلى صفحة إكمال التسجيل
        navigate("/user/complete-registration", { state: { userId: data.user.id } })
      }
    } catch (err) {
      console.error("خطأ غير متوقع:", err)
      setError("⚠️ حدث خطأ غير متوقع أثناء التسجيل")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">التسجيل</h2>
        </div>
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                الدور
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">اختر الدور</option>
                <option value="user">مستخدم</option>
                <option value="admin">مشرف</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "جاري التسجيل..." : "تسجيل"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserRegister

