import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState('');

  const [locations, setLocations] = useState([]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loginUserId, setLoginUserId] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const openModal = (title, message, isSuccess = true) => {
    setModalContent({ title, message, isSuccess });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalContent.isNewUser) {
      setLoginUserId(modalContent.newUserUid);
    }
  };

  // Firebase initialization
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

  // Realtime listeners for locations and parking spots
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

  // Seed initial data (safe version)
  useEffect(() => {
    if (!isAuthReady || !db) return;
    if (locations.length > 0) return; // skip if already exists

    const initialData = [
      {
        name: "Downtown Parking",
        data: [
          {
            Name_of_parking_place: "Main Street Lot",
            capacity: 50,
            Type_of_parking: "Paid",
            Type_of_vehicle: "Car"
          },
          {
            Name_of_parking_place: "Riverfront Garage",
            capacity: 120,
            Type_of_parking: "Free",
            Type_of_vehicle: "Car"
          }
        ]
      }
    ];

    const uploadInitialData = async () => {
      const locationsCollection = collection(db, `artifacts/${appId}/public/data/locations`);
      const parkingCollection = collection(db, `artifacts/${appId}/public/data/parking_spots`);

      for (const location of initialData) {
        if (!location?.name || !Array.isArray(location.data)) continue;

        const existingLocation = locations.find(loc => loc.name === location.name);
        if (!existingLocation) {
          const newLocationRef = doc(locationsCollection);
          const newLocationId = newLocationRef.id;

          await setDoc(newLocationRef, { name: location.name });

          for (const spot of location.data) {
            if (!spot?.Name_of_parking_place || !spot?.capacity) continue;
            const newSpot = {
              locationId: newLocationId,
              name: spot.Name_of_parking_place,
              slots: spot.capacity,
              available: spot.capacity,
              pricePerHour: spot.Type_of_parking === "Paid" ? 1 : 0,
              typeOfVehicle: spot.Type_of_vehicle
            };
            await addDoc(parkingCollection, newSpot);
          }
        }
      }
    };

    uploadInitialData();
  }, [isAuthReady, db, appId, locations]);

  // Bookings listener
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

  // Booking submission
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
        const currentAvailable = spotDoc.data().available ?? 0;
        await updateDoc(spotRef, { available: Math.max(currentAvailable - 1, 0) });
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

  // Vacate space
  const handleVacateSpace = async (bookingId) => {
    if (!db || !loginUserId) return false;

    try {
      const bookingToVacate = bookings.find((b) => b.id === bookingId);
      if (!bookingToVacate) return false;

      const spotRef = doc(db, `artifacts/${appId}/public/data/parking_spots`, bookingToVacate.spotId);
      const bookingRef = doc(db, `artifacts/${appId}/public/data/bookings`, bookingId);

      const spotDoc = await getDoc(spotRef);
      if (spotDoc.exists()) {
        const currentAvailable = spotDoc.data().available ?? 0;
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
          <Route
            path="/dashboard"
            element={
              <Dashboard
                parkingSpots={parkingSpots}
                locations={locations}
                onBookNow={handleBookSubmit} // ✅ passed function
              />
            }
          />
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
