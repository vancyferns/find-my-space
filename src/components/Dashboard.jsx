import React, { useEffect, useState } from "react";
import { getEvents, getParking } from "../Data/SeedData";
import EventList from "./EventList";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [parking, setParking] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    setEvents(getEvents());
    setParking(getParking());
  }, []);

  const filteredParking = selectedEventId ? parking.filter(p => p.eventId === selectedEventId) : parking;

  const totalSlots = filteredParking.reduce((acc, p) => acc + p.slots, 0);
  const totalAvailable = filteredParking.reduce((acc, p) => acc + p.available, 0);

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>User Dashboard</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <label style={{ fontWeight: 600 }}>Select event:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">All events</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name} — {ev.date}</option>)}
        </select>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#374151" }}>Total parking slots: <strong>{totalSlots}</strong></div>
          <div style={{ fontSize: 14, color: "#374151" }}>Available now: <strong>{totalAvailable}</strong></div>
        </div>
      </div>

      <EventList parking={filteredParking} events={events} />
    </div>
  );
}
