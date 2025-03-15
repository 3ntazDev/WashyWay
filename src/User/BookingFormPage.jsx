"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../Auth/useAuth"
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Timer,
  ShowerHead,
  CheckSquare,
} from "lucide-react"

function BookingFormPage() {
  const { laundryId } = useParams()
  const [laundry, setLaundry] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [bookingDate, setBookingDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Generate time slots from 8 AM to 10 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch laundry details
        const { data: laundryData, error: laundryError } = await supabase
          .from("laundries")
          .select("*")
          .eq("id", laundryId)
          .single()

        if (laundryError) throw laundryError
        setLaundry(laundryData)

        // Fetch services for this laundry
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("laundry_id", laundryId)

        if (servicesError) throw servicesError
        setServices(servicesData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [laundryId])

  const handleBookingSubmit = async () => {
    // Validate all required fields
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً")
      return
    }

    if (!laundry) {
      setError("لم يتم العثور على بيانات المغسلة")
      return
    }

    if (!selectedService) {
      alert("يرجى اختيار نوع الخدمة")
      return
    }

    if (!bookingDate) {
      alert("يرجى اختيار تاريخ الحجز")
      return
    }

    if (!selectedTime) {
      alert("يرجى اختيار وقت الحجز")
      return
    }

    setSubmitting(true)
    try {
      // Format the booking date and time
      const formattedDateTime = `${bookingDate}T${selectedTime}:00`

      // Insert the booking into the database
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: user.id,
            laundry_id: laundry.id,
            service_type: selectedService.name, // تخزين نوع الخدمة
            booking_date: formattedDateTime,
            status: "pending",
            total_amount: selectedService.price,
            owner_approval: false,
          },
        ])
        .select()

      if (error) throw error

      console.log("Booking successful:", data)

      // Set the booking ID for the success message
      if (data && data.length > 0) {
        setBookingId(data[0].id)
      }

      // Show success state
      setBookingSuccess(true)

      // Automatically redirect after 5 seconds
      setTimeout(() => {
        navigate("/user/bookings")
      }, 5000)
    } catch (error) {
      console.error("Error booking:", error)
      setError("حدث خطأ في عملية الحجز. يرجى المحاولة مرة أخرى.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">جاري تحميل بيانات المغسلة...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-white text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (!laundry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-white text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">لم يتم العثور على بيانات المغسلة</p>
          <button
            onClick={() => navigate("/laundries")}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            العودة إلى قائمة المغاسل
          </button>
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الحجز بنجاح!</h2>
          <p className="text-gray-600 mb-4">
            تم تأكيد حجزك في {laundry.name}
            {bookingId && <span className="block mt-2">رقم الحجز: {bookingId}</span>}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">تفاصيل الحجز</h3>
            <div className="space-y-2 text-gray-600 text-right">
              <p>الخدمة: {selectedService.name}</p>
              <p>السعر: {selectedService.price} ريال</p>
              <p>
                الموعد: {new Date(bookingDate).toLocaleDateString("ar-SA")} - {selectedTime}
              </p>
              <p>
                حالة الحجز: <span className="text-yellow-600 font-medium">قيد الانتظار</span>
              </p>
            </div>
          </div>
          <p className="text-gray-500 mb-6">سيتم تحويلك إلى صفحة الحجوزات خلال 5 ثوانٍ...</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/user/bookings")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              عرض حجوزاتي
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 py-12 px-4" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        {/* Laundry Details Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 right-6">
              <h1 className="text-3xl font-bold text-white">{laundry.name}</h1>
            </div>
          </div>
          <div className="p-6">
            {laundry.location && (
              <p className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                {laundry.location}
              </p>
            )}
            {laundry.description && <p className="text-gray-600">{laundry.description}</p>}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الحجز</h2>

          {/* Services Selection */}
          {services.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ShowerHead className="h-5 w-5 text-blue-600" />
                اختر نوع الخدمة
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedService?.id === service.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{service.name}</span>
                      {selectedService?.id === service.id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {service.price !== undefined && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {service.price} ريال
                        </span>
                      )}
                      {service.duration !== undefined && (
                        <span className="flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          {service.duration} دقيقة
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-yellow-50 rounded-xl text-yellow-800">
              <p className="text-center">لا توجد خدمات متاحة لهذه المغسلة حالياً</p>
            </div>
          )}

          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              اختر التاريخ
            </h3>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              اختر الوقت
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-300 text-gray-600"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary and Submit */}
          {selectedService && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">ملخص الحجز</h3>
              <div className="space-y-2 text-gray-600">
                <p>الخدمة: {selectedService.name}</p>
                {selectedService.price !== undefined && <p>السعر: {selectedService.price} ريال</p>}
                {selectedService.duration !== undefined && <p>المدة: {selectedService.duration} دقيقة</p>}
                {bookingDate && selectedTime && (
                  <p>
                    الموعد: {new Date(bookingDate).toLocaleDateString("ar-SA")} - {selectedTime}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleBookingSubmit}
            disabled={submitting || !selectedService || !bookingDate || !selectedTime || services.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-xl transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري الحجز...
              </>
            ) : (
              <>
                تأكيد الحجز
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  )
}

export default BookingFormPage