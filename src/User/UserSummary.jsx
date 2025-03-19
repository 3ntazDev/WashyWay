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

  // إحصائيات
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    mostUsedService: null,
    monthlyBookings: [],
    laundryStats: []
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
      const { data: { user } } = await supabase.auth.getUser()
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
      laundryStats
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
    laundries.forEach(laundry => {
      laundryMap[laundry.id] = {
        id: laundry.id,
        name: laundry.name,
        totalSpent: 0,
        totalVisits: 0,
        services: {}
      }
    })
    
    // حساب الإحصائيات لكل مغسلة
    bookings.forEach(booking => {
      if (booking.laundry_id && laundryMap[booking.laundry_id]) {
        const service = services.find(s => s.name === booking.service_type)
        const price = service?.price || 0
        
        // زيادة عدد الزيارات والمبلغ المدفوع
        laundryMap[booking.laundry_id].totalVisits += 1
        laundryMap[booking.laundry_id].totalSpent += price
        
        // إحصائيات الخدمات لكل مغسلة
        if (!laundryMap[booking.laundry_id].services[booking.service_type]) {
          laundryMap[booking.laundry_id].services[booking.service_type] = {
            name: booking.service_type,
            count: 0,
            totalSpent: 0
          }
        }
        
        laundryMap[booking.laundry_id].services[booking.service_type].count += 1
        laundryMap[booking.laundry_id].services[booking.service_type].totalSpent += price
      }
    })
    
    // تحويل الخريطة إلى مصفوفة وترتيبها حسب عدد الزيارات
    const laundryStats = Object.values(laundryMap)
      .filter(laundry => laundry.totalVisits > 0)
      .sort((a, b) => b.totalVisits - a.totalVisits)
    
    // تحويل خريطة الخدمات إلى مصفوفة لكل مغسلة
    laundryStats.forEach(laundry => {
      laundry.servicesList = Object.values(laundry.services)
        .sort((a, b) => b.count - a.count)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  // عرض الصفحة الرئيسية
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:py-8 md:px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* العنوان */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">ملخص الحجوزات</h1>
          <p className="text-sm md:text-base text-gray-600">هذا هو ملخص حجوزاتك ومدفوعاتك</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1 md:mb-2">إجمالي الحجوزات</h2>
            <p className="text-2xl md:text-3xl font-bold text-blue-500">{stats.totalBookings}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">حجز</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1 md:mb-2">إجمالي المدفوعات</h2>
            <p className="text-2xl md:text-3xl font-bold text-green-500">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">ريال سعودي</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sm:col-span-2 lg:col-span-1">
            <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-1 md:mb-2">الخدمة الأكثر استخداماً</h2>
            <p className="text-2xl md:text-3xl font-bold text-purple-500">{stats.mostUsedService?.name || "لا يوجد"}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">{stats.mostUsedService?.count || 0} مرة</p>
          </div>
        </div>
        
        {/* إحصائيات المغاسل */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">إحصائيات المغاسل</h3>
          
          {stats.laundryStats.length > 0 ? (
            <div className="space-y-6">
              {stats.laundryStats.map((laundry) => (
                <div key={laundry.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base font-semibold text-gray-800">{laundry.name}</h4>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {laundry.totalVisits} زيارة
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-600">إجمالي المدفوعات</span>
                    <span className="font-medium text-green-600">{formatCurrency(laundry.totalSpent)}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">الخدمات المستخدمة:</h5>
                    <div className="space-y-2">
                      {laundry.servicesList.map((service, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            <span>{service.name}</span>
                            <span className="text-gray-500 mr-2">({service.count} مرة)</span>
                          </div>
                          <span className="font-medium">{formatCurrency(service.totalSpent)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              لا توجد بيانات متاحة
            </div>
          )}
        </div>

        {/* الحجوزات الشهرية */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">الحجوزات الشهرية</h3>

          <div className="space-y-3">
            {stats.monthlyBookings.map((month, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 md:w-24 text-xs md:text-sm text-gray-600">{month.name}</div>
                <div className="flex-1">
                  <div className="relative">
                    <div className="flex mb-1 items-center justify-between">
                      <span className="text-xs font-medium text-blue-600">{month.count} حجز</span>
                    </div>
                    <div className="h-2 bg-blue-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${(month.count / Math.max(...stats.monthlyBookings.map((m) => m.count), 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* جدول الحجوزات */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">آخر الحجوزات</h2>

          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-full text-right">
              <thead className="bg-gray-50 text-xs md:text-sm">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-500">الخدمة</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-500">المغسلة</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-500">التاريخ</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-500">المبلغ</th>
                  <th className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-500">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs md:text-sm">
                {bookings.slice(0, 5).map((booking) => {
                  const service = services.find((s) => s.name === booking.service_type)
                  const laundry = laundries.find((l) => l.id === booking.laundry_id)

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 md:px-4 md:py-3 font-medium text-gray-900">{booking.service_type}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-gray-500">{laundry?.name || "غير محدد"}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-gray-500">{formatDate(booking.booking_date)}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 text-gray-900">{formatCurrency(service?.price || 0)}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status === "accepted"
                            ? "مقبول"
                            : booking.status === "pending"
                              ? "قيد الانتظار"
                              : booking.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 md:px-4 text-gray-500 text-center">
                      لا توجد حجوزات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
