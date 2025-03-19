"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { User, Mail, Lock, LogOut, Save, AlertCircle, CheckCircle } from "lucide-react"

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#1a73e8] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">الملف الشخصي</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 ml-2" />
            ) : (
              <AlertCircle className="h-5 w-5 ml-2" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          {/* Username field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="h-4 w-4 ml-1" />
              الاسم
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1a73e8] focus:border-[#1a73e8]"
            />
          </div>

          {/* Email field (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Mail className="h-4 w-4 ml-1" />
              البريد الإلكتروني
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
              {user?.email}
              <p className="text-xs text-gray-500 mt-1">سيتم إضافة خاصية تغيير البريد الإلكتروني قريباً</p>
            </div>
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Lock className="h-4 w-4 ml-1" />
              كلمة المرور الجديدة
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اتركها فارغة إذا لم ترغب في تغييرها"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1a73e8] focus:border-[#1a73e8]"
            />
          </div>

          {/* Confirm Password field */}
          {password && (
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <Lock className="h-4 w-4 ml-1" />
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1a73e8] focus:border-[#1a73e8]"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a73e8] text-white py-2 px-4 rounded-md hover:bg-[#1565c0] transition-colors mb-4 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Save className="h-5 w-5 ml-2" />
                حفظ التغييرات
              </>
            )}
          </button>
        </form>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors mt-4 flex items-center justify-center"
        >
          <LogOut className="h-5 w-5 ml-2" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}

export default ProfilePage


