"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import YellowLogo from "../assets/logo-yellow.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* ✅ الشعار */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          <img src={YellowLogo} alt="Washy Way Logo" className="h-25" />
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
          <Link
            to="/services"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/auth/login"
            className="block text-gray-700 hover:text-gray-900 py-2"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;