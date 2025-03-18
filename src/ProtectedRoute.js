import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, role, hasPermission } = useAuth();

  // تحقق من حالة الدور
  console.log("User role:", role);  // سجل الدور للتحقق

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
