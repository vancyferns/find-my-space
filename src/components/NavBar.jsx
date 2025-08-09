import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{
      background: "#0f172a",
      color: "white",
      padding: "12px 16px"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontWeight: 700, fontSize: 18 }}>🚗 Find My Space</Link>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/add" style={{ color: "white" }}>Add Parking</Link>
          <Link to="/book" style={{ color: "white" }}>Bookings</Link>
        </nav>
      </div>
    </header>
  );
}
