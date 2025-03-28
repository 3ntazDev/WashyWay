"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function LaundriesPage() {
  const [laundries, setLaundries] = useState([])
  const [filteredLaundries, setFilteredLaundries] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  // Fetch user data and notifications
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const {
          data: { session },
        } = await supabase.auth.getSession()


        
        if (session) {
          // Fetch user name from name_roles table
          const { data: userData, error: userError } = await supabase
            .from("name_roles")
            .select("name")
            .eq("user_id", session.user.id)
            .single()

          if (!userError && userData) {
            setUserName(userData.name)
          }

          // Fetch notifications (order status updates)
          const { data: notifData, error: notifError } = await supabase
            .from("bookings")
            .select("id, status, laundry_name, updated_at")
            .eq("user_id", session.user.id)
            .order("updated_at", { ascending: false })
            .limit(5)

          if (!notifError && notifData) {
            setNotifications(notifData)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchLaundries = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("laundries").select("*")
        if (error) throw error
        setLaundries(data)
        setFilteredLaundries(data)
      } catch (error) {
        console.error("Error fetching laundries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaundries()
  }, [])

  useEffect(() => {
    let filtered = laundries

    if (search.trim()) {
      filtered = filtered.filter(
        (laundry) =>
          laundry.name.toLowerCase().includes(search.toLowerCase()) ||
          laundry.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((laundry) => laundry.category === activeFilter)
    }

    setFilteredLaundries(filtered)
  }, [search, laundries, activeFilter])

  const handleRegister = (laundryId) => {
    navigate(`/booking/${laundryId}`)
  }

  // Format the notification time
  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleDateString("ar-SA")
  }

  // Get status message in Arabic
  const getStatusMessage = (status) => {
    switch (status) {
      case "مقبول":
        return "تم قبول طلبك"
      case "معلق":
        return "طلبك قيد المراجعة"
      case "ملغي":
        return "تم إلغاء طلبك"
      default:
        return "تم تحديث حالة طلبك"
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "مقبول":
        return "bg-green-100 text-green-800"
      case "معلق":
        return "bg-yellow-100 text-yellow-800"
      case "ملغي":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <span className="mr-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  مغاسلنا
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-blue-50 transition-colors relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 border border-blue-100 z-20 transform transition-all duration-300 animate-fadeIn">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-blue-50">
                      <h3 className="font-bold text-blue-900">الإشعارات</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-blue-800 font-medium">لا توجد إشعارات جديدة</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-blue-50 border-b border-blue-50 last:border-0 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                                  notification.status === "مقبول"
                                    ? "bg-green-500"
                                    : notification.status === "معلق"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                } animate-pulse`}
                              ></div>
                              <div>
                                <p className="font-medium text-blue-900">{getStatusMessage(notification.status)}</p>
                                <p className="text-sm text-blue-600">{notification.laundry_name || "المغسلة"}</p>
                                <div className="flex items-center mt-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notification.status)}`}
                                  >
                                    {notification.status}
                                  </span>
                                  <span className="text-xs text-gray-500 mr-2">
                                    {formatTime(notification.updated_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="px-4 py-2 border-t border-blue-50">
                      <button
                        onClick={() => navigate("/orders")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        عرض جميع الطلبات
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Name Display */}
              {userName && (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-blue-900 hidden sm:block">{userName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Message - Only show if user is logged in */}
      {userName && (
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-blue-900 mb-2 flex items-center">
                {new Date().getHours() < 12 ? "صباح الخير" : "مساء الخير"},{" "}
                <span className="text-blue-600 mr-2">{userName}</span>
                <span className="animate-bounce inline-block">👋</span>
              </h2>
              <p className="text-indigo-600 text-lg">نتمنى لك يوماً سعيداً. استكشف أفضل المغاسل المتاحة الآن.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/10 z-0"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full opacity-20"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-md animate-pulse">
            أفضل المغاسل في مدينتك
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">
            المغاسل المتاحة
          </h1>
          <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
            اختر من بين أفضل المغاسل في منطقتك واحجز بكل سهولة
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="🔍 ابحث عن مغسلة..."
              className="w-full py-4 pl-12 pr-4 bg-blue-50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-lg text-blue-900 placeholder-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              activeFilter === "all"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter("regular")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              activeFilter === "regular"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm"
            }`}
          >
            عادي
          </button>
          <button
            onClick={() => setActiveFilter("express")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              activeFilter === "express"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm"
            }`}
          >
            سريع
          </button>
          <button
            onClick={() => setActiveFilter("premium")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              activeFilter === "premium"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm"
            }`}
          >
            ممتاز
          </button>
        </div>
      </div>

      {/* Laundries List */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-blue-200 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-blue-800 font-medium text-xl">جاري تحميل المغاسل...</p>
          </div>
        ) : filteredLaundries.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-10 max-w-md mx-auto border border-blue-100 shadow-lg">
              <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-900">لا توجد نتائج</h3>
              <p className="text-indigo-600">لم نتمكن من العثور على مغاسل تطابق بحثك. حاول تغيير معايير البحث.</p>
              <button
                onClick={() => {
                  setSearch("")
                  setActiveFilter("all")
                }}
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-bold"
              >
                عرض جميع المغاسل
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLaundries.map((laundry) => (
              <div
                key={laundry.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-100 hover:-translate-y-2 group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-5 right-5 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full"></div>

                  {laundry.rating && (
                    <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-blue-900">{laundry.rating}</span>
                    </div>
                  )}

                  {laundry.category && (
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <span>{laundry.category}</span>
                    </div>
                  )}

                  {laundry.distance && (
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{laundry.distance} كم</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-blue-900">{laundry.name}</h2>
                  <p className="text-indigo-600 mb-6">{laundry.location}</p>
                  <button
                    onClick={() => handleRegister(laundry.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-bold text-lg group-hover:scale-105"
                  >
                    احجز الآن
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

