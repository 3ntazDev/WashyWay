"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Calendar,
  Home,
  LogOut,
  Plus,
  ShoppingBasket,
  Store,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { supabase } from "../supabaseClient"

export default function DashboardPage() {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    role: "",
    createdAt: "",
  })
  const [laundries, setLaundries] = useState([])
  const [selectedLaundry, setSelectedLaundry] = useState(null)
  const [showLaundryForm, setShowLaundryForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showBookings, setShowBookings] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard") // dashboard, profile, laundries, bookings
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    weeklyRevenue: 0,
    revenueChange: 12.5, // Placeholder
    bookingsChange: 8.2, // Placeholder
  })
  const [isLoading, setIsLoading] = useState(true)

  // Redirect function (placeholder for actual navigation)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`)
    // In a real app, you would use Next.js router or React Router
  }

  // Update user data with useCallback for better performance
  const updateUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      // Get current user using supabase.auth.getUser()
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Error fetching user:", error)
        return
      }

      if (currentUser) {
        const { data, error: userError } = await supabase.from("users").select("*").eq("id", currentUser.id).single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          return
        }

        setUserData({
          email: currentUser.email || "",
          name: data.name || "غير محدد",
          role: data.role || "user",
          createdAt: data.created_at ? new Date(data.created_at).toLocaleDateString("ar-SA") : "غير محدد",
        })

        // Fetch user's laundries
        fetchUserLaundries(currentUser.id)
      } else {
        navigate("/auth/login") // Redirect to login if no user
      }
    } catch (error) {
      console.error("Error updating user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch user's laundries
  const fetchUserLaundries = async (userId) => {
    try {
      const { data, error } = await supabase.from("laundries").select("*").eq("owner_id", userId)

      if (error) {
        console.error("Error fetching laundries:", error)
        return
      }

      setLaundries(data || [])

      // If there's at least one laundry, select the first one automatically
      if (data && data.length > 0 && !selectedLaundry) {
        setSelectedLaundry(data[0])
        fetchLaundryStats(data[0].id)
      }
    } catch (error) {
      console.error("Error fetching laundries:", error)
    }
  }

  // Fetch statistics for the selected laundry
  const fetchLaundryStats = async (laundryId) => {
    try {
      // Fetch bookings for statistics
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("laundry_id", laundryId)

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
        return
      }

      // Calculate statistics
      const totalBookings = bookingsData?.length || 0
      const pendingBookings = bookingsData?.filter((booking) => booking.status === "pending").length || 0
      const completedBookings = bookingsData?.filter((booking) => booking.status === "completed").length || 0
      const cancelledBookings = bookingsData?.filter((booking) => booking.status === "cancelled").length || 0

      // Calculate revenue (assuming there's a price field in bookings)
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0

      // Get bookings from the last 7 days
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const recentBookings = bookingsData?.filter((booking) => new Date(booking.created_at) >= oneWeekAgo) || []

      const weeklyRevenue = recentBookings.reduce((sum, booking) => sum + (booking.price || 0), 0)

      setStats({
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        weeklyRevenue,
        revenueChange: 12.5, // Placeholder - would calculate from historical data
        bookingsChange: 8.2, // Placeholder - would calculate from historical data
      })
    } catch (error) {
      console.error("Error fetching laundry stats:", error)
    }
  }

  useEffect(() => {
    updateUserData() // Update user data when page loads
  }, [updateUserData])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut() // Sign out
      navigate("/auth/login") // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAddLaundry = () => {
    setShowLaundryForm(true)
    setShowServiceForm(false)
    setShowBookings(false)
  }

  const handleAddService = (laundry) => {
    setSelectedLaundry(laundry)
    setShowServiceForm(true)
    setShowLaundryForm(false)
    setShowBookings(false)
  }

  const handleManageBookings = (laundry) => {
    setSelectedLaundry(laundry)
    setShowBookings(true)
    setShowLaundryForm(false)
    setShowServiceForm(false)
  }

  const handleLaundryAdded = async (newLaundry) => {
    // Update laundry list after adding a new laundry
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      fetchUserLaundries(user.id)
    }
    setShowLaundryForm(false)
  }

  const handleServiceAdded = () => {
    // Close service form after adding
    setShowServiceForm(false)
  }

  const handleLaundryChange = (e) => {
    const laundryId = e.target.value
    const selected = laundries.find((l) => l.id.toString() === laundryId)
    setSelectedLaundry(selected || null)
    if (selected) {
      fetchLaundryStats(selected.id)
    }
  }

  // Make sure user is "owner"
  if (userData.role !== "owner" && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-500 font-medium">لا يمكنك الوصول إلى هذه الصفحة لأنك لست مالكًا</p>
          <button
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-blue-600">لوحة التحكم</h2>
          </div>
          <div className="flex flex-col flex-grow p-4 space-y-1">
            <button
              className={`flex items-center px-3 py-2 rounded-md ${activeTab === "dashboard" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="h-5 w-5 ml-2" />
              الرئيسية
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md ${activeTab === "profile" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5 w-5 ml-2" />
              الملف الشخصي
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md ${activeTab === "laundries" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("laundries")}
            >
              <Store className="h-5 w-5 ml-2" />
              المغاسل
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md ${activeTab === "bookings" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="h-5 w-5 ml-2" />
              الحجوزات
            </button>
            <button
              className={`flex items-center px-3 py-2 rounded-md ${activeTab === "services" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("services")}
            >
              <ShoppingBasket className="h-5 w-5 ml-2" />
              الخدمات
            </button>
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                {userData.name?.substring(0, 2) || "UN"}
              </div>
              <div>
                <p className="font-medium text-sm">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.email}</p>
              </div>
            </div>
            <button
              className="flex items-center w-full px-3 py-2 text-red-500 border border-gray-200 rounded-md hover:bg-gray-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
            <div className="flex space-x-1 space-x-reverse">
              <button onClick={() => setActiveTab("dashboard")} className="p-2 rounded-md">
                <Home className={`h-5 w-5 ${activeTab === "dashboard" ? "text-blue-500" : "text-gray-500"}`} />
              </button>
              <button onClick={() => setActiveTab("profile")} className="p-2 rounded-md">
                <User className={`h-5 w-5 ${activeTab === "profile" ? "text-blue-500" : "text-gray-500"}`} />
              </button>
              <button onClick={() => setActiveTab("laundries")} className="p-2 rounded-md">
                <Store className={`h-5 w-5 ${activeTab === "laundries" ? "text-blue-500" : "text-gray-500"}`} />
              </button>
              <button onClick={() => setActiveTab("bookings")} className="p-2 rounded-md">
                <Calendar className={`h-5 w-5 ${activeTab === "bookings" ? "text-blue-500" : "text-gray-500"}`} />
              </button>
            </div>
          </div>

          {/* Dashboard content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">مرحباً، {userData.name}</h1>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {laundries.length > 0 && (
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                      value={selectedLaundry?.id?.toString() || ""}
                      onChange={handleLaundryChange}
                    >
                      <option value="">اختر المغسلة</option>
                      {laundries.map((laundry) => (
                        <option key={laundry.id} value={laundry.id.toString()}>
                          {laundry.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleAddLaundry}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة مغسلة
                  </button>
                </div>
              </div>

              {selectedLaundry ? (
                <>
                  {/* Stats overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Bookings */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-2">إجمالي الحجوزات</div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <div
                          className={`flex items-center ${stats.bookingsChange >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {stats.bookingsChange >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 ml-1" />
                          )}
                          <span className="text-sm">{Math.abs(stats.bookingsChange)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">مقارنة بالأسبوع الماضي</p>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-2">الإيرادات</div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{stats.totalRevenue} ر.س</div>
                        <div
                          className={`flex items-center ${stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {stats.revenueChange >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 ml-1" />
                          )}
                          <span className="text-sm">{Math.abs(stats.revenueChange)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">مقارنة بالأسبوع الماضي</p>
                    </div>

                    {/* Pending Bookings */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-2">الحجوزات المعلقة</div>
                      <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mr-2">
                          {Math.round((stats.pendingBookings / stats.totalBookings) * 100) || 0}%
                        </span>
                      </div>
                    </div>

                    {/* Completed Bookings */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-500 mb-2">الحجوزات المكتملة</div>
                      <div className="text-2xl font-bold">{stats.completedBookings}</div>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mr-2">
                          {Math.round((stats.completedBookings / stats.totalBookings) * 100) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent bookings */}
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-medium">أحدث الحجوزات</h3>
                      <p className="text-sm text-gray-500">آخر 5 حجوزات تم استلامها</p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {/* This would be populated with actual booking data */}
                        {[1, 2, 3, 4, 5].map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div>
                                <p className="font-medium">عميل {index + 1}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(Date.now() - index * 86400000).toLocaleDateString("ar-SA")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  index % 3 === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : index % 3 === 1
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {index % 3 === 0 ? "معلق" : index % 3 === 1 ? "مكتمل" : "ملغي"}
                              </span>
                              <p className="mr-4 font-medium">{(index + 1) * 50} ر.س</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <button
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => setActiveTab("bookings")}
                      >
                        عرض جميع الحجوزات
                      </button>
                    </div>
                  </div>

                  {/* Booking status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 ml-2 text-yellow-500" />
                        <div className="text-sm font-medium">في الانتظار</div>
                      </div>
                      <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                      <p className="text-xs text-gray-500 mt-1">حجوزات تنتظر المعالجة</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                        <div className="text-sm font-medium">مكتملة</div>
                      </div>
                      <div className="text-2xl font-bold">{stats.completedBookings}</div>
                      <p className="text-xs text-gray-500 mt-1">حجوزات تمت معالجتها</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <XCircle className="h-4 w-4 ml-2 text-red-500" />
                        <div className="text-sm font-medium">ملغاة</div>
                      </div>
                      <div className="text-2xl font-bold">{stats.cancelledBookings}</div>
                      <p className="text-xs text-gray-500 mt-1">حجوزات تم إلغاؤها</p>
                    </div>
                  </div>

                  {/* Weekly revenue chart */}
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-medium">الإيرادات الأسبوعية</h3>
                      <p className="text-sm text-gray-500">إجمالي الإيرادات خلال الأسبوع الماضي</p>
                    </div>
                    <div className="p-4">
                      <div className="h-[200px] flex items-end justify-between">
                        {/* Simplified bar chart */}
                        {[40, 25, 60, 30, 45, 80, 55].map((height, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-8 bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs mt-2">
                              {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Store className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد مغاسل</h3>
                    <p className="text-center text-gray-500 mb-4">
                      لم تقم بإضافة أي مغسلة حتى الآن. قم بإضافة مغسلة للبدء في استقبال الحجوزات وإدارتها.
                    </p>
                    <button
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={handleAddLaundry}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مغسلة جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">الملف الشخصي</h3>
                <p className="text-sm text-gray-500">معلومات الحساب الشخصي</p>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl mb-4">
                      {userData.name?.substring(0, 2) || "UN"}
                    </div>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      تغيير الصورة
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">الاسم الكامل</h3>
                        <p className="font-medium">{userData.name || "غير محدد"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</h3>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">الدور</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {userData.role === "owner" ? "مالك" : "مستخدم"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ التسجيل</h3>
                        <p className="font-medium">{userData.createdAt || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t flex justify-end">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ml-2">إلغاء</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">حفظ التغييرات</button>
              </div>
            </div>
          )}

          {/* Laundries content */}
          {activeTab === "laundries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">إدارة المغاسل</h1>
                <button
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleAddLaundry}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مغسلة جديدة
                </button>
              </div>

              {showLaundryForm ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {/* Simplified LaundryForm component */}
                  <h3 className="text-lg font-medium mb-4">إضافة مغسلة جديدة</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">اسم المغسلة</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ml-2"
                        onClick={() => setShowLaundryForm(false)}
                      >
                        إلغاء
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleLaundryAdded}
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              ) : showServiceForm ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {/* Simplified ServiceForm component */}
                  <h3 className="text-lg font-medium mb-4">إضافة خدمة جديدة لـ {selectedLaundry?.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">اسم الخدمة</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                      <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ml-2"
                        onClick={() => setShowServiceForm(false)}
                      >
                        إلغاء
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleServiceAdded}
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Simplified LaundryList component */}
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">قائمة المغاسل</h3>
                  </div>
                  <div className="p-4">
                    {laundries.length > 0 ? (
                      <div className="space-y-4">
                        {laundries.map((laundry, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium">{laundry.name}</h3>
                                <p className="text-sm text-gray-500">{laundry.address || "لا يوجد عنوان"}</p>
                                <p className="text-sm text-gray-500">{laundry.phone || "لا يوجد رقم هاتف"}</p>
                              </div>
                              <div className="flex">
                                <button
                                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
                                  onClick={() => handleAddService(laundry)}
                                >
                                  إضافة خدمة
                                </button>
                                <button
                                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                  onClick={() => handleManageBookings(laundry)}
                                >
                                  إدارة الحجوزات
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Store className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">لا توجد مغاسل. قم بإضافة مغسلة جديدة للبدء.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings content */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">إدارة الحجوزات</h1>
                {laundries.length > 0 && (
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                    value={selectedLaundry?.id?.toString() || ""}
                    onChange={handleLaundryChange}
                  >
                    <option value="">اختر المغسلة</option>
                    {laundries.map((laundry) => (
                      <option key={laundry.id} value={laundry.id.toString()}>
                        {laundry.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedLaundry ? (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">حجوزات {selectedLaundry.name}</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex mb-4">
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2">
                        الكل
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 ml-2">
                        معلق
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 ml-2">
                        مكتمل
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        ملغي
                      </button>
                    </div>

                    {/* This would be populated with actual booking data */}
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <div>
                                  <p className="font-medium">عميل {index + 1}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(Date.now() - index * 86400000).toLocaleDateString("ar-SA")}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm">الخدمة: غسيل وكي</p>
                                <p className="text-sm">العنوان: شارع الملك فهد، الرياض</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  index % 3 === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : index % 3 === 1
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {index % 3 === 0 ? "معلق" : index % 3 === 1 ? "مكتمل" : "ملغي"}
                              </span>
                              <p className="font-medium mt-2">{(index + 1) * 50} ر.س</p>
                              <div className="flex mt-2">
                                <button className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 ml-1">
                                  تفاصيل
                                </button>
                                {index % 3 === 0 && (
                                  <>
                                    <button className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 ml-1">
                                      قبول
                                    </button>
                                    <button className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600">
                                      رفض
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-center text-gray-500">الرجاء اختيار مغسلة لعرض الحجوزات الخاصة بها</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

