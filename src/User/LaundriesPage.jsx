import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom"; // تأكد من أنك تستخدم useNavigate

function LaundriesPage() {
  const [laundries, setLaundries] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // تأكد من أنك تستخدم useNavigate وليس useHistory

  useEffect(() => {
    console.log("Page loaded, fetching laundries..."); // التحقق من تحميل الصفحة
    const fetchLaundries = async () => {
      const { data, error } = await supabase.from("laundries").select("*");
      if (error) {
        console.error("Error fetching laundries:", error);
      } else {
        setLaundries(data);
      }
    };

    fetchLaundries();
  }, []);

  const handleRegister = (laundryId) => {
    console.log("Navigating to booking page for laundry ID:", laundryId); // تحقق من أن الزر يعمل
    navigate(`/booking/${laundryId}`);
  };

  return (
    <div>
      <h1>المغاسل</h1>
      {laundries.map((laundry) => (
        <div key={laundry.id}>
          <h3>{laundry.name}</h3>
          <button onClick={() => handleRegister(laundry.id)}>احجز الآن</button>
        </div>
      ))}
    </div>
  );
}

export default LaundriesPage;
