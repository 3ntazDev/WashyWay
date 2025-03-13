"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

const UserRegister = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("customer") // ✅ الدور الافتراضي
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const navigate = useNavigate()

  // التحقق من قوة كلمة المرور
  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("")
      return
    }

    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    const strength =
      (hasLowercase ? 1 : 0) +
      (hasUppercase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0) +
      (isLongEnough ? 1 : 0)

    if (strength < 2) return setPasswordStrength("ضعيفة")
    if (strength < 4) return setPasswordStrength("متوسطة")
    return setPasswordStrength("قوية")
  }

  // ✅ تسجيل حساب عادي
  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // التحقق من قوة كلمة المرور
      if (password.length < 6) {
        setError("⚠️ يجب أن تكون كلمة المرور 6 أحرف على الأقل")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        setError("⚠️ خطأ في التسجيل: " + error.message)
        return
      }

      if (data?.user) {
        // ✅ حفظ بيانات المستخدم في قاعدة البيانات
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            created_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Error inserting user data:", insertError)
          setError("⚠️ تم إنشاء الحساب ولكن حدث خطأ في حفظ البيانات الإضافية")
          return
        }

        // تخزين معلومات المستخدم في التخزين المحلي
        localStorage.setItem("userRole", role)
        if (data.session) {
          localStorage.setItem("token", data.session.access_token)
        }

        // إظهار رسالة نجاح وتوجيه المستخدم
        alert("✅ تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.")
        navigate("/user/booking")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("⚠️ حدث خطأ غير متوقع أثناء التسجيل")
    } finally {
      setLoading(false)
    }
  }

  // ✅ تسجيل الدخول باستخدام Google
  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        setError("⚠️ فشل تسجيل الدخول باستخدام Google: " + error.message)
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError("⚠️ حدث خطأ غير متوقع أثناء تسجيل الدخول باستخدام Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">تسجيل حساب جديد</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="محمد العتيبي"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                checkPasswordStrength(e.target.value)
              }}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="**********"
            />
            {passwordStrength && (
              <div className="mt-1">
                <span className="text-sm">قوة كلمة المرور: </span>
                <span
                  className={`text-sm font-medium ${
                    passwordStrength === "ضعيفة"
                      ? "text-red-500"
                      : passwordStrength === "متوسطة"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التسجيل..." : "تسجيل حساب جديد"}
          </button>
        </form>

        {/* زر تسجيل الدخول باستخدام Google */}
        <div className="text-center">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">أو</span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <span className="text-gray-700">التسجيل باستخدام Google</span>
          </button>
        </div>

        {/* رابط العودة إلى صفحة تسجيل الدخول */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">لديك حساب بالفعل؟</p>
          <button onClick={() => navigate("/auth/user/login")} className="text-indigo-600 hover:underline">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserRegister

