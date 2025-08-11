
import React,{ useState,useEffect,NavLink } from "react";
import { useNavigate,useParams } from "react-router-dom";

function Bookings({ loginUserId, bookings, parkingSpots, handleVacateSpace }) {
    const navigate = useNavigate();

    // Find the parking spot details for each booking
    const enrichedBookings = bookings.map(booking => {
      const spot = parkingSpots.find(spot => spot.id === booking.spotId);
      return {
        ...booking,
        spotName: spot ? spot.name : 'Unknown Spot',
        spotLocation: spot ? spot.locationId : 'Unknown Location',
      };
    });
  
    if (!loginUserId) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">You are not signed in.</h2>
                <p className="text-gray-500 mb-4">Please sign in with your User ID to view your bookings.</p>
                <NavLink to="/signin" className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Sign In
                </NavLink>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-sm font-mono text-gray-600 truncate">
                    <span className="font-bold">Your User ID:</span> {loginUserId}
                </p>
            </div>
            {enrichedBookings.length > 0 ? (
                <div className="space-y-4">
                    {enrichedBookings.map(booking => (
                        <div key={booking.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-lg font-bold text-gray-800">{booking.spotName}</p>
                            <p className="text-sm text-gray-600">Name: {booking.name}</p>
                            <p className="text-sm text-gray-600">Vehicle: {booking.vehicleType} ({booking.licensePlate})</p>
                            <p className="text-sm text-gray-600">Start Time: {new Date(booking.startTime).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Duration: {booking.duration} hours</p>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleVacateSpace(booking.id)}
                                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Vacate Space
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">You have no active bookings.</p>
            )}
        </div>
    );
}
export default Bookings;