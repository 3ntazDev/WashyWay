"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, Package, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

function BookingForm() {
  const { laundryId } = useParams()
  const [laundry, setLaundry] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState("")
  const [bookingDate, setBookingDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // جلب بيانات المغسلة والخدمات المتاحة
  useEffect(() => {
    const fetchLaundryDetails = async () => {
      setLoading(true)
      try {
        const { data: laundryData, error: laundryError } = await supabase
          .from("laundries")
          .select("*")
          .eq("id", laundryId)
          .single()

        if (laundryError) throw laundryError

        setLaundry(laundryData)

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("laundry_id", laundryId)

        if (servicesError) throw servicesError

        setServices(servicesData)
      } catch (error) {
        console.error("Error fetching laundry or services:", error)
        setError("حدث خطأ أثناء جلب بيانات المغسلة أو الخدمات")
      } finally {
        setLoading(false)
      }
    }

    fetchLaundryDetails()
  }, [laundryId])

  // تحديد المواعيد المتاحة بناءً على التاريخ
  useEffect(() => {
    if (laundry && bookingDate) {
      const slots = laundry.available_slots || []
      setAvailableSlots(slots)
    }
  }, [laundry, bookingDate])

  // التعامل مع التغيير في التاريخ
  const handleDateChange = (e) => {
    setBookingDate(e.target.value)
  }

  // التعامل مع التغيير في الوقت المتاح
  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value)
  }

  // التعامل مع التغيير في الخدمة
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value)
  }

  // التعامل مع إرسال الحجز
  const handleBooking = async (e) => {
    e.preventDefault()

    if (!selectedService || !bookingDate || !selectedSlot) {
      setError("يرجى اختيار الخدمة، التاريخ، والوقت")
      return
    }

    try {
      // الحصول على المستخدم الحالي
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("لم يتم العثور على المستخدم")
      }

      // استخدام user.id بدلاً من "user-id"
      const { data, error } = await supabase.from("bookings").insert([
        {
          user_id: user.id,
          laundry_id: laundry.id,
          service_type: selectedService,
          booking_date: bookingDate,
          available_slot: selectedSlot,
        },
      ])

      if (error) throw error

      // الانتقال إلى صفحة التأكيد
      navigate("/user/orders")
    } catch (error) {
      console.error("Error booking service:", error)
      setError("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-[#1a73e8] animate-spin mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل بيانات المغسلة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#1a73e8] hover:text-[#1565c0] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 ml-1" />
            <span>العودة</span>
          </button>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Laundry header */}
          <div className="bg-[#1a73e8] text-white p-6">
            <h1 className="text-2xl font-bold">{laundry?.name}</h1>
            <p className="text-blue-100 mt-1">{laundry?.location}</p>
          </div>

          {/* Form content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">حجز خدمة غسيل</h2>

            {error && (
              <div className="mb-6 bg-red-50 border-r-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 ml-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleBooking}>
              {/* Service selection */}
              <div className="mb-6">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Package className="h-5 w-5 ml-2 text-[#1a73e8]" />
                  اختر الخدمة
                </label>
                <div className="relative">
                  <select
                    id="service"
                    value={selectedService}
                    onChange={handleServiceChange}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1a73e8] focus:border-[#1a73e8] appearance-none text-gray-700"
                  >
                    <option value="">اختر خدمة</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name} - {service.price} ريال
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-5 w-5 ml-2 text-[#1a73e8]" />
                  اختر التاريخ
                </label>
                <input
                  type="date"
                  id="date"
                  value={bookingDate}
                  onChange={handleDateChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1a73e8] focus:border-[#1a73e8] text-gray-700"
                />
              </div>

              {/* Time slot selection */}
              <div className="mb-8">
                <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="h-5 w-5 ml-2 text-[#1a73e8]" />
                  اختر الوقت المتاح
                </label>
                <div className="relative">
                  <select
                    id="slot"
                    value={selectedSlot}
                    onChange={handleSlotChange}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1a73e8] focus:border-[#1a73e8] appearance-none text-gray-700"
                    disabled={!bookingDate}
                  >
                    <option value="">اختر الوقت</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        يرجى اختيار التاريخ أولاً
                      </option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#1a73e8] hover:bg-[#1565c0] text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
              >
                تأكيد الحجز
              </button>
            </form>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">ملاحظات مهمة:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>يرجى الحضور قبل الموعد بـ 15 دقيقة</li>
            <li>يمكنك إلغاء الحجز قبل 24 ساعة من الموعد</li>
            <li>في حال التأخر أكثر من 15 دقيقة، قد يتم إلغاء الحجز</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

