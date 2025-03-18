"use client"

import { useState } from "react"
import { supabase } from "../supabaseClient"

const LaundryForm = ({ onLaundryAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, "0")
      slots.push(`${formattedHour}:00`)
    }
    return slots
  }

  const handleTimeSlotChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setSelectedTimeSlots((prev) => [...prev, value])
    } else {
      setSelectedTimeSlots((prev) => prev.filter((slot) => slot !== value))
    }
  }

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
      // الحصول على المستخدم الحالي
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw new Error("لم يتم العثور على المستخدم")
      }

      // إضافة المغسلة الجديدة
      const { data, error } = await supabase
        .from("laundries")
        .insert([
          {
            owner_id: user.id,
            name: formData.name,
            location: formData.location,
            description: formData.description,
            phone: formData.phone,
            available_slots: selectedTimeSlots.length > 0 ? selectedTimeSlots : null,
          },
        ])
        .select()

      if (error) {
        throw new Error(error.message)
      }

      // إعادة تعيين النموذج وإخبار الأب بالإضافة الناجحة
      setFormData({
        name: "",
        location: "",
        description: "",
        phone: "",
      })

      setSelectedTimeSlots([])

      onLaundryAdded(data[0])
    } catch (error) {
      console.error("Error adding laundry:", error)
      setError(error.message || "حدث خطأ أثناء إضافة المغسلة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <h4 className="text-md font-medium text-gray-900 mb-4" dir="rtl">
        إضافة مغسلة جديدة
      </h4>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4" dir="rtl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} dir="rtl">
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              اسم المغسلة
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

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              الموقع
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              الوصف
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              رقم الهاتف
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="available_slots" className="block text-sm font-medium text-gray-700">
              المواعيد المتاحة
            </label>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {generateTimeSlots().map((slot) => (
                <div key={slot} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`time-${slot}`}
                    name={`time-${slot}`}
                    value={slot}
                    checked={selectedTimeSlots.includes(slot)}
                    onChange={handleTimeSlotChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`time-${slot}`} className="mr-2 block text-sm text-gray-700">
                    {slot}
                  </label>
                </div>
              ))}
            </div>
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
            {loading ? "جاري الإضافة..." : "إضافة المغسلة"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LaundryForm

