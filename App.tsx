import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import { NotFound } from "./components/ui/not-found";
import { stackClientApp } from "./auth/stack";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const UserLogin = React.lazy(() => import("./pages/UserLogin"));
const CustomStackAuth = React.lazy(() => import("./auth/CustomStackAuth"));
const CustomAccountSettings = React.lazy(
  () => import("./auth/CustomAccountSettings")
);

function HandlerRoutes() {
  const location = useLocation();

  // Use CustomAccountSettings for account settings route
  if (location.pathname.includes("/handler/account-settings")) {
    return <CustomAccountSettings />;
  }

  // Use CustomStackAuth for all other handler routes
  return <CustomStackAuth />;
}

function AppContent() {
  const { user } = useAuth();
  // const location = useLocation();
  // Removed unused navigate variable
  const [isLoading, setIsLoading] = useState(true);

  // Hide the loader after a maximum of 1600ms (1.6 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

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
          <Route
            path="/handler/oauth-callback"
            element={
              <StackHandler
                app={stackClientApp}
                location="/handler/oauth-callback"
                fullPage={true}
              />
            }
          />
          <Route path="/handler/*" element={<HandlerRoutes />} />

          {/* Auth pages without Layout for full control */}
          <Route path="/sign-in" element={<UserLogin />} />
          <Route path="/sign-up" element={<UserLogin />} />

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
                  {/* 404 Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </React.Suspense>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <AppContent />
          </StackTheme>
        </StackProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
