import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from("bookings").select("*");
        if (error) throw error;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (orderId, status) => {
    if (status === "مقبول") {
      alert("لا يمكنك حذف طلب تم قبوله.");
      return;
    }
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الطلب؟")) return;

    const { error } = await supabase.from("bookings").delete().eq("id", orderId);

    if (error) {
      console.error("Error deleting order:", error);
      alert("حدث خطأ أثناء الحذف.");
    } else {
      setOrders(orders.filter((order) => order.id !== orderId));
      alert("تم حذف الطلب بنجاح!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 text-gray-800">
        <h1 className="text-3xl font-semibold mb-4">جميع الطلبات</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">رقم الطلب</th>
              <th className="py-2 px-4 border">اسم العميل</th>
              <th className="py-2 px-4 border">المغسلة</th>
              <th className="py-2 px-4 border">الخدمة</th>
              <th className="py-2 px-4 border">التاريخ</th>
              <th className="py-2 px-4 border">الوقت المتاح</th>
              <th className="py-2 px-4 border">الحالة</th>
              <th className="py-2 px-4 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-4 border">{order.id}</td>
                <td className="py-2 px-4 border">{order.name}</td> {/* عرض اسم العميل */}
                <td className="py-2 px-4 border">{order.laundry_name}</td>
                <td className="py-2 px-4 border">{order.service_type}</td>
                <td className="py-2 px-4 border">{order.booking_date}</td>
                <td className="py-2 px-4 border">{order.available_slot}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">
                  {order.status !== "مقبول" && (
                    <button
                      onClick={() => handleDelete(order.id, order.status)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      حذف
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
