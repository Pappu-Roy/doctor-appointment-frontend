import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DoctorList from "./pages/DoctorList";

// Small inner component so it can call useAuth() — useAuth() only works
// INSIDE <AuthProvider>, and App() itself is what renders the provider,
// so App() can't call the hook on itself. This split is a common React
// pattern: "Provider wrapper" component + "consumer" component.
function AppContent() {
  const { user, checkingSession, logout } = useAuth();

  // While we're silently checking if the refresh cookie is still valid,
  // show nothing meaningful yet — avoids a flash of the login form for
  // someone who's actually already logged in.
  if (checkingSession) {
    return <p className="session-loading">লোড হচ্ছে...</p>;
  }

  if (!user) {
    // onAuthSuccess is intentionally a no-op: login() inside AuthContext
    // already updates the `user` state, and since AppContent reads that
    // same state via useAuth(), React re-renders this component
    // automatically the moment login succeeds — no extra wiring needed.
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div>
      <nav className="navbar">
        <span>স্বাগতম, {user.name}</span>
        <button onClick={logout}>লগ আউট</button>
      </nav>
      <DoctorList />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;