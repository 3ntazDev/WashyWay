import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import HeaderBasedRole from "./Components/HeaderBasedRole";

// User Routes
import LaundriesPage from "./User/LaundriesPage";
import ProfilePage from "./User/ProfilePage";
import BookingFormPage from "./User/BookingFormPage";
import Order from "./User/Order";

// Auth Routes
import UserRegister from "./Auth/UserRegister";
import Login from "./Auth/Login";
import CompleteRegistration from "./Auth/CompleteRegistration";
import CompleteMissingProfile from "./Auth/complete-missing-profile";

// Laundry Routes
import LoginPage from "./laundry/LoginPage";
import SignupPage from "./laundry/SignupPage";
import DashboardPage from "./laundry/DashboardPage";
import ProfileCompletionPage from "./laundry/ProfileCompletionPage";

// استيراد ProtectedRoute لحماية المسارات
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
    <>
      <HeaderBasedRole />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />

        {/* User Routes */}
        <Route path="/user/profile" element={
          <ProtectedRoute
            element={<ProfilePage />}
            requiredRole="user" // فقط الـ user يمكنه الوصول
          />
        } />
        <Route path="/user/booking" element={
          <ProtectedRoute
            element={<LaundriesPage />}
            requiredRole="user" // فقط الـ user يمكنه الوصول
          />
        } />
        <Route path="/booking/:laundryId" element={
          <ProtectedRoute
            element={<BookingFormPage />}
            requiredRole="user" // فقط الـ user يمكنه الوصول
          />
        } />
        <Route path="/user/orders" element={
          <ProtectedRoute
            element={<Order />}
            requiredRole="user" // فقط الـ user يمكنه الوصول
          />
        } />

        {/* Auth Routes */}
        <Route path="/auth/user/register" element={<UserRegister />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/complete-registration" element={<CompleteRegistration />} />
        <Route path="/auth/complete-missing-profile" element={<CompleteMissingProfile />} />

        {/* Laundry Routes */}
        <Route path="/laundry/login" element={<LoginPage />} />
        <Route path="/laundry/signup" element={<SignupPage />} />
        
        {/* حماية لوحة التحكم الخاصة بالمغسلة */}
        <Route
          path="/laundry/dashboard"
          element={
            <ProtectedRoute
              element={<DashboardPage />}
              requiredRole="owner" // فقط الـ owner يمكنه الوصول
            />
          }
        />
        <Route
          path="/laundry/profile-completion"
          element={
            <ProtectedRoute
              element={<ProfileCompletionPage />}
              requiredRole="owner" // فقط الـ owner يمكنه الوصول
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;

