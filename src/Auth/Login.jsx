import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
 // تأكد من وجود صورة لشعار Google

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ دالة تسجيل الدخول بالبريد وكلمة المرور
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("⚠️ فشل تسجيل الدخول: " + error.message);
      return;
    }

    if (data?.user) {
      console.log("✅ تسجيل دخول ناجح:", data.user);
      localStorage.setItem("token", data.session.access_token);

      // ✅ جلب الدور من قاعدة البيانات
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError) {
        console.error("⚠️ خطأ أثناء جلب الدور:", userError);
      } else {
        localStorage.setItem("userRole", userData.role);
      }

      navigate("/User/Home"); // ✅ التوجيه لصفحة المستخدم
    }
  };

  // ✅ دالة تسجيل الدخول عبر Google
  const handleGoogleSignIn = async () => {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError("⚠️ فشل تسجيل الدخول باستخدام Google: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">تسجيل الدخول</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* 🔹 نموذج تسجيل الدخول بالبريد وكلمة المرور */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* 🔹 تسجيل الدخول باستخدام Google */}
        <div className="text-center">
          <div className="divider my-4">أو</div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-gray-700">تسجيل الدخول باستخدام Google</span>
          </button>
        </div>

        {/* 🔹 زر الانتقال إلى صفحة تسجيل الحساب */}
        <div className="text-center">
          <p className="text-sm text-gray-600">ليس لديك حساب؟</p>
          <button
            onClick={() => navigate("/auth/user/register")}
            className="text-indigo-600 hover:underline"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
