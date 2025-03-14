import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/useAuth";

function BookingFormPage() {
  const { laundryId } = useParams(); // استخراج معرف المغسلة من URL
  const [laundry, setLaundry] = useState(null);
  const [bookingDate, setBookingDate] = useState(""); // تاريخ الحجز
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaundryDetails = async () => {
      const { data, error } = await supabase
        .from("laundries")
        .select("*")
        .eq("id", laundryId)
        .single();
      if (data) {
        setLaundry(data);
      } else {
        console.error("Error fetching laundry details:", error);
      }
    };
    fetchLaundryDetails();
  }, [laundryId]);

  const handleBookingSubmit = async () => {
    console.log("Submitting booking...");
    if (user && laundry && bookingDate) {
      console.log("User: ", user);
      console.log("Laundry: ", laundry);
      console.log("Booking Date: ", bookingDate);

      const { error } = await supabase.from("bookings").insert([
        {
          user_id: user.id,
          laundry_id: laundry.id,
          booking_date: bookingDate,
          status: "pending", // حالة الحجز
        },
      ]);
      
      if (error) {
        console.error("Error booking:", error);
      } else {
        console.log("Booking successful");
        alert("تم الحجز بنجاح!");
        navigate("/user/bookings"); // بعد الحجز، يتم التوجيه إلى صفحة الحجوزات
      }
    } else {
      alert("يرجى تحديد التاريخ أولاً");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {laundry ? (
        <div>
          <h2 className="text-2xl font-bold">{laundry.name}</h2>
          <p>{laundry.location}</p>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="mt-4 p-2 border rounded"
          />
          <button
            onClick={handleBookingSubmit}
            className="mt-6 bg-blue-500 text-white p-3 rounded-lg"
          >
            إتمام الحجز
          </button>
        </div>
      ) : (
        <p>جاري تحميل بيانات المغسلة...</p>
      )}
    </div>
  );
}

export default BookingFormPage;
