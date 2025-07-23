import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "../auth/stack";
import Navbar from "../components/layout/Navbar";
import FooterReveal from "../components/layout/FooterReveal";

const UserLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/sign-up");

  useEffect(() => {
    setIsSignUp(location.pathname === "/sign-up");
  }, [location.pathname]);

  const handleToggle = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    navigate(signUpMode ? "/sign-up" : "/sign-in");
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow w-full flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-sm md:max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden md:grid md:grid-cols-2">
          {/* Form Side */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="w-full max-w-md">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => handleToggle(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    !isSignUp
                      ? "bg-white text-pink-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleToggle(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    isSignUp
                      ? "bg-white text-pink-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="auth-container">
                <style>{`
                  .stack-form { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
                  .stack-form h1, .stack-form > p { display: none !important; }
                  .stack-input { width: 100% !important; padding: 12px 16px !important; border: 1px solid #d1d5db !important; border-radius: 8px !important; font-size: 16px !important; transition: all 0.2s ease !important; background: white !important; color: #374151 !important; margin-bottom: 1rem !important; }
                  .stack-input:focus { outline: none !important; border-color: #ec4899 !important; box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2) !important; }
                  .stack-button { width: 100% !important; background: linear-gradient(to right, #ec4899, #db2777) !important; color: white !important; padding: 12px 16px !important; border-radius: 8px !important; border: none !important; font-weight: 600 !important; font-size: 16px !important; transition: all 0.3s ease !important; cursor: pointer !important; margin-top: 1rem !important; margin-bottom: 1rem !important; }
                  .stack-button:hover { background: linear-gradient(to right, #db2777, #be185d) !important; }
                  .stack-social-buttons { margin-bottom: 1rem !important; }
                `}</style>
                <StackHandler
                  app={stackClientApp}
                  location={isSignUp ? "/sign-up" : "/sign-in"}
                  fullPage={false}
                />
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-pink-300 p-6 lg:p-12 text-center">
            <div className="w-full">
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-2xl opacity-40"></div>
                <img
                  src="/assets/riya1.png"
                  alt="Riya AI"
                  className="relative w-full h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-white mx-auto"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Meet Riya
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
                Your AI companion is ready to chat, listen, and brighten your
                day with empathy and intelligence.
              </p>
            </div>
          </div>
        </div>
      </main>
      <FooterReveal />
    </div>
  );
};

export default UserLogin;
