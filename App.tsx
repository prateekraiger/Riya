import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { useSession } from "./hooks/useSession";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { isSessionLoaded } = useSession();

  if (loading || !isSessionLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          <p className="text-sm text-muted-foreground">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <React.Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
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
  );
};

export default App;
