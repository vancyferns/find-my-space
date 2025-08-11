import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="text-gray-900">
      <section className="text-center py-20 bg-gray-800 text-white rounded-lg shadow-lg mb-8">
        <h1 className="text-5xl font-extrabold mb-4">Find My Space</h1>
        <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
          The smart parking platform for event-goers and locals. Find your spot, fast.
        </p>
        <NavLink to="/dashboard" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors">
          Find a Spot
        </NavLink>
      </section>
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-blue-500 mb-4 inline-block">📍</span>
            <h3 className="text-xl font-bold mb-2">Find a Spot</h3>
            <p className="text-gray-600">Easily discover pre-verified parking spots near your event or location.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-green-500 mb-4 inline-block">💸</span>
            <h3 className="text-xl font-bold mb-2">Book & Pay</h3>
            <p className="text-gray-600">Reserve your space with a simple click and pay securely.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-4xl text-red-500 mb-4 inline-block">🚗</span>
            <h3 className="text-xl font-bold mb-2">Park & Go</h3>
            <p className="text-gray-600">Get turn-by-turn directions and park with peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default LandingPage;