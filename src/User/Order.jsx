"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import {
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Clock,
  Calendar,
  Package,
  User,
  Home,
  Filter,
  ChevronDown,
  Eye,
  Printer,
} from "lucide-react"

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("date-desc")

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
        return "bg-green-100 text-green-800 border border-green-200"
      case "معلق":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "ملغي":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "مقبول":
        return <CheckCircle className="h-4 w-4 ml-1" />
      case "معلق":
        return <Clock className="h-4 w-4 ml-1" />
      case "ملغي":
        return <AlertCircle className="h-4 w-4 ml-1" />
      default:
        return null
    }
  }

  // Filter orders by status
  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#1a73e8] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show login message
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center" dir="rtl">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">يرجى تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لعرض طلباتك الخاصة</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-[#1a73e8] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#1a73e8]/10 to-[#1a73e8]/5 py-8 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">طلباتي</h1>
              <p className="text-gray-600">
                {userName ? `مرحباً ${userName}، ` : ""}
                يمكنك إدارة جميع طلبات الغسيل الخاصة بك من هنا
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <button
                onClick={() => fetchOrders(user.id)}
                className="flex items-center gap-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>تحديث</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Printer className="h-4 w-4" />
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
            className={`mb-6 p-4 rounded-lg flex items-center shadow-md animate-fadeIn ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 ml-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 ml-3 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Filters and sorting */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#1a73e8] transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span className="font-medium">تصفية</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              <div className="h-6 border-l border-gray-300 mx-2"></div>

              <div className="text-sm text-gray-500">{filteredOrders.length} طلب</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8]"
              >
                <option value="date-desc">التاريخ (الأحدث أولاً)</option>
                <option value="date-asc">التاريخ (الأقدم أولاً)</option>
                <option value="id-desc">رقم الطلب (تنازلي)</option>
                <option value="id-asc">رقم الطلب (تصاعدي)</option>
              </select>
            </div>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "all" ? "bg-[#1a73e8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                جميع الطلبات
              </button>
              <button
                onClick={() => setFilterStatus("مقبول")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "مقبول" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                <CheckCircle className="h-4 w-4 inline-block ml-1" />
                مقبول
              </button>
              <button
                onClick={() => setFilterStatus("معلق")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "معلق"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                <Clock className="h-4 w-4 inline-block ml-1" />
                معلق
              </button>
              <button
                onClick={() => setFilterStatus("ملغي")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "ملغي" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <AlertCircle className="h-4 w-4 inline-block ml-1" />
                ملغي
              </button>
            </div>
          )}
        </div>

        {/* Orders */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات حتى الآن</h3>
            <p className="text-gray-600 mb-6">لم يتم العثور على أي طلبات تطابق معايير البحث الخاصة بك</p>
            {filterStatus !== "all" && (
              <button onClick={() => setFilterStatus("all")} className="text-[#1a73e8] hover:text-blue-700 font-medium">
                عرض جميع الطلبات
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الطلب
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم العميل
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المغسلة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخدمة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوقت
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="bg-[#1a73e8]/10 text-[#1a73e8] text-sm font-medium px-2.5 py-1 rounded-lg">
                            #{order.id.toString().padStart(4, "0")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-900 font-medium">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-700">{order.laundry_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{order.service_type}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-700">{formatDate(order.booking_date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-700">{order.available_slot}</span>
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
                            className="text-gray-600 hover:text-[#1a73e8] transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {order.status !== "مقبول" && (
                            <button
                              onClick={() => handleDelete(order.id, order.status)}
                              className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                              title="حذف الطلب"
                            >
                              <Trash2 className="h-4 w-4" />
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
        )}
      </div>
    </div>
  )
}

export default Order

