"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useParams, useNavigate } from "react-router-dom"

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
  const [success, setSuccess] = useState(false)
  const [formStep, setFormStep] = useState(1)
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
    setSelectedSlot("")
  }

  // التعامل مع التغيير في الوقت المتاح
  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value)
  }

  // التعامل مع التغيير في الخدمة
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value)
  }

  // التعامل مع الانتقال للخطوة التالية
  const handleNextStep = () => {
    if (formStep === 1 && !selectedService) {
      setError("يرجى اختيار الخدمة أولاً")
      return
    }

    if (formStep === 2 && !bookingDate) {
      setError("يرجى اختيار التاريخ أولاً")
      return
    }

    setError("")
    setFormStep(formStep + 1)
  }

  // التعامل مع العودة للخطوة السابقة
  const handlePrevStep = () => {
    setFormStep(formStep - 1)
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
          laundry_name: laundry.name,
          status: "معلق",
        },
      ])

      if (error) throw error

      // عرض رسالة النجاح
      setSuccess(true)

      // الانتقال إلى صفحة التأكيد بعد 3 ثوان
      setTimeout(() => {
        navigate("/user/orders")
      }, 3000)
    } catch (error) {
      console.error("Error booking service:", error)
      setError("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.")
    }
  }

  // الحصول على سعر الخدمة المختارة
  const getSelectedServicePrice = () => {
    const service = services.find((s) => s.name === selectedService)
    return service ? service.price : 0
  }

  // تنسيق التاريخ بشكل أفضل
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

          <div className="relative">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-blue-200 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-blue-800 font-medium text-lg">جاري تحميل بيانات المغسلة...</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">تم الحجز بنجاح!</h2>
            <p className="text-green-600 text-center mb-6">سيتم تحويلك إلى صفحة الطلبات خلال لحظات...</p>
            <div className="w-full bg-green-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>العودة</span>
          </button>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-20 -mt-20 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-20 -mb-20 opacity-30"></div>
          
          {/* Laundry header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            
            <div className="relative">
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg shadow-inner mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">{laundry?.name}</h1>
              </div>
              <p className="text-blue-100 mr-12">{laundry?.location}</p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className={`flex flex-col items-center ${formStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  formStep >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xs font-medium">الخدمة</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${formStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${formStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  formStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">التاريخ</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${formStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${formStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  formStep >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">الوقت</span>
              </div>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6 relative">
            <h2 className="text-xl font-bold text-blue-900 mb-6">حجز خدمة غسيل</h2>

            {error && (
              <div className="mb-6 bg-red-50 border-r-4 border-red-500 p-4 rounded-lg flex items-start animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleBooking}>
              {/* Step 1: Service selection */}
              {formStep === 1 && (
                <div className="animate-fadeIn">
                  <div className="mb-6">
                    <label htmlFor="service" className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      اختر الخدمة
                    </label>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            selectedService === service.name 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                          onClick={() => setSelectedService(service.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                selectedService === service.name ? 'border-blue-500' : 'border-gray-300'
                              }`}>
                                {selectedService === service.name && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <span className="font-medium text-blue-900">{service.name}</span>
                            </div>
                            <span className="font-bold text-blue-600">{service.price} ريال</span>
                          </div>
                          {service.description && (
                            <p className="text-sm text-gray-600 mr-8 mt-2">{service.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Date selection */}
              {formStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="mb-6">
                    <label htmlFor="date" className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      اختر التاريخ
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={bookingDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-blue-900 shadow-inner"
                    />
                    
                    {bookingDate && (
                      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-blue-800 font-medium">التاريخ المختار:</p>
                        <p className="text-blue-600">{formatDate(bookingDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Time slot selection */}
              {formStep === 3 && (
                <div className="animate-fadeIn">
                  <div className="mb-8">
                    <label htmlFor="slot" className="block text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      اختر الوقت المتاح
                    </label>
                    
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlots.map((slot) => (
                          <div 
                            key={slot} 
                            className={`border rounded-xl p-3 cursor-pointer transition-all duration-200 text-center ${
                              selectedSlot === slot 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <div className="flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-full border-2 ml-2 flex items-center justify-center ${
                                selectedSlot === slot ? 'border-blue-500' : 'border-gray-300'
                              }`}>
                                {selectedSlot === slot && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <span className="font-medium text-blue-900">{slot}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-yellow-800">يرجى اختيار التاريخ أولاً</p>
                      </div>
                    )}
                    
                    {/* Booking summary */}
                    {selectedService && bookingDate && selectedSlot && (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <h3 className="text-blue-800 font-bold mb-3">ملخص الحجز:</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-600">الخدمة:</span>
                            <span className="font-medium text-blue-900">{selectedService}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">التاريخ:</span>
                            <span className="font-medium text-blue-900">{formatDate(bookingDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">الوقت:</span>
                            <span className="font-medium text-blue-900">{selectedSlot}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-blue-200">
                            <span className="text-blue-600 font-bold">المبلغ:</span>
                            <span className="font-bold text-blue-900">{getSelectedServicePrice()} ريال</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-white border border-blue-300 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                  >
                    السابق
                  </button>
                ) : (
                  <div></div>
                )}
                
                {formStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                  >
                    <span>تأكيد الحجز</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full -mr-12 -mt-12 opacity-30"></div>
          
          <div className="relative">
            <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center">
              
              ملاحظات مهمة
            </h3>
            <ul className="text-sm text-blue-700 space-y-2 list-inside">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>يرجى الحضور قبل الموعد بـ 15 دقيقة</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>يمكنك إلغاء الحجز قبل 24 ساعة من الموعد</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>في حال التأخر أكثر من 15 دقيقة، قد يتم إلغاء الحجز</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  </div>
  )
}

export default BookingForm

