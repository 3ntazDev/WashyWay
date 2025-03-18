"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const BookingManagement = ({ laundryId }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending") // Default to showing pending bookings

  useEffect(() => {
    fetchBookings()
  }, [laundryId, statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("bookings")
        .select("*, services(name)")
        .eq("laundry_id", laundryId)
        .eq("status", statusFilter)
        .order("booking_date", { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("حدث خطأ أثناء جلب الحجوزات")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date() })
        .eq("id", bookingId)

      if (error) {
        throw new Error(error.message)
      }

      // تحديث القائمة بعد تغيير الحالة
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking status:", error)
      setError("حدث خطأ أثناء تحديث حالة الحجز")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString("ar-SA")
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "accepted":
        return "مقبول"
      case "rejected":
        return "مرفوض"
      case "completed":
        return "مكتمل"
      default:
        return status
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4" dir="rtl">
        <h2 className="text-lg font-medium text-gray-900">إدارة الحجوزات</h2>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 text-sm rounded-md ${
              statusFilter === "pending" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            قيد الانتظار
          </button>
          <button
            onClick={() => setStatusFilter("accepted")}
            className={`px-3 py-1 text-sm rounded-md ${
              statusFilter === "accepted" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            مقبولة
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1 text-sm rounded-md ${
              statusFilter === "rejected" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            مرفوضة
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1 text-sm rounded-md ${
              statusFilter === "completed" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            مكتملة
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4" dir="rtl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">جاري تحميل الحجوزات...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-md" dir="rtl">
          <p className="text-gray-500">لا توجد حجوزات {getStatusText(statusFilter)} حاليًا</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow" dir="rtl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  العميل
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الخدمة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  موعد الحجز
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الوقت
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المبلغ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.customer_name || "غير محدد"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.services?.name || booking.service_type || "غير محدد"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(booking.booking_date).split(",")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.available_slot || "غير محدد"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.total_amount ? `${booking.total_amount} ريال` : "غير محدد"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        booking.status,
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "accepted")}
                            className="text-green-600 hover:text-green-900"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                          >
                            رفض
                          </button>
                        </>
                      )}
                      {booking.status === "accepted" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "completed")}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          تحديث كمكتمل
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BookingManagement

