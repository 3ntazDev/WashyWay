import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { User, Mail, LogOut } from 'lucide-react'; // استيراد أيقونات من Lucide

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(''); // حالة لتخزين اسم المستخدم
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUser(user);
        fetchProfileImage(user.id);
        fetchUsername(user.id); // جلب اسم المستخدم من قاعدة البيانات
      }
    };
    fetchUser();
  }, []);

  const fetchProfileImage = async (userId) => {
    // يمكنك استبدال هذا الجزء بطلب لاسترجاع صورة المستخدم من قاعدة البيانات
    // هنا نستخدم صورة افتراضية
    setProfileImage('https://via.placeholder.com/150');
  };

  const fetchUsername = async (userId) => {
    // جلب اسم المستخدم من جدول users
    const { data, error } = await supabase
      .from('users') // اسم الجدول الخاص بالمستخدمين
      .select('name') // جلب الاسم
      .eq('id', userId) // البحث باستخدام معرف المستخدم
      .single();

    if (error) {
      console.error('Error fetching username:', error.message);
    } else {
      setUsername(data?.name || user.email.split('@')[0]); // استخدام الاسم أو البريد الإلكتروني كاسم افتراضي
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-lg">جارٍ التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-2xl transform transition-all hover:scale-105">
        <div className="flex flex-col items-center space-y-6">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          )}
          <h2 className="text-4xl font-bold text-gray-900 mt-4">مرحبًا، {username}!</h2>
          <p className="text-lg text-gray-600">نحن سعداء برؤيتك هنا!</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-lg hover:bg-gray-100/70 transition-all">
            <Mail className="w-6 h-6 text-indigo-500" />
            <p className="text-lg text-gray-700"><strong>البريد الإلكتروني:</strong> {user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

