import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Parking() {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios.get("/parking").then(res => setSlots(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parking Slots</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map(slot => (
          <div key={slot.id} className={`border rounded-xl p-4 shadow ${slot.status === "Available" ? "bg-green-100" : "bg-red-100"}`}>
            <h2 className="text-lg font-semibold">Slot {slot.slot}</h2>
            <p>Status: {slot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
