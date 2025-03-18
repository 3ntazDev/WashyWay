import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // تأكد من استيراد supabase بشكل صحيح

// مكون لحماية الوصول للصفحات بناءً على الدور
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = supabase.auth.user(); // جلب بيانات المستخدم

  if (!user) {
    return <Navigate to="/auth/login" />; // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
  }

  // التحقق من الدور
  if (user.user_metadata?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />; // إعادة التوجيه إلى صفحة غير مصرح بها إذا كان الدور غير صحيح
  }

  return children; // السماح بالوصول إلى الصفحة إذا كان الدور صحيحاً
};

export default ProtectedRoute;
