import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("customer"); // ✅ الدور الافتراضي
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ تسجيل حساب عادي
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError("⚠️ خطأ في التسجيل: " + error.message);
      return;
    }

    if (data?.user) {
      // ✅ حفظ بيانات المستخدم في قاعدة البيانات
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        },
      ]);

      navigate("/User/Home");
    }
  };

  // ✅ تسجيل الدخول باستخدام Google
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
        <h2 className="text-2xl font-bold text-center text-gray-900">تسجيل حساب جديد</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="محمد العتيبي"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="**********"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md">
            تسجيل حساب جديد
          </button>
        </form>

        {/* زر تسجيل الدخول باستخدام Google */}
        <div className="text-center">
          <div className="divider my-4">أو</div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-gray-700">تسجيل الدخول باستخدام Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
