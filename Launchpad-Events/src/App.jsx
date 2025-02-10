import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Navigation from "./components/layout/Navigation";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Event from "./components/Event";
import { EventTypesProvider } from "./context/EventTypesContext";
import ManageUsers from "./components/ManageUsers";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Footer from "./components/Footer";
import TermsOfService from "./components/TermsOfService";
import Home from "./components/Home";
import { useEffect } from "react";

function App() {
  return (
    <AuthProvider>
      <EventTypesProvider>
        <AppContent />
      </EventTypesProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect");

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app">
      <div className="content">
        {user && <Navigation />}
        <main className={user ? "container py-8" : ""}>
          <Routes>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/events" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/events" replace /> : <Signup />}
            />
            <Route
              path="/"
              element={user ? <Navigate to="/events" replace /> : <Home />}
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
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
