import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CompleteMissingProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "user"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!currentUser) {
          navigate("/auth/login");
          return;
        }

        setUser(currentUser);

        const { data: existingUser, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (dbError) {
          if (dbError.code === "PGRST116") {
            setLoading(false);
            return;
          } else {
            throw dbError;
          }
        }

        if (existingUser) {
          navigate("/user/dashboard");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error checking user:", err);
        setError("حدث خطأ في التحقق من بيانات المستخدم");
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("لم يتم العثور على بيانات المستخدم");
      }

      if (!formData.name || !formData.phone) {
        throw new Error("جميع الحقول مطلوبة");
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error("رقم الهاتف يجب أن يتكون من 10 أرقام");
      }

      const { error: upsertError } = await supabase
        .from("users")
        .upsert([
          {
            id: user.id,
            email: user.email,
            name: formData.name,
            phone: formData.phone,
            role: formData.role,
            is_verified: false,
            created_at: new Date().toISOString()
          }
        ]);

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        throw new Error("حدث خطأ أثناء حفظ البيانات");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);

    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            إكمال بيانات الملف الشخصي
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            مرحباً بك! يرجى إكمال بياناتك الشخصية للمتابعة
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-r-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-r-4 border-green-500 p-4 rounded-md">
            <p className="text-green-700 text-sm">
              تم حفظ البيانات بنجاح! جاري توجيهك إلى لوحة التحكم...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">لا يمكن تغيير البريد الإلكتروني</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              الاسم الكامل
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="أدخل رقم هاتفك"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              الدور
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="user">مستخدم</option>
              <option value="admin">مشرف</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                saving 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {saving ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteMissingProfile;