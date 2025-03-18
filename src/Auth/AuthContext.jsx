import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient"; // التأكد من أن supabase مضاف بشكل صحيح

// إنشاء السياق
const AuthContext = createContext();

// مكون مزود الجلسة
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // عند تحميل التطبيق، تحقق من الجلسة الحالية
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchUserRole(data.user.id);
      } else {
        setUser(null);
        setRole(null); // إزالة الدور إذا لم يكن هناك مستخدم مسجل دخول
      }
    };

    // تحقق من الجلسة مباشرة بعد تحميل التطبيق
    fetchUser();

    // استماع لتغيير حالة المصادقة (Login, Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null); // إزالة الدور إذا تم تسجيل الخروج
      }
    });

    return () => {
      authListener.subscription.unsubscribe(); // تنظيف الاستماع لتغييرات الجلسة
    };
  }, []);

  // تحميل الدور
  const fetchUserRole = async (userId) => {
    if (!userId) return;

    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userData?.role) {
      setRole(userData.role); // تعيين الدور (user, owner, etc.)
    } else {
      setRole(null);
    }
  };

  // التحقق من الأذونات
  const hasPermission = (requiredRole) => {
    return role === requiredRole; // تحقق من الدور المطلوب
  };

  return (
    <AuthContext.Provider value={{ user, role, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

// استخدام السياق
export const useAuth = () => {
  return useContext(AuthContext);
};

