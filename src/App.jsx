import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Header from "./Components/Header";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </>
  );
}

export default App;