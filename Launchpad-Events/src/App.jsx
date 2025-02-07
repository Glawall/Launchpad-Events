import { Routes, Route, Navigate } from "react-router-dom";
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

  return (
    <div className="app">
      <div className="content">
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
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute adminOnly>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
