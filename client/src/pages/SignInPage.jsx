import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
function SignInPage({ setLoginUserId, loginUserId, openModal }) {
    const [userIdInput, setUserIdInput] = useState('');
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        if (userIdInput.trim()) {
            setLoginUserId(userIdInput.trim());
            navigate('/bookings');
        } else {
            openModal("Error", "Please enter a valid User ID.", false);
        }
    };

    if (loginUserId) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Already Signed In</h2>
                <p className="text-gray-600 mb-4">You are currently signed in with User ID:</p>
                <p className="text-sm font-mono text-gray-800 bg-gray-100 p-2 rounded-lg truncate">{loginUserId}</p>
                <div className="mt-4">
                    <NavLink to="/bookings" className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Go to My Bookings
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In with User ID</h2>
            <p className="text-gray-600 mb-4">
                To view your bookings, enter the User ID you received when you made a booking.
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                    <label htmlFor="userIdInput" className="block text-sm font-medium text-gray-700">User ID</label>
                    <input
                        type="text"
                        id="userIdInput"
                        name="userIdInput"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
export default SignInPage;