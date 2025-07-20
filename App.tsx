import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader"; // Adjust the path if needed
import { SignIn, SignUp } from "@clerk/clerk-react";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));

const App: React.FC = () => {
  const { user, loading } = useAuth();
  // You might have some state here to control when the loader is visible
  const [isLoading, setIsLoading] = React.useState(true);

  // Example: Hide the loader after auth is loaded and minimum time has passed
  React.useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // 3 seconds minimum display time
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Layout>
          <React.Suspense
            fallback={
              <div className="flex-grow flex items-center justify-center min-h-[50vh]">
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
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/login"
                element={<SignIn routing="path" path="/login" />}
              />
              <Route
                path="/signup"
                element={<SignUp routing="path" path="/signup" />}
              />
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
          </React.Suspense>
        </Layout>
      )}
    </div>
  );
};

export default App;
