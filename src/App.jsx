import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Header from "./Components/Header";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";

{/* User Routes */}
import BookingPage from "./User/BookingPage";
import BookingsPage from "./User/BookingsPage";
import LoginPage from "./Auth/Login";
import ProfilePage from "./User/ProfilePage";


{/* Admin Routes */}

{/* Laundry Routes */}
import CarWashProfile from "./laundry/CarWashProfile";  
import CarWashLogin  from "./laundry/CarWashLogin";
import CarWashDashboard from "./laundry/CarWashDashboard";  


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />

              {/* User Routes */}

        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/profile" element={<ProfilePage />} />      
        <Route path="/user/booking" element={<BookingPage />} />
        <Route path="/user/bookings" element={<BookingsPage />} />



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