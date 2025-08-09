import React, { useState } from "react";

export default function ParkingCard({ spot }) {
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ name: "", vehicle: "", timeslot: "" });

  function handleBook(e) {
    e.preventDefault();
    // store booking in localStorage (simple)
    const bookings = JSON.parse(localStorage.getItem("fms_bookings") || "[]");
    const newBooking = {
      id: `b${Date.now()}`,
      spotId: spot.id,
      spotName: spot.name,
      name: form.name,
      vehicle: form.vehicle,
      timeslot: form.timeslot,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem("fms_bookings", JSON.stringify(bookings));

    // decrement available slots (not strict checking)
    const parking = JSON.parse(localStorage.getItem("fms_parking") || "[]");
    const idx = parking.findIndex(p => p.id === spot.id);
    if (idx !== -1 && parking[idx].available > 0) {
      parking[idx].available = Math.max(0, parking[idx].available - 1);
      localStorage.setItem("fms_parking", JSON.stringify(parking));
    }

    alert("Booking saved! (demo) — check Bookings page.");
    setShowBook(false);
    setForm({ name: "", vehicle: "", timeslot: "" });
    // reload page to reflect updated available slots (simple approach)
    window.location.reload();
  }

  return (
    <div style={{ background: "white", padding: 12, borderRadius: 8, border: "1px solid #e6e9ee" }}>
      <h3 style={{ margin: 0 }}>{spot.name}</h3>
      <p style={{ margin: "6px 0", color: "#6b7280" }}>{spot.address}</p>
      <p style={{ margin: "6px 0" }}>Slots: <strong>{spot.slots}</strong> • Available: <strong>{spot.available}</strong></p>
      <p style={{ margin: "6px 0" }}>Price/hr: ₹{spot.pricePerHour}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => setShowBook(s => !s)} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
          Book Now
        </button>
        <button onClick={() => {
          // quick WhatsApp link example (placeholder)
          const num = "919999999999";
          const text = `Hi, I want to book ${encodeURIComponent(spot.name)}`;
          window.open(`https://wa.me/${num}?text=${text}`, "_blank");
        }} style={{ padding: "8px 12px", border: "1px solid #e6e9ee", borderRadius: 6 }}>
          WhatsApp
        </button>
      </div>

      {showBook && (
        <form onSubmit={handleBook} style={{ marginTop: 12 }}>
          <input required placeholder="Your name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} style={inputStyle} />
          <input required placeholder="Vehicle (Car/Motorcycle)" value={form.vehicle} onChange={(e)=>setForm({...form, vehicle:e.target.value})} style={inputStyle} />
          <input required placeholder="Timeslot (e.g. 2025-12-01 18:00-21:00)" value={form.timeslot} onChange={(e)=>setForm({...form, timeslot:e.target.value})} style={inputStyle} />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" style={{ padding: "8px 12px", background: "#10b981", color: "white", border: "none", borderRadius: 6 }}>Confirm</button>
            <button type="button" onClick={() => setShowBook(false)} style={{ padding: "8px 12px", borderRadius: 6 }}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  marginBottom: 8,
  borderRadius: 6,
  border: "1px solid #e6e9ee"
};
