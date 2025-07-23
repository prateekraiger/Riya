import React from "react";
import { useLocation } from "react-router-dom";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "./stack";
import Navbar from "../components/layout/Navbar";
import FooterReveal from "../components/layout/FooterReveal";

const CustomAccountSettings = () => {
  const location = useLocation();

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content - Flex Grow to Push Footer Down */}
      <div className="flex-grow flex flex-col">
        {/* Page Header */}
        <div className="text-center pt-28 pb-12 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 bg-clip-text text-transparent mb-4">
            Account Settings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your profile, security, and preferences
          </p>
        </div>

        {/* Account Settings Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Custom Stack Account Settings Styling */}
            <style>{`
              /* Stack Account Settings Custom Styling */
              .stack-form {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 3rem !important;
                max-width: 100% !important;
              }

              @media (max-width: 768px) {
                .stack-form {
                  padding: 2rem !important;
                }
              }

              .stack-form h1 {
                font-size: 2rem !important;
                font-weight: 700 !important;
                color: #111827 !important;
                margin-bottom: 1.5rem !important;
              }

              .stack-form p {
                color: #6b7280 !important;
                margin-bottom: 2rem !important;
                font-size: 1.125rem !important;
                line-height: 1.6 !important;
              }

              .stack-input {
                width: 100% !important;
                padding: 1rem 1.25rem !important;
                border: 1.5px solid #d1d5db !important;
                border-radius: 0.75rem !important;
                font-size: 1.125rem !important;
                transition: all 0.2s ease !important;
                background: white !important;
                color: #374151 !important;
                margin-bottom: 1.5rem !important;
                height: auto !important;
                line-height: 1.5 !important;
              }

              .stack-input:focus {
                outline: none !important;
                border-color: #ec4899 !important;
                box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2) !important;
              }

              .stack-input::placeholder {
                color: #9ca3af !important;
              }

              .stack-button {
                background: linear-gradient(
                  to right,
                  #ec4899,
                  #db2777
                ) !important;
                color: white !important;
                padding: 1rem 2rem !important;
                border-radius: 0.75rem !important;
                border: none !important;
                font-weight: 600 !important;
                font-size: 1.125rem !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
                margin-top: 1rem !important;
                margin-bottom: 1rem !important;
                display: inline-block !important;
                text-align: center !important;
                letter-spacing: 0.025em !important;
              }

              .stack-button:hover {
                background: linear-gradient(
                  to right,
                  #db2777,
                  #be185d
                ) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3) !important;
              }

              .stack-button:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                transform: none !important;
              }

              .stack-error {
                color: #ef4444 !important;
                font-size: 1rem !important;
                margin-top: 0.5rem !important;
                margin-bottom: 1rem !important;
              }

              .stack-label {
                color: #374151 !important;
                font-weight: 600 !important;
                margin-bottom: 0.5rem !important;
                display: block !important;
                font-size: 1rem !important;
              }

              .stack-divider {
                margin: 2.5rem 0 !important;
                height: 1px !important;
                background-color: #e5e7eb !important;
              }

              .stack-link {
                color: #ec4899 !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                font-size: 1.125rem !important;
              }

              .stack-link:hover {
                color: #db2777 !important;
                text-decoration: underline !important;
              }

              .stack-checkbox {
                accent-color: #ec4899 !important;
                width: 1.25rem !important;
                height: 1.25rem !important;
              }

              .stack-form-group {
                margin-bottom: 2.5rem !important;
              }

              .stack-form-footer {
                margin-top: 2.5rem !important;
                font-size: 1rem !important;
                color: #6b7280 !important;
              }
            `}</style>

            <StackHandler
              app={stackClientApp}
              location={location.pathname}
              fullPage={false}
            />
          </div>
        </div>
      </div>

      {/* Footer - Now will stay at the bottom */}
      <div className="mt-auto">
        <FooterReveal />
      </div>
    </div>
  );
};

export default CustomAccountSettings;
