function ParkingCard({ name, location, price, available }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 w-full sm:w-72">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{location}</p>
      <p className="mt-2 text-gray-800 font-medium">₹{price} / hour</p>
      <p className={`mt-1 ${available ? "text-green-600" : "text-red-600"}`}>
        {available ? "Available" : "Full"}
      </p>
      <button
        disabled={!available}
        className={`mt-4 px-4 py-2 rounded-lg w-full ${
          available
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {available ? "Book Now" : "Unavailable"}
      </button>
    </div>
  );
}

export default ParkingCard;
