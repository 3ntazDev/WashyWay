import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-lg">جارٍ التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 text-gray-800">
        <h2 className="text-3xl font-semibold mb-4">الملف الشخصي</h2>
        <p className="text-lg mb-2"><strong>البريد الإلكتروني:</strong> {user.email}</p>
        <p className="text-lg mb-2"><strong>المعرف:</strong> {user.id}</p>
        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;