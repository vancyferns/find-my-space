import React, { useEffect, useState } from "react";
import { getBookings } from "../Data/SeedData";

export default function BookParking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  if (bookings.length === 0) return <div><h2>Bookings</h2><p>No bookings yet.</p></div>;

  return (
    <div>
      <h2>Bookings</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {bookings.map(b => (
          <div key={b.id} style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e6e9ee" }}>
            <div style={{ fontWeight: 700 }}>{b.name} — {b.spotName}</div>
            <div style={{ color: "#6b7280" }}>{b.vehicle} • {b.timeslot}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(b.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
