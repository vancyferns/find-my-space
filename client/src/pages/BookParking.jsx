import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";


function BookParking({ handleBookSubmit, parkingSpots, openModal, closeModal, setLoginUserId }) {
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spot = parkingSpots.find(s => s.id === spotId);

  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
    startTime: new Date().toISOString().slice(0, 16),
    duration: 1,
  });

  useEffect(() => {
    if (!spot && parkingSpots.length > 0) {
      navigate(`/dashboard`); // Redirect if spot is not found
    }
  }, [spot, parkingSpots, navigate]);

  if (!spot) {
    return null; // Don't render until spot is found or redirected
  }
  
  if (spot.available === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sorry, this spot is currently full.</h2>
        <p className="text-gray-500">Please check back later or choose another spot.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUserId = await handleBookSubmit(spotId, bookingDetails);
    if (newUserId) {
        setLoginUserId(newUserId);
        navigate('/bookings');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Parking at: {spot.name}</h2>
      <p className="text-gray-600 mb-4">Available Slots: {spot.available}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingDetails.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={bookingDetails.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <input
            type="text"
            id="vehicleType"
            name="vehicleType"
            value={bookingDetails.vehicleType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={bookingDetails.licensePlate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={bookingDetails.startTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={bookingDetails.duration}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
export default BookParking;