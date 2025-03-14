import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import HeaderBasedRole from "./Components/HeaderBasedRole";
{
  /* User Routes */
}
import BookingPage from "./User/BookingPage";
import BookingsPage from "./User/BookingsPage";
import LoginPage from "./Auth/Login";
import ProfilePage from "./User/ProfilePage";

{
  /* Auth Routes */
}

import UserRegister from "./Auth/UserRegister";
import OwnerRegister from "./Auth/OwnerRegister";
import Login from "./Auth/Login";
import CompleteRegistration from "./Auth/CompleteRegistration";
import CompleteMissingProfile from "./Auth/complete-missing-profile";
{
  /* Admin Routes */
}

{
  /* Laundry Routes */
}
import CarWashProfile from "./laundry/CarWashProfile";
import CarWashLogin from "./laundry/CarWashLogin";
import CarWashDashboard from "./laundry/CarWashDashboard";

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

        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/user/booking" element={<BookingPage />} />
        <Route path="/user/bookings" element={<BookingsPage />} />

        {/* Auth Routes */}
        <Route path="/auth/user/register" element={<UserRegister />} />
        <Route path="/auth/owner/register" element={<OwnerRegister />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/complete-registration"
          element={<CompleteRegistration />}
        />
        <Route
          path="/auth/complete-missing-profile"
          element={<CompleteMissingProfile />}
        />
        {/* Admin Routes */}

        {/* Laundry Routes */}
        <Route path="/laundry/login" element={<CarWashLogin />} />
        <Route path="/laundry/dashboard" element={<CarWashDashboard />} />
        <Route path="/laundry/profile" element={<CarWashProfile />} />
      </Routes>
    </>
  );
}

export default App;
