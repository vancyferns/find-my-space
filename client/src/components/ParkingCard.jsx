import React, { useState } from "react";
// We'll define a simple config object to simulate a config.js file
const config = {
  API_BASE_URL: "https://upgraded-space-adventure-wwp7r6rxp7q354xp-5000.app.github.dev",
};

// We will use this component to display feedback to the user, replacing the 'alert()' calls.
function MessageBox({ message, type, onClose }) {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const textColor = 'text-white';

  return (
    <div className={`p-4 rounded-md shadow-lg ${bgColor} ${textColor} flex justify-between items-center mb-4`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-xl font-bold opacity-75 hover:opacity-100">&times;</button>
    </div>
  );
}

export default function ParkingCard({ spot, onBooking }) {
  // === FIX: Add a conditional check to prevent errors when spot is not yet loaded ===
  if (!spot) {
    return null; 
  }

  // State to control the visibility of the booking form
  const [showBook, setShowBook] = useState(false);
  // State to hold the form data
  const [form, setForm] = useState({ name: "", vehicle: "", timeslot: "" });
  // State for the loading indicator on the button
  const [loading, setLoading] = useState(false);
  // State for showing success/error messages
  const [message, setMessage] = useState(null);

  // Function to handle the booking submission
  async function handleBook(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear any previous messages

    try {
      // 1. Save the new booking in the backend via a POST request
      const bookingRes = await fetch(`${config.API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: spot._id,
          spotName: spot.Name_of_parking_place, // Use the correct field from the backend data
          name: form.name,
          vehicle: form.vehicle,
          timeslot: form.timeslot,
        }),
      });

      if (!bookingRes.ok) throw new Error("Failed to create booking");

      // 2. Update the parking spot's available count via a PATCH request
      // We assume your `spot` object has an `available` property to track this.
      await fetch(`${config.API_BASE_URL}/api/parking/${spot._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          available: Math.max(0, spot.capacity - 1), // Decrease the capacity
        }),
      });

      setMessage({ text: "Booking saved successfully!", type: 'success' });
      setShowBook(false);
      setForm({ name: "", vehicle: "", timeslot: "" });

      // 3. Trigger a refresh in the parent component to update the UI
      if (onBooking) onBooking();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Something went wrong while booking.", type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  // Tailwind CSS classes for a clean, responsive card design
  const cardStyle = "bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-shadow duration-200 hover:shadow-lg";
  const buttonStyle = "px-4 py-2 font-semibold rounded-lg transition-colors duration-150";
  const primaryButtonStyle = `${buttonStyle} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryButtonStyle = `${buttonStyle} border border-gray-300 text-gray-700 hover:bg-gray-100`;
  const confirmButtonStyle = `${buttonStyle} bg-green-500 text-white hover:bg-green-600`;
  const cancelButtonClass = `${buttonStyle} border border-gray-300 text-gray-700 hover:bg-gray-100`;
  const inputClass = "block w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className={cardStyle}>
      {/* Message Box for user feedback */}
      {message && (
        <MessageBox 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage(null)} 
        />
      )}
      
      <h3 className="text-xl font-bold text-gray-800">{spot.Name_of_parking_place}</h3>
      <p className="mt-2 text-sm text-gray-500">{spot.address || 'Address not available'}</p>
      <p className="mt-3 text-lg font-medium">Slots: <strong>{spot.capacity}</strong> • Available: <strong>{spot.capacity}</strong></p>
      <p className="text-lg font-medium">Price/hr: <span className="font-bold text-gray-800">₹{spot.pricePerHour || 'N/A'}</span></p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => setShowBook(s => !s)} className={primaryButtonStyle}>
          Book Now
        </button>
        <button onClick={() => {
          const num = "919999999999";
          const text = `Hi, I want to book ${encodeURIComponent(spot.Name_of_parking_place)}`;
          window.open(`https://wa.me/${num}?text=${text}`, "_blank");
        }} className={secondaryButtonStyle}>
          WhatsApp
        </button>
      </div>

      {showBook && (
        <form onSubmit={handleBook} className="mt-4">
          <input 
            required 
            placeholder="Your name" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            className={inputClass}
          />
          <input 
            required 
            placeholder="Vehicle (Car/Motorcycle)" 
            value={form.vehicle} 
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })} 
            className={inputClass}
          />
          <input 
            required 
            placeholder="Timeslot (e.g. 2025-12-01 18:00-21:00)" 
            value={form.timeslot} 
            onChange={(e) => setForm({ ...form, timeslot: e.target.value })} 
            className={inputClass}
          />
          <div className="flex gap-2 mt-3">
            <button type="submit" disabled={loading} className={confirmButtonStyle}>
              {loading ? "Booking..." : "Confirm"}
            </button>
            <button type="button" onClick={() => setShowBook(false)} className={cancelButtonClass}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
