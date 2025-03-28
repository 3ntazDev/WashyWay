"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("date-desc")
  const [viewMode, setViewMode] = useState("table") // table or card
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Real-time subscription
  useEffect(() => {
    // Get current user and fetch their orders
    const getUserAndOrders = async () => {
      try {
        // Get the current user session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setUser(session.user)

          // Get user name from name_roles table
          const { data: userData } = await supabase
            .from("name_roles")
            .select("name")
            .eq("user_id", session.user.id)
            .single()

          if (userData) {
            setUserName(userData.name)
          }

          // Fetch initial orders
          await fetchOrders(session.user.id)

          // Set up real-time subscription
          const subscription = supabase
            .channel("bookings-changes")
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "bookings",
                filter: `user_id=eq.${session.user.id}`,
              },
              (payload) => {
                if (payload.eventType === "INSERT") {
                  setOrders((prevOrders) => [...prevOrders, payload.new])
                  setMessage({ type: "success", text: "تم إضافة طلب جديد!" })
                  setTimeout(() => setMessage(null), 3000)
                } else if (payload.eventType === "UPDATE") {
                  setOrders((prevOrders) =>
                    prevOrders.map((order) => (order.id === payload.new.id ? payload.new : order)),
                  )
                  setMessage({ type: "success", text: "تم تحديث حالة الطلب!" })
                  setTimeout(() => setMessage(null), 3000)
                } else if (payload.eventType === "DELETE") {
                  setOrders((prevOrders) => prevOrders.filter((order) => order.id !== payload.old.id))
                }
              },
            )
            .subscribe()

          // Cleanup subscription
          return () => {
            subscription.unsubscribe()
          }
        } else {
          // No authenticated user
          setLoading(false)
          setMessage({ type: "error", text: "يرجى تسجيل الدخول لعرض طلباتك" })
        }
      } catch (error) {
        console.error("Error getting user session:", error)
        setLoading(false)
        setMessage({ type: "error", text: "حدث خطأ أثناء التحقق من المستخدم" })
      }
    }

    getUserAndOrders()
  }, [])

  const fetchOrders = async (userId) => {
    setLoading(true)
    try {
      // Filter bookings by user_id
      const { data, error } = await supabase.from("bookings").select("*").eq("user_id", userId)

      if (error) throw error
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء جلب الطلبات" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (orderId, status) => {
    if (status === "مقبول") {
      setMessage({ type: "error", text: "لا يمكنك حذف طلب تم قبوله." })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟")) return

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", orderId)
      if (error) throw error

      setOrders(orders.filter((order) => order.id !== orderId))
      setMessage({ type: "success", text: "تم حذف الطلب بنجاح!" })
    } catch (error) {
      console.error("Error deleting order:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء الحذف." })
    }

    setTimeout(() => setMessage(null), 3000)
  }

  // Helper function to get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "مقبول":
      case "accepted":
        return "bg-green-100 text-green-800 border border-green-200"
      case "معلق":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "ملغي":
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // Get status background color for cards
  const getStatusBgColor = (status) => {
    switch (status) {
      case "مقبول":
      case "accepted":
        return "bg-gradient-to-r from-green-500 to-emerald-600"
      case "معلق":
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-amber-600"
      case "ملغي":
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-600"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "مقبول":
      case "accepted":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "معلق":
      case "pending":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "ملغي":
      case "cancelled":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  // Filter orders by status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => {
          if (filterStatus === "مقبول") {
            return order.status === "مقبول" || order.status === "accepted"
          } else if (filterStatus === "معلق") {
            return order.status === "معلق" || order.status === "pending"
          } else if (filterStatus === "ملغي") {
            return order.status === "ملغي" || order.status === "cancelled"
          }
          return order.status === filterStatus
        })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.booking_date) - new Date(a.booking_date)
    } else if (sortBy === "date-asc") {
      return new Date(a.booking_date) - new Date(b.booking_date)
    } else if (sortBy === "id-desc") {
      return b.id - a.id
    } else if (sortBy === "id-asc") {
      return a.id - b.id
    }
    return 0
  })

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("ar-SA", options)
  }

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  // Close order details modal
  const closeOrderDetails = () => {
    setShowOrderDetails(false)
    setTimeout(() => setSelectedOrder(null), 300) // Wait for animation to complete
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-blue-200 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-blue-800 font-medium text-xl">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show login message
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-6" dir="rtl">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-20 -mt-20 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-16 -mb-16 opacity-30"></div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">يرجى تسجيل الدخول</h2>
            <p className="text-indigo-600 mb-8">يجب عليك تسجيل الدخول لعرض طلباتك الخاصة</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 w-full font-medium text-lg transform hover:-translate-y-0.5"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <div className="bg-white/20 p-2 rounded-lg shadow-inner mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                طلباتي
              </h1>
              <p className="text-blue-100 mr-14">
                {userName ? `مرحباً ${userName}، ` : ""}
                يمكنك إدارة جميع طلبات الغسيل الخاصة بك من هنا
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-3">
              <button
                onClick={() => fetchOrders(user.id)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>تحديث</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Notification message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center shadow-lg animate-fadeIn ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Filters and sorting */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 p-5 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-20 -mt-20 opacity-20"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-medium">تصفية</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="h-6 border-l border-blue-200 mx-1 hidden md:block"></div>

                <div className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg font-medium">
                  {filteredOrders.length} طلب
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">عرض:</span>
                  <div className="flex bg-blue-50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "table" 
                          ? "bg-blue-600 text-white" 
                          : "text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      جدول
                    </button>
                    <button
                      onClick={() => setViewMode("card")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === "card" 
                          ? "bg-blue-600 text-white" 
                          : "text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      بطاقات
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">ترتيب:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date-desc">التاريخ (الأحدث أولاً)</option>
                    <option value="date-asc">التاريخ (الأقدم أولاً)</option>
                    <option value="id-desc">رقم الطلب (تنازلي)</option>
                    <option value="id-asc">رقم الطلب (تصاعدي)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter options */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    filterStatus === "all" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  جميع الطلبات
                </button>
                <button
                  onClick={() => setFilterStatus("مقبول")}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                    filterStatus === "مقبول" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  مقبول
                </button>
                <button
                  onClick={() => setFilterStatus("معلق")}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                    filterStatus === "معلق" 
                      ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md" 
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  معلق
                </button>
                <button
                  onClick={() => setFilterStatus("ملغي")}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                    filterStatus === "ملغي" 
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md" 
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ملغي
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-20 -mt-20 opacity-20"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">لا توجد طلبات حتى الآن</h3>
              <p className="text-indigo-600 mb-8">لم يتم العثور على أي طلبات تطابق معايير البحث الخاصة بك</p>
              {filterStatus !== "all" && (
                <button 
                  onClick={() => setFilterStatus("all")} 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                  عرض جميع الطلبات
                </button>
              )}
            </div>
          </div>
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      رقم الطلب
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      اسم العميل
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      المغسلة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      الخدمة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      الوقت
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {sortedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg">
                            #{order.id.toString().padStart(4, "0")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-blue-900 font-medium">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm text-blue-700">{order.laundry_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-blue-700">{order.service_type}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-blue-700">{formatDate(order.booking_date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-blue-700">{order.available_slot}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-100"
                            title="عرض التفاصيل"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {order.status !== "مقبول" && order.status !== "accepted" && (
                            <button
                              onClick={() => handleDelete(order.id, order.status)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100"
                              title="حذف الطلب"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${getStatusBgColor(order.status)} text-white p-4 relative`}>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6"></div>
                  
                  <div className="flex justify-between items-center relative">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                      #{order.id.toString().padStart(4, "0")}
                    </span>
                    <span className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="font-bold text-blue-900">{order.laundry_name}</h3>
                    </div>
                    <div className="flex items-center text-blue-700 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      {order.service_type}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 mb-1">التاريخ</div>
                      <div className="text-sm font-medium text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(order.booking_date)}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 mb-1">الوقت</div>
                      <div className="text-sm font-medium text-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {order.available_slot}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>عرض التفاصيل</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    {order.status !== "مقبول" && order.status !== "accepted" && (
                      <button
                        onClick={() => handleDelete(order.id, order.status)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <span>حذف الطلب</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeOrderDetails}>
          <div 
            className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 ${
              showOrderDetails ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${getStatusBgColor(selectedOrder.status)} text-white p-6 relative`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">تفاصيل الطلب</h3>
                  <button onClick={closeOrderDetails} className="text-white/80 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg shadow-inner mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/80 text-sm">رقم الطلب</div>
                    <div className="font-bold">#{selectedOrder.id.toString().padStart(4, "0")}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-blue-600 mb-1">الحالة</div>
                  <div className="font-medium text-blue-900 flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedOrder.status)}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-600 mb-1">اسم العميل</div>
                  <div className="font-medium text-blue-900">{selectedOrder.customer_name}</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-blue-600 mb-1">المغسلة</div>
                  <div className="font-medium text-blue-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {selectedOrder.laundry_name}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-600 mb-1">الخدمة</div>
                  <div className="font-medium text-blue-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {selectedOrder.service_type}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-blue-600 mb-1">التاريخ</div>
                    <div className="font-medium text-blue-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(selectedOrder.booking_date)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-blue-600 mb-1">الوقت</div>
                    <div className="font-medium text-blue-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedOrder.available_slot}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-6 flex justify-between">
                <button
                  onClick={closeOrderDetails}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  إغلاق
                </button>
                
                {selectedOrder.status !== "مقبول" && selectedOrder.status !== "accepted" && (
                  <button
                    onClick={() => {
                      handleDelete(selectedOrder.id, selectedOrder.status)
                      closeOrderDetails()
                    }}
                    className="px-6 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    حذف الطلب
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Order



