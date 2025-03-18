import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // التأكد من استيراد useAuth بشكل صحيح

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    // إذا لم يكن المستخدم مسجلاً دخوله، أعد توجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/auth/login" />;
  }

  if (!hasPermission(requiredRole)) {
    // إذا كان الدور غير مطابق للدور المطلوب، أعد توجيهه إلى صفحة غير مصرح لها
    return <Navigate to="/unauthorized" />;
  }

  return element; // عرض الصفحة إذا كانت الأذونات صحيحة
};

export default ProtectedRoute;
