import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

function BookingForm() {
  const { laundryId } = useParams(); // الحصول على ID المغسلة من URL
  const [laundry, setLaundry] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // جلب بيانات المغسلة والخدمات المتاحة
  useEffect(() => {
    const fetchLaundryDetails = async () => {
      try {
        const { data: laundryData, error: laundryError } = await supabase
          .from("laundries")
          .select("*")
          .eq("id", laundryId)
          .single();

        if (laundryError) throw laundryError;

        setLaundry(laundryData);

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("laundry_id", laundryId);

        if (servicesError) throw servicesError;

        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching laundry or services:", error);
        setError("حدث خطأ أثناء جلب بيانات المغسلة أو الخدمات");
      }
    };

    fetchLaundryDetails();
  }, [laundryId]);

  // تحديد المواعيد المتاحة بناءً على التاريخ
  useEffect(() => {
    if (laundry && bookingDate) {
      const slots = laundry.available_slots || [];
      setAvailableSlots(slots);
    }
  }, [laundry, bookingDate]);

  // التعامل مع التغيير في التاريخ
  const handleDateChange = (e) => {
    setBookingDate(e.target.value);
  };

  // التعامل مع التغيير في الوقت المتاح
  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  // التعامل مع التغيير في الخدمة
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  // التعامل مع إرسال الحجز
  const handleBooking = async (e) => {
    e.preventDefault();
  
    if (!selectedService || !bookingDate || !selectedSlot) {
      setError("يرجى اختيار الخدمة، التاريخ، والوقت");
      return;
    }
  
    try {
      // الحصول على المستخدم الحالي
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError || !user) {
        throw new Error("لم يتم العثور على المستخدم");
      }
  
      // استخدام user.id بدلاً من "user-id"
      const { data, error } = await supabase.from("bookings").insert([
        {
          user_id: user.id,  // استخدم user.id هنا
          laundry_id: laundry.id,
          service_type: selectedService,
          booking_date: bookingDate,
          available_slot: selectedSlot,
        },
      ]);
  
      if (error) throw error;
  
      // الانتقال إلى صفحة التأكيد
      navigate("/user/orders");
    } catch (error) {
      console.error("Error booking service:", error);
      setError("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.");
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">حجز خدمة في {laundry?.name}</h1>
      
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleBooking} dir="rtl">
        <div className="mb-4">
          <label htmlFor="service" className="block text-sm font-medium text-gray-700">اختر الخدمة</label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">اختر خدمة</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name} - {service.price} ريال
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">اختر التاريخ</label>
          <input
            type="date"
            id="date"
            value={bookingDate}
            onChange={handleDateChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="slot" className="block text-sm font-medium text-gray-700">اختر الوقت المتاح</label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={handleSlotChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">اختر الوقت</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            تأكيد الحجز
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
