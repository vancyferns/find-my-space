import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/events").then(res => setEvents(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <div key={event.id} className="border rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p>{event.date}</p>
            <p className="text-gray-600">{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
