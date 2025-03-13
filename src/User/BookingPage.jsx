import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Auth/useAuth"; // ✅ استخدام حالة المستخدم

function BookingPage() {
  const [laundries, setLaundries] = useState([]);
  const { user } = useAuth(); // ✅ جلب بيانات المستخدم
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // ✅ جلب اسم المستخدم من قاعدة البيانات
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (data) setUserName(data.name);
      }
    };

    const fetchLaundries = async () => {
      const { data, error } = await supabase.from("laundries").select("*");
      if (error) console.error("Error fetching laundries:", error);
      else setLaundries(data);
    };

    fetchUserName();
    fetchLaundries();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        {/* ✅ رسالة ترحيبية تحتوي على الاسم والإيميل */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {userName ? `👋 مرحبًا، ${userName}!` : "👋 مرحبًا بك!"}
        </h1>
        {user && (
          <p className="text-gray-600 text-center mb-6">
            📧 إيميلك: <span className="font-medium">{user.email}</span>
          </p>
        )}
        <p className="text-gray-600 text-center mb-6">
          هذه هي قائمة المغاسل المتاحة، اختر واحدة للحجز.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">🚗 المغاسل المتاحة</h2>
        <ul className="divide-y divide-gray-200">
          {laundries.map((laundry) => (
            <li key={laundry.id} className="p-4 hover:bg-gray-50 transition">
              <span className="font-medium text-gray-900">{laundry.name}</span> -{" "}
              <span className="text-gray-600">{laundry.location}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BookingPage;
