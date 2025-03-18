import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";  // تأكد من إعداد Supabase بشكل صحيح
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

function BookingFormPage() {
  const { laundryId } = useParams();  // جلب ID المغسلة من الرابط
  const [laundry, setLaundry] = useState(null);  // بيانات المغسلة
  const [services, setServices] = useState([]);  // خدمات المغسلة
  const [selectedService, setSelectedService] = useState(null);  // الخدمة المختارة
  const [selectedTime, setSelectedTime] = useState("");  // الوقت المختار
  const [bookingDate, setBookingDate] = useState("");  // تاريخ الحجز
  const [loading, setLoading] = useState(false);  // حالة التحميل
  const [submitting, setSubmitting] = useState(false);  // حالة الإرسال
  const [error, setError] = useState(null);  // حالة الخطأ
  const [bookingSuccess, setBookingSuccess] = useState(false);  // حالة النجاح
  const [bookingId, setBookingId] = useState(null);  // ID الحجز
  const [userName, setUserName] = useState(""); // اسم المستخدم (بدون useAuth)
  const navigate = useNavigate();  // التوجيه

  // جلب المواعيد المتاحة من المغسلة
  const timeSlots = laundry?.available_slots || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب بيانات المغسلة
        const { data: laundryData, error: laundryError } = await supabase
          .from("laundries")
          .select("*")
          .eq("id", laundryId)
          .single();

        if (laundryError) throw laundryError;
        setLaundry(laundryData);

        // جلب الخدمات المتاحة لهذه المغسلة
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("laundry_id", laundryId);

        if (servicesError) throw servicesError;
        setServices(servicesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [laundryId]);

  const handleBookingSubmit = async () => {
    // التحقق من الحقول
    if (!userName) {
      alert("يرجى إدخال اسم المستخدم");
      return;
    }

    if (!laundry) {
      setError("لم يتم العثور على بيانات المغسلة");
      return;
    }

    if (!selectedService) {
      alert("يرجى اختيار نوع الخدمة");
      return;
    }

    if (!bookingDate) {
      alert("يرجى اختيار تاريخ الحجز");
      return;
    }

    if (!selectedTime) {
      alert("يرجى اختيار وقت الحجز");
      return;
    }

    setSubmitting(true);
    try {
      // تنسيق التاريخ والوقت للحجز
      const formattedDateTime = `${bookingDate}T${selectedTime}:00`;

      // إدخال الحجز في قاعدة البيانات
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_name: userName,  // استخدام اسم المستخدم الذي تم إدخاله
            laundry_id: laundry.id,
            service_type: selectedService.name,
            booking_date: formattedDateTime,
            status: "pending",
            total_amount: selectedService.price,
            available_slot: selectedTime,
            laundry_name: laundry.name,
          },
        ])
        .select();

      if (error) throw error;

      // تعيين ID الحجز عند النجاح
      if (data && data.length > 0) {
        setBookingId(data[0].id);
      }

      // إظهار حالة النجاح
      setBookingSuccess(true);

      // إعادة التوجيه إلى صفحة الحجوزات بعد 5 ثواني
      setTimeout(() => {
        navigate("/user/bookings");
      }, 5000);
    } catch (error) {
      console.error("Error booking:", error);
      setError("حدث خطأ في عملية الحجز. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-white text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
          <p className="text-gray-600 mb-4">تم تأكيد حجزك في {laundry.name}</p>
          <p className="text-gray-500 mb-6">سيتم تحويلك إلى صفحة الحجوزات خلال 5 ثوانٍ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الحجز</h2>

        {/* إدخال اسم المستخدم */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">اسم المستخدم</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="أدخل اسمك"
          />
        </div>

        {/* عرض بيانات المغسلة */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">تفاصيل المغسلة</h3>
          <p className="text-gray-600">{laundry?.name}</p>
          <p className="text-gray-600">{laundry?.location}</p>
        </div>

        {/* اختيار الخدمة */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">اختار الخدمة</label>
          <select
            onChange={(e) => setSelectedService(JSON.parse(e.target.value))}
            className="w-full p-3 border border-gray-200 rounded-lg"
          >
            <option value="">اختار خدمة</option>
            {services.map((service) => (
              <option key={service.id} value={JSON.stringify(service)}>
                {service.name} - {service.price} ريال
              </option>
            ))}
          </select>
        </div>

        {/* اختيار التاريخ */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">اختار التاريخ</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 border border-gray-200 rounded-lg"
          />
        </div>

        {/* اختيار الوقت */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">اختار الوقت</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 rounded-lg border-2 ${
                  selectedTime === time
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-blue-300 text-gray-600"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* زر التأكيد */}
        <button
          onClick={handleBookingSubmit}
          disabled={submitting || !selectedService || !bookingDate || !selectedTime}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-4 px-6 rounded-lg transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري الحجز...
            </>
          ) : (
            <>
              تأكيد الحجز
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default BookingFormPage;
