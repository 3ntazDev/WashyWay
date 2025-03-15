import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // استيراد supabase

function FormLaundry() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    phone: '',
    available_slots: '', // أوقات المغسلة المتاحة
    img_url: '', // رابط الصورة
  });

  // دالة لتحديث بيانات المدخلات
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // دالة لإرسال بيانات المغسلة إلى Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = supabase.auth.user(); // الحصول على المستخدم الذي قام بتسجيل الدخول

    const { data, error } = await supabase
      .from('laundries') // تحديد الجدول
      .insert([
        {
          name: formData.name,
          location: formData.location,
          description: formData.description,
          phone: formData.phone,
          available_slots: formData.available_slots.split(','), // تحويل الأوقات المتاحة إلى مصفوفة
          img_url: formData.img_url, // رابط الصورة
          owner_id: user.id, // ربط المغسلة مع صاحبها
        }
      ]);

    if (error) {
      console.error('حدث خطأ أثناء إرسال البيانات:', error.message);
      alert('حدث خطأ أثناء إرسال البيانات');
    } else {
      alert('تم إدخال بيانات المغسلة بنجاح');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">إدخال بيانات المغسلة</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">اسم المغسلة</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-600">الموقع</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">وصف المغسلة</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">رقم الهاتف</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="available_slots" className="block text-sm font-medium text-gray-600">الأوقات المتاحة (فصلها بفواصل)</label>
            <input
              type="text"
              id="available_slots"
              name="available_slots"
              value={formData.available_slots}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="img_url" className="block text-sm font-medium text-gray-600">رابط الصورة</label>
            <input
              type="text"
              id="img_url"
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إضافة المغسلة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormLaundry;
