import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import HeaderBasedRole from "./Components/HeaderBasedRole";
{
  /* User Routes */
}
import LaundriesPage  from "./User/LaundriesPage";
import ProfilePage from "./User/ProfilePage";
import BookingFormPage from "./User/BookingFormPage";
import Order from "./User/Order";

{
  /* Auth Routes */
}

import UserRegister from "./Auth/UserRegister";
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
import CarWashDashboard from "./laundry/CarWashDashboard";
import CompleteRegistrationO from "./laundry/CompleteRegistrationO";
import LoginO from "./laundry/Login";
import OwnerRegister from "./laundry/OwnerRegister";
import OwnerAddLaundry from "./laundry/OwnerAddLaundry";

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
        <Route path="/user/booking" element={<LaundriesPage  />} />
        <Route path="/booking/:laundryId" element={<BookingFormPage />} />
        <Route path="/user/orders" element={<Order />} /> {/* إضافة مسار الطلبات */}

        {/* Auth Routes */}
        <Route path="/auth/user/register" element={<UserRegister />} />
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
        <Route path="/owner/dashboard" element={<CarWashDashboard />} />
        <Route path="/laundry/profile" element={<CarWashProfile />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/owner/login" element={<LoginO />} />
        <Route path="/owner/add-laundry" element={<OwnerAddLaundry />} />
        <Route
          path="/owner/complete-registration"
          element={<CompleteRegistrationO />}
        />



      </Routes>
    </>
  );
}

export default App;
