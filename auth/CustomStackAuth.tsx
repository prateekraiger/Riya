import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "./stack";
import Navbar from "../components/layout/Navbar";
import FooterReveal from "../components/layout/FooterReveal";

const CustomStackAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <div className="text-center pt-24 pb-12 px-4">
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

          {/* Right Side - Stack Auth Components */}
          <div className="bg-white flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md">
              {/* Custom Stack Auth Styling */}
              <style jsx global>{`
                /* Stack Auth Custom Styling */
                .stack-form {
                  background: transparent !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 0 !important;
                }

                .stack-form h1 {
                  font-size: 2rem !important;
                  font-weight: 700 !important;
                  color: #111827 !important;
                  text-align: center !important;
                  margin-bottom: 0.5rem !important;
                }

                .stack-form p {
                  color: #6b7280 !important;
                  text-align: center !important;
                  margin-bottom: 2rem !important;
                  font-size: 1.125rem !important;
                }

                .stack-input {
                  width: 100% !important;
                  padding: 12px 16px !important;
                  border: 1px solid #d1d5db !important;
                  border-radius: 8px !important;
                  font-size: 16px !important;
                  transition: all 0.2s ease !important;
                  background: white !important;
                  color: #374151 !important;
                  margin-bottom: 1rem !important;
                }

                .stack-input:focus {
                  outline: none !important;
                  border-color: #ec4899 !important;
                  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2) !important;
                }

                .stack-input::placeholder {
                  color: #9ca3af !important;
                }

                .stack-button {
                  width: 100% !important;
                  background: linear-gradient(
                    to right,
                    #ec4899,
                    #db2777
                  ) !important;
                  color: white !important;
                  padding: 12px 16px !important;
                  border-radius: 8px !important;
                  border: none !important;
                  font-weight: 600 !important;
                  font-size: 16px !important;
                  transition: all 0.3s ease !important;
                  cursor: pointer !important;
                  margin-top: 1rem !important;
                  margin-bottom: 1rem !important;
                }

                .stack-button:hover {
                  background: linear-gradient(
                    to right,
                    #db2777,
                    #be185d
                  ) !important;
                  transform: scale(1.02) !important;
                  box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3) !important;
                }

                .stack-button:disabled {
                  opacity: 0.5 !important;
                  cursor: not-allowed !important;
                  transform: scale(1) !important;
                }

                .stack-social-buttons {
                  display: flex !important;
                  justify-content: center !important;
                  gap: 1rem !important;
                  margin-bottom: 2rem !important;
                }

                .stack-social-button {
                  background: white !important;
                  border: 1px solid #e5e7eb !important;
                  padding: 12px !important;
                  border-radius: 12px !important;
                  transition: all 0.3s ease !important;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                  cursor: pointer !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  width: 48px !important;
                  height: 48px !important;
                }

                .stack-social-button:hover {
                  background: #f9fafb !important;
                  transform: scale(1.05) !important;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                }

                .stack-social-button svg {
                  width: 24px !important;
                  height: 24px !important;
                }

                .stack-error {
                  color: #ef4444 !important;
                  font-size: 14px !important;
                  margin-top: 4px !important;
                  margin-bottom: 8px !important;
                }

                .stack-label {
                  color: #374151 !important;
                  font-weight: 500 !important;
                  margin-bottom: 4px !important;
                  display: block !important;
                  font-size: 14px !important;
                }

                .stack-divider {
                  margin: 24px 0 !important;
                  position: relative !important;
                  text-align: center !important;
                }

                .stack-divider::before {
                  content: "" !important;
                  position: absolute !important;
                  top: 50% !important;
                  left: 0 !important;
                  right: 0 !important;
                  height: 1px !important;
                  background: #d1d5db !important;
                }

                .stack-divider span {
                  background: white !important;
                  padding: 0 16px !important;
                  color: #6b7280 !important;
                  font-size: 14px !important;
                  position: relative !important;
                }

                .stack-link {
                  color: #ec4899 !important;
                  text-decoration: none !important;
                  font-weight: 500 !important;
                }

                .stack-link:hover {
                  color: #db2777 !important;
                  text-decoration: underline !important;
                }

                .stack-checkbox {
                  accent-color: #ec4899 !important;
                }

                .stack-form-group {
                  margin-bottom: 1rem !important;
                }

                .stack-form-footer {
                  text-align: center !important;
                  margin-top: 1.5rem !important;
                  font-size: 14px !important;
                  color: #6b7280 !important;
                }
              `}</style>

              <StackHandler
                app={stackClientApp}
                location={location.pathname}
                fullPage={false}
                onSignIn={() => navigate("/chat")}
                onSignUp={() => navigate("/chat")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterReveal />
    </div>
  );
};

export default CustomStackAuth;
