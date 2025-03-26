"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronRight, Star, ShowerHead, Loader2, Bell, X } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <ShowerHead className="h-8 w-8 text-[#1a73e8]" />
                <span className="mr-2 text-xl font-bold text-gray-900">مغاسلنا</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500">لا توجد إشعارات جديدة</div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                  notification.status === "مقبول"
                                    ? "bg-green-500"
                                    : notification.status === "معلق"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                              <div>
                                <p className="font-medium text-gray-900">{getStatusMessage(notification.status)}</p>
                                <p className="text-sm text-gray-600">{notification.laundry_name || "المغسلة"}</p>
                                <div className="flex items-center mt-1">
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

                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={() => navigate("/orders")}
                        className="text-[#1a73e8] hover:text-[#1565c0] text-sm font-medium"
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
                  <div className="h-8 w-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-medium">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Message - Only show if user is logged in */}
      {userName && (
        <div className="bg-gradient-to-r from-[#1a73e8]/10 to-[#1a73e8]/5 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {new Date().getHours() < 12 ? "صباح الخير" : "مساء الخير"},{" "}
                <span className="text-[#1a73e8]">{userName}</span>! 👋
              </h2>
              <p className="text-gray-600">نتمنى لك يوماً سعيداً. استكشف أفضل المغاسل المتاحة الآن.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="py-16 px-4 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">المغاسل المتاحة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">اختر من بين أفضل المغاسل في منطقتك واحجز بكل سهولة</p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="🔍 ابحث عن مغسلة..."
              className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] text-lg text-gray-700 placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-[#1a73e8] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter("regular")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "regular"
                ? "bg-[#1a73e8] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            عادي
          </button>
          <button
            onClick={() => setActiveFilter("express")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "express"
                ? "bg-[#1a73e8] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            سريع
          </button>
          <button
            onClick={() => setActiveFilter("premium")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "premium"
                ? "bg-[#1a73e8] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            ممتاز
          </button>
        </div>
      </div>

      {/* Laundries List */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#1a73e8] animate-spin mb-4" />
            <p className="text-xl text-gray-600">جاري تحميل المغاسل...</p>
          </div>
        ) : filteredLaundries.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto border border-gray-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">لا توجد نتائج</h3>
              <p className="text-gray-600">لم نتمكن من العثور على مغاسل تطابق بحثك. حاول تغيير معايير البحث.</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaundries.map((laundry) => (
              <div
                key={laundry.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className="h-40 bg-gray-100 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {laundry.rating && (
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700">{laundry.rating}</span>
                    </div>
                  )}

                  {laundry.category && (
                    <div className="absolute top-3 left-3 bg-[#1a73e8]/10 text-[#1a73e8] px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <ShowerHead className="h-4 w-4" />
                      <span>{laundry.category}</span>
                    </div>
                  )}

                  {laundry.distance && (
                    <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{laundry.distance} كم</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{laundry.name}</h2>
                  <p className="text-gray-600 mb-4">{laundry.location}</p>
                  <button
                    onClick={() => handleRegister(laundry.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1565c0] text-white py-3 px-4 rounded-lg transition-colors font-medium hover:scale-[1.02] active:scale-[0.98] transform duration-200"
                  >
                    احجز الآن
                    <ChevronRight className="h-5 w-5 animate-pulse" />
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

