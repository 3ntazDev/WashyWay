import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Auth/useAuth";
import { useParams } from "react-router-dom";

const BookingFormPage = () => {
  const { user } = useAuth();
  const { laundryId } = useParams(); // الحصول على معرّف المغسلة من الـ URL
  const [laundry, setLaundry] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [services, setServices] = useState([]); // لتخزين الخدمات المتاحة للمغسلة
  const [status, setStatus] = useState("pending");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (laundryId) {
      const fetchLaundryDetails = async () => {
        try {
          const { data, error } = await supabase
            .from("laundries")
            .select("*")
            .eq("id", laundryId)
            .single(); // نحصل على المغسلة الواحدة
          if (error) throw error;
          setLaundry(data);
        } catch (error) {
          setMessage({ type: "error", text: "حدث خطأ أثناء تحميل المغسلة." });
        }
      };
      fetchLaundryDetails();
    }
  }, [laundryId]);

  useEffect(() => {
    if (laundry) {
      const fetchAvailableSlots = async () => {
        try {
          const { data, error } = await supabase
            .from("laundries")
            .select("available_slots")
            .eq("id", laundry.id);
          if (error) throw error;
          setAvailableSlots(data[0]?.available_slots || []);
        } catch (error) {
          setMessage({ type: "error", text: "حدث خطأ أثناء تحميل المواعيد." });
        }
      };
      fetchAvailableSlots();

      // جلب الخدمات الخاصة بالمغسلة
      const fetchServices = async () => {
        try {
          const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("laundry_id", laundry.id); // جلب الخدمات المرتبطة بالمغسلة
          if (error) throw error;
          setServices(data);
        } catch (error) {
          setMessage({ type: "error", text: "حدث خطأ أثناء تحميل الخدمات." });
        }
      };
      fetchServices();
    }
  }, [laundry]);

  // التحقق من وجود حجز آخر في نفس التاريخ
  const checkExistingBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("laundry_id", laundry.id)
        .eq("booking_date", bookingDate)  // التحقق من التاريخ
        .eq("user_id", user.id); // التحقق من الحجز لنفس المستخدم
      if (error) throw error;

      if (data.length > 0) {
        setMessage({ type: "error", text: "لا يمكنك حجز موعد في نفس اليوم لهذه المغسلة." });
        return true; // إذا كان هناك حجز سابق
      }
      return false; // إذا لم يكن هناك حجز سابق
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء التحقق من الحجوزات السابقة." });
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!laundry || !selectedSlot || !bookingDate || !serviceType) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول." });
      return;
    }

    // التحقق من وجود حجز مسبق في نفس التاريخ
    const isExistingBooking = await checkExistingBooking();
    if (isExistingBooking) return; // إذا كان هناك حجز سابق، لا يتم الحجز

    const bookingData = {
      user_id: user.id,
      laundry_id: laundry.id,
      service_type: serviceType,
      booking_date: bookingDate,
      available_slot: selectedSlot,
      status,
      total_amount: totalAmount,
      customer_name: user.name, // إضافة اسم العميل مباشرة
      laundry_name: laundry.name, // إضافة اسم المغسلة مباشرة
    };

    try {
      const { error } = await supabase.from("bookings").insert([bookingData]);
      if (error) throw error;

      setMessage({
        type: "success",
        text: "تم الحجز بنجاح! يمكنك مراجعة سجل الحجوزات.",
      });
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الحجز، حاول مرة أخرى." });
    }
  };

  if (!laundry) {
    return <div>جاري تحميل بيانات المغسلة...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">حجز خدمة مغسلة</h1>
      {message.text && (
        <p className={`p-4 mb-4 text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"} rounded`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">المغسلة: {laundry.name}</label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">اختار التاريخ:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">اختار الوقت المتاح:</label>
          <select
            onChange={(e) => setSelectedSlot(e.target.value)}
            value={selectedSlot}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">اختر الوقت</option>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))
            ) : (
              <option value="" disabled>
                لا توجد أوقات متاحة
              </option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">اختار الخدمة:</label>
          <select
            onChange={(e) => setServiceType(e.target.value)}
            value={serviceType}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">اختر نوع الخدمة</option>
            {services.length > 0 ? (
              services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} - {service.price} ريال
                </option>
              ))
            ) : (
              <option value="" disabled>
                لا توجد خدمات متاحة
              </option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">المبلغ الإجمالي:</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="المبلغ الإجمالي"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">حجز الآن</button>
      </form>
    </div>
  );
};

export default BookingFormPage;
