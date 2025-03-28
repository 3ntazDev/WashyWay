"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function UserSummary() {
  // حالة البيانات
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [laundries, setLaundries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")

  // إحصائيات
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    mostUsedService: null,
    monthlyBookings: [],
    laundryStats: [],
  })

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchData()
  }, [])

  // دالة جلب البيانات
  const fetchData = async () => {
    try {
      setLoading(true)

      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // استخدام معرف المستخدم الحالي أو معرف افتراضي للعرض
      const userId = user?.id || "cd9a9c60-7c9e-4f95-a662-5a2dd637388a"

      // جلب الخدمات
      const { data: servicesData } = await supabase.from("services").select("*")
      setServices(servicesData || [])

      // جلب المغاسل
      const { data: laundriesData } = await supabase.from("laundries").select("*")
      setLaundries(laundriesData || [])

      // جلب الحجوزات
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("booking_date", { ascending: false })

      setBookings(bookingsData || [])

      // حساب الإحصائيات
      calculateStats(bookingsData || [], servicesData || [], laundriesData || [])
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error.message)
    } finally {
      setLoading(false)
    }
  }

  // حساب الإحصائيات
  const calculateStats = (bookings, services, laundries) => {
    // إجمالي الحجوزات
    const totalBookings = bookings.length

    // إجمالي المدفوعات
    const totalSpent = bookings.reduce((sum, booking) => {
      const service = services.find((s) => s.name === booking.service_type)
      return sum + (service?.price || 0)
    }, 0)

    // الخدمة الأكثر استخداماً
    const serviceCount = {}
    bookings.forEach((booking) => {
      serviceCount[booking.service_type] = (serviceCount[booking.service_type] || 0) + 1
    })

    let maxCount = 0
    let maxService = null

    Object.entries(serviceCount).forEach(([service, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxService = service
      }
    })

    // الحجوزات الشهرية (آخر 6 أشهر)
    const monthlyBookings = getMonthlyBookings(bookings)

    // إحصائيات المغاسل
    const laundryStats = calculateLaundryStats(bookings, services, laundries)

    setStats({
      totalBookings,
      totalSpent,
      mostUsedService: {
        name: maxService,
        count: maxCount,
      },
      monthlyBookings,
      laundryStats,
    })
  }

  // حساب الحجوزات الشهرية
  const getMonthlyBookings = (bookings) => {
    const months = []
    const now = new Date()

    // إنشاء مصفوفة الأشهر الستة الماضية
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = month.toLocaleString("ar-SA", { month: "short" })
      months.push({
        date: month,
        name: monthName,
        count: 0,
      })
    }

    // حساب عدد الحجوزات لكل شهر
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_date)

      months.forEach((month) => {
        if (
          bookingDate.getMonth() === month.date.getMonth() &&
          bookingDate.getFullYear() === month.date.getFullYear()
        ) {
          month.count++
        }
      })
    })

    return months
  }

  // حساب إحصائيات المغاسل
  const calculateLaundryStats = (bookings, services, laundries) => {
    const laundryMap = {}

    // تهيئة خريطة المغاسل
    laundries.forEach((laundry) => {
      laundryMap[laundry.id] = {
        id: laundry.id,
        name: laundry.name,
        totalSpent: 0,
        totalVisits: 0,
        services: {},
      }
    })

    // حساب الإحصائيات لكل مغسلة
    bookings.forEach((booking) => {
      if (booking.laundry_id && laundryMap[booking.laundry_id]) {
        const service = services.find((s) => s.name === booking.service_type)
        const price = service?.price || 0

        // زيادة عدد الزيارات والمبلغ المدفوع
        laundryMap[booking.laundry_id].totalVisits += 1
        laundryMap[booking.laundry_id].totalSpent += price

        // إحصائيات الخدمات لكل مغسلة
        if (!laundryMap[booking.laundry_id].services[booking.service_type]) {
          laundryMap[booking.laundry_id].services[booking.service_type] = {
            name: booking.service_type,
            count: 0,
            totalSpent: 0,
          }
        }

        laundryMap[booking.laundry_id].services[booking.service_type].count += 1
        laundryMap[booking.laundry_id].services[booking.service_type].totalSpent += price
      }
    })

    // تحويل الخريطة إلى مصفوفة وترتيبها حسب عدد الزيارات
    const laundryStats = Object.values(laundryMap)
      .filter((laundry) => laundry.totalVisits > 0)
      .sort((a, b) => b.totalVisits - a.totalVisits)

    // تحويل خريطة الخدمات إلى مصفوفة لكل مغسلة
    laundryStats.forEach((laundry) => {
      laundry.servicesList = Object.values(laundry.services).sort((a, b) => b.count - a.count)
    })

    return laundryStats
  }

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount)
  }

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // عرض شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
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
          <p className="mt-6 text-blue-800 font-medium text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  // عرض الصفحة الرئيسية
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* العنوان */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

          <div className="relative">
            <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center">
              <span className="bg-blue-500 text-white p-2 rounded-lg mr-3 shadow-md">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </span>
              ملخص حجوزاتك
            </h1>
            <p className="text-indigo-600 text-lg">مرحباً بك في لوحة التحكم الخاصة بك</p>
          </div>

          {/* التبويبات */}
          <div className="flex mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === "summary"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              الملخص
            </button>
            <button
              onClick={() => setActiveTab("laundries")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === "laundries"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              المغاسل
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              الحجوزات
            </button>
          </div>
        </div>

        {activeTab === "summary" && (
          <>
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">إجمالي الحجوزات</h2>
                    <div className="bg-blue-500 text-white p-2 rounded-lg shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <p className="text-4xl font-bold text-blue-600">{stats.totalBookings}</p>
                    <p className="text-blue-400 mr-2 mb-1">حجز</p>
                  </div>
                  <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(stats.totalBookings * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">إجمالي المدفوعات</h2>
                    <div className="bg-green-500 text-white p-2 rounded-lg shadow-md">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <p className="text-4xl font-bold text-green-600">
                      {formatCurrency(stats.totalSpent).split(" ")[0]}
                    </p>
                    <p className="text-green-400 mr-2 mb-1">ريال</p>
                  </div>
                  <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(stats.totalSpent / 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">الخدمة الأكثر استخداماً</h2>
                    <div className="bg-purple-500 text-white p-2 rounded-lg shadow-md">
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
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <p className="text-xl font-bold text-purple-600 truncate">
                      {stats.mostUsedService?.name || "لا يوجد"}
                    </p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-purple-400 text-sm">{stats.mostUsedService?.count || 0} مرة</p>
                    <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden mr-2">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min((stats.mostUsedService?.count || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* الحجوزات الشهرية */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full -mr-20 -mt-20 opacity-30"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="bg-indigo-500 text-white p-1.5 rounded-lg mr-3 shadow-md">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    الحجوزات الشهرية
                  </h3>
                </div>

                <div className="grid grid-cols-6 gap-4 mb-4">
                  {stats.monthlyBookings.map((month, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium text-gray-600 mb-2">{month.name}</div>
                      <div className="relative h-32 bg-indigo-50 rounded-lg overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-blue-400 rounded-b-lg transition-all duration-500 ease-out"
                          style={{
                            height: `${(month.count / Math.max(...stats.monthlyBookings.map((m) => m.count), 1)) * 100}%`,
                            minHeight: month.count ? "10%" : "0%",
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-indigo-800 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center">
                            {month.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "laundries" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full -mr-20 -mt-20 opacity-30"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="bg-purple-500 text-white p-1.5 rounded-lg mr-3 shadow-md">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </span>
                  إحصائيات المغاسل
                </h3>
              </div>

              {stats.laundryStats.length > 0 ? (
                <div className="space-y-8">
                  {stats.laundryStats.map((laundry) => (
                    <div
                      key={laundry.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 shadow-md transform transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center mb-3 md:mb-0">
                          <div className="bg-purple-500 text-white p-2 rounded-lg shadow-md mr-3">
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
                          </div>
                          <h4 className="text-xl font-bold text-purple-900">{laundry.name}</h4>
                        </div>
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">عدد الزيارات</div>
                            <div className="text-lg font-bold text-purple-600">{laundry.totalVisits}</div>
                          </div>
                          <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">إجمالي المدفوعات</div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(laundry.totalSpent).split(" ")[0]}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-inner">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">الخدمات المستخدمة:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {laundry.servicesList.map((service, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg"
                            >
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <span className="font-medium text-purple-900">{service.name}</span>
                                <span className="text-xs text-purple-600 mr-2 bg-white px-2 py-0.5 rounded-full">
                                  {service.count} مرة
                                </span>
                              </div>
                              <span className="font-medium text-green-600">
                                {formatCurrency(service.totalSpent).split(" ")[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-purple-50 rounded-xl">
                  <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-purple-400"
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
                  <p className="text-purple-800 font-medium text-lg">لا توجد بيانات متاحة</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -mr-20 -mt-20 opacity-30"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="bg-green-500 text-white p-1.5 rounded-lg mr-3 shadow-md">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </span>
                  آخر الحجوزات
                </h3>
              </div>

              <div className="overflow-x-auto -mx-4 md:mx-0">
                {bookings.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-50 to-teal-50 text-green-800">
                        <th className="px-4 py-3 text-right text-sm font-medium rounded-tr-lg">الخدمة</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">المغسلة</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">التاريخ</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">المبلغ</th>
                        <th className="px-4 py-3 text-right text-sm font-medium rounded-tl-lg">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100">
                      {bookings.slice(0, 5).map((booking, index) => {
                        const service = services.find((s) => s.name === booking.service_type)
                        const laundry = laundries.find((l) => l.id === booking.laundry_id)
                        const isLast = index === Math.min(bookings.length, 5) - 1

                        return (
                          <tr
                            key={booking.id}
                            className={`hover:bg-green-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-green-50/30"
                            }`}
                          >
                            <td className={`px-4 py-4 font-medium text-green-900 ${isLast ? "rounded-br-lg" : ""}`}>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                {booking.service_type}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-700">{laundry?.name || "غير محدد"}</td>
                            <td className="px-4 py-4 text-gray-700">{formatDate(booking.booking_date)}</td>
                            <td className="px-4 py-4 text-gray-900 font-medium">
                              {formatCurrency(service?.price || 0)}
                            </td>
                            <td className={`px-4 py-4 ${isLast ? "rounded-bl-lg" : ""}`}>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === "accepted" || booking.status === "مقبول"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : booking.status === "pending" || booking.status === "معلق"
                                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                      : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                {booking.status === "accepted" || booking.status === "مقبول"
                                  ? "مقبول"
                                  : booking.status === "pending" || booking.status === "معلق"
                                    ? "قيد الانتظار"
                                    : booking.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 bg-green-50 rounded-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-400"
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
                    <p className="text-green-800 font-medium text-lg">لا توجد حجوزات</p>
                  </div>
                )}
              </div>

              {bookings.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                    عرض المزيد من الحجوزات
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

