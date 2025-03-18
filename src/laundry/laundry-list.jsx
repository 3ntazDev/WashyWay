"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const LaundryList = ({ laundries, onAddService }) => {
  const [laundryServices, setLaundryServices] = useState({})
  const [expandedLaundry, setExpandedLaundry] = useState(null)
  const [loading, setLoading] = useState({})

  useEffect(() => {
    // جلب الخدمات لكل مغسلة عند توسيعها
    if (expandedLaundry) {
      fetchLaundryServices(expandedLaundry)
    }
  }, [expandedLaundry])

  const fetchLaundryServices = async (laundryId) => {
    try {
      setLoading((prev) => ({ ...prev, [laundryId]: true }))

      const { data, error } = await supabase.from("services").select("*").eq("laundry_id", laundryId)

      if (error) {
        console.error("Error fetching services:", error)
        return
      }

      setLaundryServices((prev) => ({
        ...prev,
        [laundryId]: data || [],
      }))
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [laundryId]: false }))
    }
  }

  const toggleLaundryExpand = (laundryId) => {
    setExpandedLaundry(expandedLaundry === laundryId ? null : laundryId)
  }

  if (laundries.length === 0) {
    return (
      <div className="p-4 border-t border-gray-200 text-center" dir="rtl">
        <p className="text-gray-500">لا توجد مغاسل مضافة. قم بإضافة مغسلة جديدة.</p>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200">
      <ul className="divide-y divide-gray-200">
        {laundries.map((laundry) => (
          <li key={laundry.id} className="p-4">
            <div className="flex justify-between items-center" dir="rtl">
              <div>
                <h5 className="text-lg font-medium text-gray-900">{laundry.name}</h5>
                <p className="text-sm text-gray-500">{laundry.location}</p>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => onAddService(laundry)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  إضافة خدمة
                </button>
                <button
                  onClick={() => toggleLaundryExpand(laundry.id)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {expandedLaundry === laundry.id ? "إخفاء الخدمات" : "عرض الخدمات"}
                </button>
              </div>
            </div>

            {expandedLaundry === laundry.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md" dir="rtl">
                <h6 className="text-sm font-medium text-gray-700 mb-2">الخدمات المقدمة:</h6>

                {loading[laundry.id] ? (
                  <p className="text-sm text-gray-500">جاري تحميل الخدمات...</p>
                ) : laundryServices[laundry.id]?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            الاسم
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            الوصف
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            السعر (ريال)
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            المدة (دقيقة)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {laundryServices[laundry.id].map((service) => (
                          <tr key={service.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {service.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">لا توجد خدمات مضافة لهذه المغسلة.</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LaundryList

