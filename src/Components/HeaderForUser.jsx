import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../auth/useAuth"; // ✅ استيراد حالة المستخدم

const HeaderForUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ الحصول على بيانات المستخدم

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          WashyWay
        </Link>

        {/* ✅ الروابط الثلاثة */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/booking" className="text-gray-700 hover:text-gray-900">
            Booking
          </Link>
          <Link to="/bookings" className="text-gray-700 hover:text-gray-900">
            Bookings
          </Link>
          <Link to="/carwash-selection" className="text-gray-700 hover:text-gray-900">
            Car Wash Selection
          </Link>
        </nav>

        {/* ✅ أيقونة البروفايل إذا كان المستخدم مسجل دخول */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button onClick={() => navigate("/profile")}>
              <User className="w-6 h-6 text-gray-900 hover:text-indigo-600" />
            </button>
          ) : (
            <Link to="/auth/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          )}

          {/* ✅ زر القائمة الجانبية في الجوال */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ القائمة الجانبية في الجوال */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 p-4">
          <Link
            to="/booking"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Booking
          </Link>
          <Link
            to="/bookings"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Bookings
          </Link>
          <Link
            to="/carwash-selection"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Car Wash Selection
          </Link>
          {!user && (
            <Link
              to="/auth/login"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default HeaderForUser;
