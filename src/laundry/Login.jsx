import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LoginO = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // محاولة تسجيل الدخول باستخدام Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("⚠️ البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      // جلب بيانات المستخدم من Supabase auth
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setError("⚠️ حدث خطأ أثناء جلب بيانات المستخدم.");
        setLoading(false);
        return;
      }

      // التحقق من أن الحساب مفعل
      if (!userData.user.email_confirmed_at) {
        setError("⚠️ الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني.");
        setLoading(false);
        return;
      }

      // جلب بيانات الدور من جدول المستخدمين
      const { data: userInfo, error: roleError } = await supabase
        .from("users")
        .select("role, name, phone")
        .eq("id", userData.user.id)
        .single();

      if (roleError || userInfo?.role !== "owner") {
        setError("⚠️ ليس لديك صلاحية الوصول إلى هذه الصفحة.");
        setLoading(false);
        return;
      }

      // التحقق من وجود بيانات المغسلة في جدول laundries
      const { data: laundryData, error: laundryError } = await supabase
        .from("laundries")
        .select("*")
        .eq("owner_id", userData.user.id)
        .single();

      if (laundryError || !laundryData) {
        // إذا لم يكن هناك بيانات مغسلة، توجيه المستخدم إلى صفحة إضافة المغسلة
        setError("⚠️ لم يتم العثور على بيانات المغسلة.");
        setLoading(false);
        navigate("/owner/add-laundry");  // توجيه إلى صفحة إضافة المغسلة
        return;
      }

      // التحقق من وجود خدمات في جدول services
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("laundry_id", laundryData.id);

      if (servicesError || servicesData.length === 0) {
        setError("⚠️ لم يتم العثور على خدمات للمغسلة.");
        setLoading(false);
        navigate("/owner/add-laundry");  // توجيه إلى صفحة إضافة المغسلة لإضافة الخدمات
        return;
      }

      // إذا كانت جميع البيانات مكتملة، التوجيه إلى لوحة التحكم
      navigate("/owner/dashboard");
    } catch (err) {
      console.error("Error during login:", err);
      setError("⚠️ حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">تسجيل الدخول</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-r-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="البريد الإلكتروني"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="كلمة المرور"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/owner/register")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                سجل هنا
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginO;
