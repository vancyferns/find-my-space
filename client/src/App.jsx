import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';


// inside <Routes>

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  query,
  where
} from 'firebase/firestore';

// Component imports
import Modal from "./components/Modal";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import BookParking from "./pages/BookParking";
import Bookings from "./pages/Bookings";
import SignInPage from "./pages/SignInPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Footer from "./components/Footer";
import { firebaseConfig } from './config';
// -----------------------------------------------------------------------------
// Main App Component
// -----------------------------------------------------------------------------
function App() {
  // State for Firebase services and user information.
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null); // The authenticated Firebase user object.
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState('');

  // State for user-specific data and UI.
  const [locations, setLocations] = useState([]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loginUserId, setLoginUserId] = useState(''); // The user ID used for viewing bookings.

  // State for UI feedback.
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Function to show a custom modal for user notifications.
  const openModal = (title, message, isSuccess = true) => {
    setModalContent({ title, message, isSuccess });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Clear loginUserId on modal close if the message indicates a new ID was created.
    if (modalContent.isNewUser) {
      setLoginUserId(modalContent.newUserUid);
    }
  };

  // Main useEffect for Firebase initialization and auth state management.
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';

        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);

        setAppId(appId);
        setAuth(authInstance);
        setDb(dbInstance);

        // Sign-in attempts
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } catch (error) {
            console.warn("Custom token sign-in failed, falling back to anonymous sign-in.", error);
            await signInAnonymously(authInstance);
          }
        } else {
          await signInAnonymously(authInstance);
        }

        onAuthStateChanged(authInstance, (user) => {
          setFirebaseUser(user);
          setIsAuthReady(true);
        });
      } catch (error) {
        console.error("Firebase initialization failed:", error);
        setIsAuthReady(true);
      }
    };
    initializeFirebase();
  }, []);

  // Listener for locations and parking spots
  useEffect(() => {
    if (!isAuthReady || !db) return;

    const locationsCollection = collection(db, `artifacts/${appId}/public/data/locations`);
    const locationsUnsub = onSnapshot(locationsCollection, (snapshot) => {
      const fetchedLocations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(fetchedLocations);
    });

    const parkingCollection = collection(db, `artifacts/${appId}/public/data/parking_spots`);
    const parkingUnsub = onSnapshot(parkingCollection, (snapshot) => {
      const fetchedParking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParkingSpots(fetchedParking);
    });

    return () => {
      locationsUnsub();
      parkingUnsub();
    };
  }, [isAuthReady, db, appId]);

  // useEffect to seed initial data for multiple locations
  useEffect(() => {
    if (!isAuthReady || !db || locations.length === 0) return;

    // Define all initial data here.
     const initialData = [{}];


// ... then use this new `initialData` array in your `uploadInitialData` function.

   const uploadInitialData = async () => {
  const locationsCollection = collection(db, `artifacts/${appId}/public/data/locations`);
  const parkingCollection = collection(db, `artifacts/${appId}/public/data/parking_spots`);
  
  for (const location of initialData) {
    // Check if the location already exists
    const existingLocation = locations.find(loc => loc.name === location.name);
    
    if (!existingLocation) {
      // Location does not exist, so add it
      const newLocationRef = doc(locationsCollection);
      const newLocationId = newLocationRef.id;
      
      await setDoc(newLocationRef, { name: location.name });
      
      // Add all parking spots for the new location
      for (const spot of location.data) {
        const newSpot = {
          locationId: newLocationId,
          name: spot.Name_of_parking_place,
          slots: spot.capacity,
          available: spot.capacity,
          pricePerHour: spot.Type_of_parking === "Paid" ? 1 : 0,
          typeOfVehicle: spot.Type_of_vehicle,
        };
        await addDoc(parkingCollection, newSpot);
      }
      console.log(`Added all data for new location: ${location.name}`);
    } else {
      // Location exists, check for any new parking spots and add them
      const existingSpotsInLocation = parkingSpots.filter(spot => spot.locationId === existingLocation.id);
      const existingSpotNames = new Set(existingSpotsInLocation.map(spot => spot.name));
      
      for (const spot of location.data) {
        if (!existingSpotNames.has(spot.Name_of_parking_place)) {
          const newSpot = {
            locationId: existingLocation.id,
            name: spot.Name_of_parking_place,
            slots: spot.capacity,
            available: spot.capacity,
            pricePerHour: spot.Type_of_parking === "Paid" ? 1 : 0,
            typeOfVehicle: spot.Type_of_vehicle,
          };
          await addDoc(parkingCollection, newSpot);
          console.log(`Added new spot to existing location (${location.name}): ${newSpot.name}`);
        }
      }
    }
  }
};
uploadInitialData();

  }, [isAuthReady, db, appId, locations, parkingSpots]);

  // Listener for bookings of the logged-in user
  useEffect(() => {
    if (!isAuthReady || !db || !loginUserId) {
      setBookings([]);
      return;
    }
    
    const bookingsCollection = collection(db, `artifacts/${appId}/public/data/bookings`);
    const q = query(bookingsCollection, where("userId", "==", loginUserId));

    const bookingsUnsub = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(fetchedBookings);
    });

    return () => bookingsUnsub();
  }, [isAuthReady, db, appId, loginUserId]);

  // Booking submission handler
  const handleBookSubmit = async (spotId, bookingDetails) => {
    if (!db || !auth) {
      openModal("Error", "Application not ready. Please try again.", false);
      return false;
    }

    try {
      const newUserId = crypto.randomUUID();
      const bookingsCollection = collection(db, `artifacts/${appId}/public/data/bookings`);

      await addDoc(bookingsCollection, {
        ...bookingDetails,
        spotId,
        bookingTime: new Date().toISOString(),
        userId: newUserId,
      });

      const spotRef = doc(db, `artifacts/${appId}/public/data/parking_spots`, spotId);
      const spotDoc = await getDoc(spotRef);
      if (spotDoc.exists()) {
        const currentAvailable = spotDoc.data().available;
        await updateDoc(spotRef, { available: currentAvailable > 0 ? currentAvailable - 1 : 0 });
      }

      openModal(
        "Booking Confirmed!",
        `Your booking is complete. Your User ID is:\n\n${newUserId}\n\nUse this ID to log in and view your booking!`,
        true
      );
      return newUserId;
    } catch (error) {
      console.error("Error submitting booking:", error);
      openModal("Booking Failed", `Error: ${error.message}`, false);
      return false;
    }
  };

  // Vacate space handler
  const handleVacateSpace = async (bookingId) => {
    if (!db || !loginUserId) return false;
    
    try {
      const bookingToVacate = bookings.find((b) => b.id === bookingId);
      if (!bookingToVacate) {
        console.error("Booking not found.");
        return false;
      }
      
      const spotRef = doc(db, `artifacts/${appId}/public/data/parking_spots`, bookingToVacate.spotId);
      const bookingRef = doc(db, `artifacts/${appId}/public/data/bookings`, bookingId);

      const spotDoc = await getDoc(spotRef);
      if (spotDoc.exists()) {
        const currentAvailable = spotDoc.data().available;
        await updateDoc(spotRef, { available: currentAvailable + 1 });
      }
      await deleteDoc(bookingRef);

      openModal("Success", "Space vacated successfully!", true);
      return true;
    } catch (error) {
      console.error("Error vacating space:", error);
      openModal("Error", "Failed to vacate space. Please try again.", false);
      return false;
    }
  };

  if (!isAuthReady) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Initializing application...</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
      <script src="https://cdn.tailwindcss.com"></script>
      <Navbar loginUserId={loginUserId} setLoginUserId={setLoginUserId} />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard parkingSpots={parkingSpots} locations={locations} />} />
          <Route
            path="/book/:spotId"
            element={
              <BookParking
                handleBookSubmit={handleBookSubmit}
                parkingSpots={parkingSpots}
                openModal={openModal}
                closeModal={closeModal}
                setLoginUserId={setLoginUserId}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <Bookings
                loginUserId={loginUserId}
                bookings={bookings}
                parkingSpots={parkingSpots}
                handleVacateSpace={handleVacateSpace}
              />
            }
          />
          <Route
            path="/signin"
            element={<SignInPage setLoginUserId={setLoginUserId} loginUserId={loginUserId} openModal={openModal} />}
          />
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Routes>
      </div>
      <Footer />
      <Modal show={showModal} onClose={closeModal} title={modalContent.title} isSuccess={modalContent.isSuccess}>
        <p className="whitespace-pre-line">{modalContent.message}</p>
      </Modal>
    </div>
  );
}

export default App;
