import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Navbar from "./components/layout/Navbar";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if current route is auth page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // Hide the loader after auth is loaded and minimum time has passed
  React.useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1600); // 1.6 seconds
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Full-screen loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-background z-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <React.Suspense
        fallback={
          <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
              <p className="text-sm text-primary font-medium">
                Loading page...
              </p>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Auth pages without Layout for full control */}
          <Route
            path="/login"
            element={
              <div className="w-full min-h-screen">
                <Navbar />
                <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
                  <SignIn routing="path" path="/login" />
                </div>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="w-full min-h-screen">
                <Navbar />
                <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
                  <SignUp routing="path" path="/signup" />
                </div>
              </div>
            }
          />

          {/* Regular pages with Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute user={user}>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </React.Suspense>
    </div>
  );
};

export default App;
