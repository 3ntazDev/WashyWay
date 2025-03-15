"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronRight, Star, Clock, Phone, Loader2, ShowerHead } from "lucide-react"

function LaundriesPage() {
  const [laundries, setLaundries] = useState([])
  const [filteredLaundries, setFilteredLaundries] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Page loaded, fetching laundries...")
    const fetchLaundries = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("laundries").select("*")
        if (error) {
          console.error("Error fetching laundries:", error)
          setError(error.message)
        } else {
          setLaundries(data)
          setFilteredLaundries(data)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    fetchLaundries()
  }, [])

  useEffect(() => {
    // Filter laundries based on search term
    if (search.trim() === "" && activeFilter === "all") {
      setFilteredLaundries(laundries)
    } else {
      let filtered = laundries

      // Apply search filter
      if (search.trim() !== "") {
        filtered = filtered.filter(
          (laundry) =>
            laundry.name?.toLowerCase().includes(search.toLowerCase()) ||
            laundry.location?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      // Apply category filter if it exists in the data
      if (activeFilter !== "all") {
        filtered = filtered.filter((laundry) => laundry.category === activeFilter)
      }

      setFilteredLaundries(filtered)
    }
  }, [search, laundries, activeFilter])

  const handleRegister = (laundryId) => {
    console.log("Navigating to booking page for laundry ID:", laundryId)
    navigate(`/booking/${laundryId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white" dir="rtl">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path
              fill="rgba(255, 255, 255, 0.1)"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">المغاسل المتاحة</h1>
          <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
            اختر من بين أفضل المغاسل في منطقتك واحجز بكل سهولة
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="🔍 ابحث عن مغسلة..."
              className="w-full py-4 pl-12 pr-4 bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-lg transition text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Only show category filters if we have categories in the data */}
          {laundries.some((laundry) => laundry.category) && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === "all" ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                الكل
              </button>

              {/* Only show category buttons for categories that exist in the data */}
              {Array.from(new Set(laundries.map((l) => l.category).filter(Boolean))).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
                    activeFilter === category ? "bg-white text-blue-600" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <ShowerHead className="h-4 w-4" />
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Laundries List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
            <p className="text-xl">جاري تحميل المغاسل...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur-sm p-6 rounded-xl text-center max-w-lg mx-auto">
            <p className="text-xl mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredLaundries.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl max-w-lg mx-auto">
            <p className="text-2xl mb-4">لا توجد نتائج تطابق البحث</p>
            <button
              onClick={() => {
                setSearch("")
                setActiveFilter("all")
              }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              عرض جميع المغاسل
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaundries.map((laundry) => (
              <div
                key={laundry.id}
                className="bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl shadow-xl hover:shadow-2xl border-0 transition transform hover:scale-105 overflow-hidden"
              >
                {/* Laundry Header */}
                <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                  {/* Only show rating if it exists in the data */}
                  {laundry.rating && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{laundry.rating}</span>
                    </div>
                  )}

                  {/* Only show category if it exists in the data */}
                  {laundry.category && (
                    <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <ShowerHead className="h-4 w-4" />
                      <span>{laundry.category}</span>
                    </div>
                  )}

                  {/* Only show distance if it exists in the data */}
                  {laundry.distance && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{laundry.distance} كم</span>
                    </div>
                  )}
                </div>

                {/* Laundry Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">{laundry.name}</h2>

                  <div className="space-y-2 mb-4">
                    {/* Only show location if it exists in the data */}
                    {laundry.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>{laundry.location}</span>
                      </p>
                    )}

                    {/* Only show opening hours if they exist in the data */}
                    {laundry.openTime && laundry.closeTime && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>
                          {laundry.openTime} - {laundry.closeTime}
                        </span>
                      </p>
                    )}

                    {/* Only show phone if it exists in the data */}
                    {laundry.phone && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span dir="ltr">{laundry.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Only show services if they exist in the data */}
                  {laundry.services && Array.isArray(laundry.services) && laundry.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {laundry.services.map((service, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description if available */}
                  {laundry.description && <p className="text-gray-600 mb-6 text-sm">{laundry.description}</p>}

                  <button
                    onClick={() => handleRegister(laundry.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-5 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    احجز الآن <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  )
}

export default LaundriesPage

