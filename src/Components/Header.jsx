"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { Menu, X, User } from "lucide-react";
=======
import { Menu, X } from "lucide-react";
>>>>>>> cb51eaa5488c2952fe102c81a4442e95c5c472c1

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* ✅ اسم الموقع */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          WashyWay
        </Link>

        {/* ✅ القائمة الرئيسية */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-gray-900">
            Services
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
        </nav>

        {/* ✅ أزرار تسجيل الدخول والقائمة الجانبية */}
        <div className="flex items-center space-x-4">
          <Link to="/auth/login" className="text-gray-700 hover:text-gray-900">
            Login
          </Link>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ القائمة الجانبية للموبايل */}
      {isOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 p-4">
          <Link
            to="/about"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link to="/services" className="block text-gray-700 hover:text-gray-900 py-2" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
<<<<<<< HEAD
          <Link
            to="/auth/login"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
=======
          <Link to="/auth/login" className="block text-gray-700 hover:text-gray-900 py-2" onClick={() => setIsOpen(false)}>
>>>>>>> cb51eaa5488c2952fe102c81a4442e95c5c472c1
            Login
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
