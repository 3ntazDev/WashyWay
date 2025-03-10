import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Header from "./Components/Header";
import About from "./About";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
