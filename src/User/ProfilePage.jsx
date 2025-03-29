"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { User, Mail, Lock, LogOut, Save, AlertCircle, CheckCircle, UserCircle } from "lucide-react"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error

      setUser(user)

      // Fetch username from users table
      const { data } = await supabase.from("users").select("name").eq("id", user.id).single()

      if (data) setUsername(data.name || "")
    } catch (error) {
      console.error("Error:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Update username
      if (username) {
        const { error } = await supabase.from("users").update({ name: username }).eq("id", user.id)

        if (error) throw error
      }

      // Update password if provided
      if (password) {
        if (password !== confirmPassword) {
          return showMessage("error", "كلمات المرور غير متطابقة")
        }

        if (password.length < 6) {
          return showMessage("error", "يجب أن تكون كلمة المرور 6 أحرف على الأقل")
        }

        const { error } = await supabase.auth.updateUser({
          password: password,
        })

        if (error) throw error

        setPassword("")
        setConfirmPassword("")
      }

      showMessage("success", "تم تحديث البيانات بنجاح")
    } catch (error) {
      console.error("Error:", error.message)
      showMessage("error", "حدث خطأ أثناء تحديث البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-l from-indigo-600 to-blue-500 p-6 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center mb-2">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <UserCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">الملف الشخصي</h2>
          <p className="text-blue-100 text-center text-sm mt-1">مرحباً {username || user?.email?.split("@")[0]}</p>
        </div>

        {/* Message notification */}
        {message && (
          <div
            className={`mx-6 -mt-4 p-3 rounded-lg flex items-center shadow-lg ${
              message.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 ml-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {/* Username field */}
            <div className="group">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center group-hover:text-indigo-700 transition-colors"
              >
                <User className="h-4 w-4 ml-2 text-indigo-500" />
                الاسم
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-lg pointer-events-none"></div>
              </div>
            </div>

            {/* Email field (read-only) */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center group-hover:text-indigo-700 transition-colors">
                <Mail className="h-4 w-4 ml-2 text-indigo-500" />
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-gray-600">
                  {user?.email}
                  <p className="text-xs text-gray-500 mt-1">سيتم إضافة خاصية تغيير البريد الإلكتروني قريباً</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-lg pointer-events-none"></div>
              </div>
            </div>

            {/* Password field */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center group-hover:text-indigo-700 transition-colors"
              >
                <Lock className="h-4 w-4 ml-2 text-indigo-500" />
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="اتركها فارغة إذا لم ترغب في تغييرها"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-lg pointer-events-none"></div>
              </div>
            </div>

            {/* Confirm Password field */}
            {password && (
              <div className="group">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center group-hover:text-indigo-700 transition-colors"
                >
                  <Lock className="h-4 w-4 ml-2 text-indigo-500" />
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-200 rounded-lg pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-indigo-600 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
              ) : (
                <div className="flex items-center justify-center">
                  <Save className="h-5 w-5 ml-2" />
                  <span>حفظ التغييرات</span>
                </div>
              )}
            </button>
          </form>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-white border-2 border-red-500 text-red-500 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            <LogOut className="h-5 w-5 ml-2" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Footer decoration */}
        <div className="h-2 bg-gradient-to-l from-indigo-600 to-blue-500"></div>
      </div>
    </div>
  )
}

export default ProfilePage

