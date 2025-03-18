"use client"

import { useState } from "react"
import { supabase } from "../supabaseClient"

const ServiceForm = ({ laundryId, laundryName, onServiceAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // التحقق من صحة البيانات
      const price = Number.parseFloat(formData.price)
      const duration = Number.parseInt(formData.duration)

      if (isNaN(price) || price <= 0) {
        throw new Error("الرجاء إدخال سعر صحيح")
      }

      if (isNaN(duration) || duration <= 0) {
        throw new Error("الرجاء إدخال مدة صحيحة بالدقائق")
      }

      // استخدام طريقة بديلة: إدراج بدون تحديد المعرف
      // وترك PostgreSQL يتعامل مع إنشاء المعرف تلقائيًا
      const { data, error } = await supabase
        .from("services")
        .insert({
          laundry_id: laundryId,
          name: formData.name,
          description: formData.description,
          price: price,
          duration: duration,
        })
        .select()

      if (error) {
        throw new Error(error.message)
      }

      // إعادة تعيين النموذج وإخبار الأب بالإضافة الناجحة
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
      })

      onServiceAdded(data[0])
    } catch (error) {
      console.error("Error adding service:", error)
      setError(error.message || "حدث خطأ أثناء إضافة الخدمة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <h4 className="text-md font-medium text-gray-900 mb-4" dir="rtl">
        إضافة خدمة جديدة لـ {laundryName}
      </h4>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4" dir="rtl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} dir="rtl">
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              اسم الخدمة
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              وصف الخدمة
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              السعر (ريال)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              المدة (دقيقة)
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              required
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "جاري الإضافة..." : "إضافة الخدمة"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceForm


