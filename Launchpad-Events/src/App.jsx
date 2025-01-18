import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navigation from "./components/layout/Navigation";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EventCard from "./components/EventCard";
import Event from "./components/Event";

function App() {
  const { user, isAdmin } = useAuth();
  console.log("User data:", user);
  console.log("Is Admin:", isAdmin);
  console.log("User role:", user?.role);

  return (
    <>
      {user && <Navigation />}
      <main className={user ? "container py-8" : ""}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/events" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/events" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/events" replace /> : <Signup />}
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute adminOnly>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <Event />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
