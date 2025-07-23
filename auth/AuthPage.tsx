import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");

  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  const handleToggle = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    navigate(signUpMode ? "/signup" : "/login");
  };

  // Redirect to Stack auth pages with custom styling
  const handleAuth = () => {
    if (isSignUp) {
      navigate("/handler/sign-up");
    } else {
      navigate("/handler/sign-in");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-100 pt-16">
      {/* Page Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 bg-clip-text text-transparent mb-4">
          Join the Riya Experience
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Connect with your AI companion and discover meaningful conversations
          that brighten your day
        </p>
      </div>

      {/* Full width container */}
      <div className="w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Side - Riya Image - Full height and width */}
          <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-pink-300 flex items-center justify-center p-8 lg:p-16">
            <div className="max-w-lg w-full text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-2xl opacity-40"></div>
                <img
                  src="/assets/riya1.png"
                  alt="Riya AI"
                  className="relative w-full h-auto max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-white"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Meet Riya
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-md mx-auto">
                Your AI companion is ready to chat, listen, and brighten your
                day with empathy and intelligence.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Form - Full height and width */}
          <div className="bg-white flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
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

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {isSignUp ? "Join Riya" : "Welcome Back"}
                </h2>
                <p className="text-gray-600 text-lg">
                  {isSignUp
                    ? "Create your account to start chatting"
                    : "Sign in to continue your conversation"}
                </p>
              </div>

              {/* Custom Auth Button */}
              <button
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-6 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mb-6 text-lg"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </button>

              {/* Features List */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Secure authentication with email or social login</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Personalized AI conversations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Privacy-focused and secure</span>
                </div>
              </div>

              {/* Info Text */}
              <div className="text-center text-sm text-gray-500 mt-8">
                <p>
                  By continuing, you'll be redirected to our secure
                  authentication page where you can{" "}
                  {isSignUp ? "create your account" : "sign in"} with email or
                  social providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
