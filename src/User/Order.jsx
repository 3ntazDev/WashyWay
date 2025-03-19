"use client"

import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { Trash2, AlertCircle, CheckCircle } from "lucide-react"

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("bookings").select("*")
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
        return "bg-green-100 text-green-800"
      case "معلق":
        return "bg-yellow-100 text-yellow-800"
      case "ملغي":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#1a73e8] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
          <p className="text-gray-600">إدارة جميع طلبات الغسيل الخاصة بك</p>
        </div>

        {/* Notification message */}
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

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-600">لا توجد طلبات حتى الآن.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الطلب</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم العميل</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المغسلة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخدمة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوقت</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.laundry_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.service_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.booking_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.available_slot}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.status !== "مقبول" && (
                        <button
                          onClick={() => handleDelete(order.id, order.status)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Order

