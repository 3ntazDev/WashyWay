import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Auth/useAuth";

const BookingFormPage = () => {
  const { user } = useAuth(); // الحصول على بيانات المستخدم
  const [laundries, setLaundries] = useState([]);
  const [selectedLaundry, setSelectedLaundry] = useState(""); // المغسلة المحددة
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(""); // الوقت المحدد
  const [bookingDate, setBookingDate] = useState(""); // التاريخ والوقت
  const [serviceType, setServiceType] = useState(""); // نوع الخدمة
  const [status, setStatus] = useState("pending"); // حالة الحجز
  const [totalAmount, setTotalAmount] = useState(0); // المبلغ الإجمالي
  const [error, setError] = useState(""); // الرسالة في حالة وجود خطأ

  useEffect(() => {
    // جلب قائمة المغاسل من قاعدة البيانات
    const fetchLaundries = async () => {
      try {
        const { data, error } = await supabase
          .from("laundries")
          .select("*");
        if (error) {
          console.error("Error fetching laundries:", error);
          setError("حدث خطأ أثناء تحميل المغاسل.");
        } else {
          setLaundries(data);
          setSelectedLaundry(data[0]?.id); // تعيين أول مغسلة بشكل افتراضي
        }
      } catch (error) {
        console.error("Error fetching laundries:", error);
        setError("حدث خطأ أثناء تحميل المغاسل.");
      }
    };
    fetchLaundries();
  }, []);

  useEffect(() => {
    if (selectedLaundry) {
      // جلب المواعيد المتاحة للمغسلة المحددة
      const fetchAvailableSlots = async () => {
        try {
          const { data, error } = await supabase
            .from("laundries")
            .select("available_slots")
            .eq("id", selectedLaundry);
          if (error) {
            console.error("Error fetching available slots:", error);
            setError("حدث خطأ أثناء تحميل المواعيد.");
          } else {
            setAvailableSlots(data[0]?.available_slots || []);
          }
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setError("حدث خطأ أثناء تحميل المواعيد.");
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedLaundry]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // التأكد من تعبئة جميع الحقول
    if (!selectedLaundry || !selectedSlot || !bookingDate || !serviceType) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }

    // إعداد بيانات الحجز
    const bookingData = {
      user_id: user.id,  // تأكد من أن user_id هو UUID صالح
      laundry_id: parseInt(selectedLaundry),  // تحويل الـ laundry_id إلى عدد صحيح (إذا كان يتطلب ذلك)
      service_type: serviceType,
      booking_date: bookingDate,
      available_slot: selectedSlot,  // تأكد من أن الوقت متاح
      status,
      total_amount: totalAmount,
    };

    console.log("Booking Data:", bookingData); // عرض بيانات الحجز في الـ console

    try {
      const { error } = await supabase.from("bookings").insert([bookingData]);
      if (error) {
        console.error("Error during booking:", error);
        setError("حدث خطأ أثناء الحجز.");
      } else {
        console.log("Booking successful!");
      }
    } catch (error) {
      console.error("Unexpected error during booking:", error);
      setError("حدث خطأ غير متوقع أثناء الحجز.");
    }
  };

  return (
    <div>
      <h1>حجز خدمة مغسلة</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>اختار المغسلة:</label>
          <select onChange={(e) => setSelectedLaundry(e.target.value)} value={selectedLaundry}>
            <option value="">اختر مغسلة</option>
            {laundries.map((laundry) => (
              <option key={laundry.id} value={laundry.id}>
                {laundry.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>اختار الوقت والتاريخ:</label>
          <input
            type="datetime-local"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>

        <div>
          <label>اختار الوقت المتاح:</label>
          <select onChange={(e) => setSelectedSlot(e.target.value)} value={selectedSlot}>
            <option value="">اختر الوقت</option>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))
            ) : (
              <option value="" disabled>لا توجد مواعيد متاحة</option>
            )}
          </select>
        </div>

        <div>
          <label>نوع الخدمة:</label>
          <select onChange={(e) => setServiceType(e.target.value)} value={serviceType}>
            <option value="">اختر نوع الخدمة</option>
            <option value="cleaning">تنظيف</option>
            <option value="washing">غسيل</option>
            <option value="dry_cleaning">تنظيف جاف</option>
          </select>
        </div>

        <button type="submit">إجراء الحجز</button>
      </form>
    </div>
  );
};

export default BookingFormPage;
