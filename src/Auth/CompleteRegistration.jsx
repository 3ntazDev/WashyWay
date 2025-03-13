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
        setError("فشل في جلب بيانات المستخدم");
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
    delete updatedData.id; // إزالة الـ ID لتجنب تحديثه

    const { error } = await supabase
      .from("users")
      .update(updatedData)
      .eq("id", userId);

    if (error) {
      setError("فشل في تحديث البيانات");
    } else {
      navigate("/user/dashboard");
    }
    setSaving(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `profile_pictures/${fileName}`;

    try {
      setLoading(true);
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update the user data with the new profile picture URL
      setUserData({
        ...userData,
        profile_picture: data.publicUrl
      });
      
    } catch (error) {
      setError('خطأ في رفع الصورة');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">جاري التحميل...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded-md max-w-md w-full">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => navigate('/auth/login')} 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">إكمال البيانات</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            يرجى إكمال بياناتك الشخصية
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
          <div className="space-y-4">
            {userData.profile_picture && (
              <div className="flex justify-center">
                <img 
                  src={userData.profile_picture || "/placeholder.svg"} 
                  alt="صورة الملف الشخصي" 
                  className="h-24 w-24 rounded-full object-cover border-2 border-indigo-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                صورة الملف الشخصي
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
            
            {Object.entries(userData).map(([key, value]) =>
              key !== "id" && key !== "profile_picture" ? (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {getFieldLabel(key)}
                  </label>
                  <input
                    id={key}
                    type={getInputType(key)}
                    value={value || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, [key]: e.target.value })
                    }
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required={isRequiredField(key)}
                  />
                </div>
              ) : null
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {saving ? "جاري الحفظ..." : "حفظ وإكمال"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions for field labels and types
function getFieldLabel(key) {
  const labels = {
    email: "البريد الإلكتروني",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    role: "الدور",
    is_verified: "تم التحقق",
    created_at: "تاريخ الإنشاء",
    updated_at: "تاريخ التحديث"
  };
  return labels[key] || key;
}

function getInputType(key) {
  if (key === "email") return "email";
  if (key === "phone") return "tel";
  if (key === "password") return "password";
  if (key === "created_at" || key === "updated_at") return "datetime-local";
  if (key === "is_verified") return "checkbox";
  return "text";
}

function isRequiredField(key) {
  const requiredFields = ["email", "name", "role"];
  return requiredFields.includes(key);
}

export default CompleteRegistration;
