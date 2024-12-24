import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navigation from "./components/layout/Navigation";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./components/Login";

function App() {
  const { user } = useAuth();

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
