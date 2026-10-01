import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import DoctorList from "./pages/DoctorList";
import DoctorDetails from "./pages/DoctorDetails";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

// সব পেজের কাঠামো: উপরে Navbar, নিচে <Outlet/> (যেখানে matching পেজ বসে)
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-line/70 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} MediBook — Learning project
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="gradient-text text-6xl font-bold">404</p>
      <p className="mt-3 text-muted">এই পেজটি খুঁজে পাওয়া যায়নি।</p>
      <Link to="/" className="btn-primary mt-6">হোমে যাও</Link>
    </div>
  );
}

function AppRoutes() {
  const { checkingSession } = useAuth();

  // refresh cookie চেক শেষ না হওয়া পর্যন্ত অপেক্ষা — নইলে লগইন করা ইউজারও এক ঝলক logged-out দেখত
  if (checkingSession) {
    return <div className="grid min-h-screen place-items-center"><Spinner className="!h-8 !w-8" /></div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DoctorList />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  // Provider এর ক্রম গুরুত্বপূর্ণ: বাইরেরটা ভেতরেরগুলোকে ডেটা দেয়
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}