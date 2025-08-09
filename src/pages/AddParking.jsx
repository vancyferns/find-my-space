import React, { useState } from "react";
import { getEvents, getParking, saveParking } from "../Data/SeedData";

export default function AddParking() {
  const events = getEvents();
  const [form, setForm] = useState({
    name: "",
    address: "",
    eventId: events[0]?.id || "",
    slots: 10,
    available: 10,
    pricePerHour: 50
  });

  function handleSubmit(e) {
    e.preventDefault();
    const existing = getParking();
    const newItem = { ...form, id: `p${Date.now()}` };
    existing.push(newItem);
    saveParking(existing);
    alert("Parking saved (local demo).");
    // clear form
    setForm({ name: "", address: "", eventId: events[0]?.id || "", slots: 10, available: 10, pricePerHour: 50 });
    // reload to show immediately
    window.location.href = "/";
  }

  return (
    <div>
      <h2>Add Parking Spot</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginTop: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Name</label>
        <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={inputStyle} />

        <label style={{ display: "block", marginBottom: 6 }}>Address</label>
        <input required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} style={inputStyle} />

        <label style={{ display: "block", marginBottom: 6 }}>Event</label>
        <select value={form.eventId} onChange={(e) => setForm({...form, eventId: e.target.value})} style={inputStyle}>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name} — {ev.date}</option>)}
        </select>

        <label style={{ display: "block", marginBottom: 6 }}>Total slots</label>
        <input type="number" value={form.slots} onChange={(e) => setForm({...form, slots: Number(e.target.value), available: Number(e.target.value)})} style={inputStyle} />

        <label style={{ display: "block", marginBottom: 6 }}>Price per hour (₹)</label>
        <input type="number" value={form.pricePerHour} onChange={(e) => setForm({...form, pricePerHour: Number(e.target.value)})} style={inputStyle} />

        <button type="submit" style={{ padding: "10px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>Save Parking</button>
      </form>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", padding: "8px 10px", marginBottom: 12, borderRadius: 6, border: "1px solid #e6e9ee" };
