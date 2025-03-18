import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LaundryForm from "./laundry-form";
import ServiceForm from "./service-form";
import LaundryList from "./laundry-list";

const DashboardPage = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    role: "",
    createdAt: "",
  });
  const [laundries, setLaundries] = useState([]);
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [showLaundryForm, setShowLaundryForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const navigate = useNavigate();

  // استخدام useCallback لتحسين أداء الـ useEffect في حال تغيير البيانات
  const updateUserData = useCallback(async () => {
    try {
      // الحصول على المستخدم الحالي باستخدام supabase.auth.getUser()
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (currentUser) {
        const { data, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        setUserData({
          email: currentUser.email || "",
          name: data.name || "غير محدد",
          role: data.role || "user",
          createdAt: data.created_at
            ? new Date(data.created_at).toLocaleDateString("ar-SA")
            : "غير محدد",
        });

        // جلب المغاسل الخاصة بالمستخدم
        fetchUserLaundries(currentUser.id);
      } else {
        navigate("/auth/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن هناك مستخدم
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }, [navigate]);

  // جلب المغاسل الخاصة بالمستخدم
  const fetchUserLaundries = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("laundries")
        .select("*")
        .eq("owner_id", userId);

      if (error) {
        console.error("Error fetching laundries:", error);
        return;
      }

      setLaundries(data || []);
    } catch (error) {
      console.error("Error fetching laundries:", error);
    }
  };

  useEffect(() => {
    updateUserData(); // تحديث بيانات المستخدم عند تحميل الصفحة
  }, [updateUserData]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut(); // تسجيل الخروج
      navigate("/auth/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddLaundry = () => {
    setShowLaundryForm(true);
    setShowServiceForm(false);
  };

  const handleAddService = (laundry) => {
    setSelectedLaundry(laundry);
    setShowServiceForm(true);
    setShowLaundryForm(false);
  };

  const handleLaundryAdded = async (newLaundry) => {
    // تحديث قائمة المغاسل بعد إضافة مغسلة جديدة
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      fetchUserLaundries(user.id);
    }
    setShowLaundryForm(false);
  };

  const handleServiceAdded = () => {
    // إغلاق نموذج إضافة الخدمة بعد الإضافة
    setShowServiceForm(false);
  };

  // التأكد من أن المستخدم هو "owner" فقط
  if (userData.role !== "owner") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-500">لا يمكنك الوصول إلى هذه الصفحة لأنك لست مالكًا</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900" dir="rtl">
              لوحة التحكم
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500" dir="rtl">
              معلومات الحساب الشخصي
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 text-right" dir="rtl">
                  الاسم الكامل
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="rtl">
                  {userData.name || "غير محدد"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 text-right" dir="rtl">
                  البريد الإلكتروني
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="rtl">
                  {userData.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 text-right" dir="rtl">
                  الدور
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="rtl">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      userData.role === "owner" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {userData.role === "owner" ? "مالك" : "مستخدم"}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 text-right" dir="rtl">
                  تاريخ التسجيل
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right" dir="rtl">
                  {userData.createdAt || "غير محدد"}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* قسم إدارة المغاسل */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900" dir="rtl">
              إدارة المغاسل
            </h3>
            <button
              onClick={handleAddLaundry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              إضافة مغسلة جديدة
            </button>
          </div>
          
          {showLaundryForm ? (
            <LaundryForm onLaundryAdded={handleLaundryAdded} onCancel={() => setShowLaundryForm(false)} />
          ) : showServiceForm ? (
            <ServiceForm 
              laundryId={selectedLaundry.id} 
              laundryName={selectedLaundry.name}
              onServiceAdded={handleServiceAdded} 
              onCancel={() => setShowServiceForm(false)} 
            />
          ) : (
            <LaundryList 
              laundries={laundries} 
              onAddService={handleAddService} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
