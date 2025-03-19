"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronRight, Star, ShowerHead, Loader2 } from "lucide-react"

export default function LaundriesPage() {
  const [laundries, setLaundries] = useState([])
  const [filteredLaundries, setFilteredLaundries] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLaundries = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("laundries").select("*")
        if (error) throw error
        setLaundries(data)
        setFilteredLaundries(data)
      } catch (error) {
        console.error("Error fetching laundries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaundries()
  }, [])

  useEffect(() => {
    let filtered = laundries

    if (search.trim()) {
      filtered = filtered.filter(
        (laundry) =>
          laundry.name.toLowerCase().includes(search.toLowerCase()) ||
          laundry.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((laundry) => laundry.category === activeFilter)
    }

    setFilteredLaundries(filtered)
  }, [search, laundries, activeFilter])

  const handleRegister = (laundryId) => {
    navigate(`/booking/${laundryId}`)
  }

  return (
    <div className="min-h-screen bg-white text-gray-800" dir="rtl">
      {/* Header */}
      <header className="py-16 px-4 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">المغاسل المتاحة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">اختر من بين أفضل المغاسل في منطقتك واحجز بكل سهولة</p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="🔍 ابحث عن مغسلة..."
              className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 focus:border-[#1a73e8] text-lg text-gray-700 placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Laundries List */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-[#1a73e8] animate-spin mb-4" />
            <p className="text-xl text-gray-600">جاري تحميل المغاسل...</p>
          </div>
        ) : filteredLaundries.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto border border-gray-100">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">لا توجد نتائج</h3>
              <p className="text-gray-600">لم نتمكن من العثور على مغاسل تطابق بحثك. حاول تغيير معايير البحث.</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaundries.map((laundry) => (
              <div
                key={laundry.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="h-40 bg-gray-100 relative">
                  {laundry.rating && (
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700">{laundry.rating}</span>
                    </div>
                  )}
                  {laundry.category && (
                    <div className="absolute top-3 left-3 bg-[#1a73e8]/10 text-[#1a73e8] px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <ShowerHead className="h-4 w-4" />
                      <span>{laundry.category}</span>
                    </div>
                  )}
                  {laundry.distance && (
                    <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{laundry.distance} كم</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{laundry.name}</h2>
                  <p className="text-gray-600 mb-4">{laundry.location}</p>
                  <button
                    onClick={() => handleRegister(laundry.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1565c0] text-white py-3 px-4 rounded-lg transition-colors font-medium"
                  >
                    احجز الآن
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

