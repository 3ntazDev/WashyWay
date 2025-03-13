import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Auth/useAuth";
import { Search, MapPin, ChevronRight } from "lucide-react";

function BookingPage() {
  const [laundries, setLaundries] = useState([]);
  const [filteredLaundries, setFilteredLaundries] = useState([]);
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();
        if (data) setUserName(data.name);
      }
    };

    const fetchLaundries = async () => {
      const { data } = await supabase.from("laundries").select("*");
      if (data) {
        setLaundries(data);
        setFilteredLaundries(data);
      }
    };

    fetchUserName();
    fetchLaundries();
  }, [user]);

  useEffect(() => {
    const filtered = laundries.filter((laundry) =>
      laundry.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLaundries(filtered);
  }, [search, laundries]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6">
      <main className="flex-grow" dir="rtl">
        {/* ✅ رسالة ترحيب */}
        <section className="container mx-auto text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            {userName ? `👋 أهلاً، ${userName}!` : "👋 مرحبًا بك!"}
          </h1>
          {user && (
            <p className="text-lg text-blue-100">
              📧 إيميلك: <span className="font-semibold">{user.email}</span>
            </p>
          )}
          <p className="text-xl text-blue-100 mt-4">
            استعرض واحجز المغسلة المثالية لك بكل سهولة.
          </p>
        </section>

        {/* ✅ مربع البحث */}
        <section className="container mx-auto px-4">
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 ابحث عن مغسلة..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg transition text-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* ✅ عرض بطاقات المغاسل */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLaundries.length > 0 ? (
              filteredLaundries.map((laundry) => (
                <div
                  key={laundry.id}
                  className="p-6 bg-white text-gray-900 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 transition transform hover:scale-105 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-20"></div>
                  <h2 className="text-2xl font-bold">{laundry.name}</h2>
                  <p className="text-gray-600 mt-2 flex items-center gap-1">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {laundry.location}
                  </p>
                  <button className="mt-6 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-5 rounded-lg transition-all font-medium shadow-md hover:shadow-lg">
                    احجز الآن <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-200 text-center col-span-3 text-lg">
                ❌ لا توجد نتائج تطابق البحث!
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookingPage;
