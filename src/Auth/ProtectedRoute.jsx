import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // تأكد من أن supabase مضاف بشكل صحيح

const ProtectedRoute = ({ element, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // جلب الجلسة الحالية
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchUserRole(data.user.id); // جلب الدور للمستخدم
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    const fetchUserRole = async (userId) => {
      if (!userId) return;

      // جلب الدور من قاعدة البيانات
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userData?.role) {
        setRole(userData.role);
      }
    };

    fetchUser();
  }, []);

  // إذا كانت الصفحة في حالة تحميل
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // إذا لم يكن المستخدم مسجلاً دخوله، أعد توجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/auth/login" />;
  }

  // إذا كان الدور غير مطابق للدور المطلوب، أعد توجيهه إلى الصفحة الرئيسية المناسبة
  if (role !== requiredRole) {
    // إذا كان الدور "owner"، يتم توجيههم إلى لوحة التحكم الخاصة بالمغسلة
    if (role === "owner") {
      return <Navigate to="/laundry/dashboard" />;
    }
    // إذا كان الدور "user"، يتم توجيههم إلى صفحة الحجز الخاصة بالمستخدم
    return <Navigate to="/user/booking" />;
  }

  return element; // عرض الصفحة إذا كانت الأذونات صحيحة
};

export default ProtectedRoute;
