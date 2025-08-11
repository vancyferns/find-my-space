import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function AddParking() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    eventId: "",
    slots: 10,
    available: 10,
    pricePerHour: 50
  });

  // Load events from backend
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE_URL}/events`);
        const data = await res.json();
        setEvents(data);
        if (data.length > 0) {
          setForm(f => ({ ...f, eventId: data[0].id || data[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/parking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Parking saved successfully.");
        setForm({
          name: "",
          address: "",
          eventId: events[0]?.id || events[0]?._id || "",
          slots: 10,
          available: 10,
          pricePerHour: 50
        });
        window.location.href = "/";
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Unable to save"}`);
      }
    } catch (err) {
      console.error("Error saving parking:", err);
      alert("Failed to connect to backend.");
    }
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
          {events.map(ev => (
            <option key={ev.id || ev._id} value={ev.id || ev._id}>
              {ev.name} — {ev.date}
            </option>
          ))}
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
