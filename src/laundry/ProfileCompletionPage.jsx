import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CompleteRegistration = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("لم يتم العثور على معرف المستخدم");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setUserData({ id: userId });
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedData = { ...userData };

    const { error } = await supabase
      .from("users")
      .upsert(updatedData);

    if (error) {
      setError("فشل في تحديث البيانات");
    } else {
      // تسجيل الخروج بعد إتمام البيانات
      await supabase.auth.signOut();
      // التوجيه إلى صفحة تسجيل الدخول
      navigate("/laundry/login");
    }
    setSaving(false);
  };

  if (loading) return <div>جاري التحميل...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">إكمال بياناتك</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-r-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              الاسم
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={userData.name || ""}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="الاسم"
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
              value={userData.phone || ""}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="رقم الهاتف"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${saving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {saving ? "جاري الحفظ..." : "حفظ وإكمال"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              إذا كنت بحاجة لمساعدة، يمكنك <a href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">الاتصال بنا</a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;
