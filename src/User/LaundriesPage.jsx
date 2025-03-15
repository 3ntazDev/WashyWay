"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, Star, ShowerHead } from "lucide-react";

function LaundriesPage() {
  const [laundries, setLaundries] = useState([]);
  const [filteredLaundries, setFilteredLaundries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaundries = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("laundries").select("*");
        if (error) throw error;
        setLaundries(data);
        setFilteredLaundries(data);
      } catch (error) {
        console.error("Error fetching laundries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaundries();
  }, []);

  useEffect(() => {
    let filtered = laundries;

    if (search.trim()) {
      filtered = filtered.filter(
        (laundry) =>
          laundry.name.toLowerCase().includes(search.toLowerCase()) ||
          laundry.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeFilter !== "all") {
      filtered = filtered.filter((laundry) => laundry.category === activeFilter);
    }

    setFilteredLaundries(filtered);
  }, [search, laundries, activeFilter]);

  const handleRegister = (laundryId) => {
    navigate(`/booking/${laundryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white" dir="rtl">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">المغاسل المتاحة</h1>
          <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
            اختر من بين أفضل المغاسل في منطقتك واحجز بكل سهولة
          </p>
        </div>
      </header>

      {/* Search */}
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
      </div>

      {/* Laundries List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 text-white animate-spin mb-4"></div>
          <p className="text-xl">جاري تحميل المغاسل...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaundries.map((laundry) => (
            <div key={laundry.id} className="bg-white/90 text-gray-900 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                {laundry.rating && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{laundry.rating}</span>
                  </div>
                )}
                {laundry.category && (
                  <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <ShowerHead className="h-4 w-4" />
                    <span>{laundry.category}</span>
                  </div>
                )}
                {laundry.distance && (
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{laundry.distance} كم</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{laundry.name}</h2>
                <p className="text-gray-600">{laundry.location}</p>
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
    </div>
  );
}

export default LaundriesPage;
