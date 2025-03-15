"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, User } from "lucide-react"

const HeaderForUser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* حذف الشعار الذي يوجه إلى الصفحة الرئيسية */}
        <div className="text-2xl font-bold text-gray-900">WashyWay</div>

        {/* Three links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/user/booking" className="text-gray-700 hover:text-gray-900">
            Booking
          </Link>
          <Link to="/user/orders" className="text-gray-700 hover:text-gray-900">
            Bookings
          </Link>
          <Link to="/carwash-selection" className="text-gray-700 hover:text-gray-900">
            Car Wash Selection
          </Link>
        </nav>

        {/* Profile icon */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/user/profile")} className="flex items-center justify-center">
            <User className="w-6 h-6 text-gray-900 hover:text-indigo-600" />
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar menu */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 p-4">
          <Link to="/user/booking" className="block text-gray-700 hover:text-gray-900 py-2" onClick={() => setIsOpen(false)}>
            Booking
          </Link>
          <Link
            to="/user/orders"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Bookings
          </Link>
          <Link
            to="/user/orders"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Car Wash Selection
          </Link>
        </nav>
      )}
    </header>
  )
}

export default HeaderForUser