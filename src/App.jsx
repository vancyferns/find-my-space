import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AddParking from "./pages/AddParking";
import BookParking from "./pages/BookParking";
import { seedIfNeeded } from "./data/seedData";

export default function App() {
  // seed localStorage once on first load
  useEffect(() => {
    seedIfNeeded();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddParking />} />
          <Route path="/book" element={<BookParking />} />
          <Route path="*" element={<div><h2>Page not found</h2><Link to="/">Go home</Link></div>} />
        </Routes>
      </div>
    </div>
  );
}
