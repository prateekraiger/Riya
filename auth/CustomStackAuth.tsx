import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "./stack";

const CustomStackAuth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(
    location.pathname.includes("signup")
  );

  useEffect(() => {
    setIsSignUp(location.pathname.includes("signup"));
  }, [location.pathname]);

  const handleToggle = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    navigate(signUpMode ? "/sign-up" : "/sign-in");
  };

  return (
    <div className="h-screen flex flex-row font-geist w-full">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">
              {isSignUp
                ? "Get started with your new AI companion."
                : "Access your account and continue your journey with us"}
            </p>

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

            <StackHandler
              app={stackClientApp}
              location={isSignUp ? "/sign-up" : "/sign-in"}
              fullPage={false}
            />
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      <section className="flex-1 relative p-4 bg-muted/40">
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: `url(/assets/riya1.png)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-2xl opacity-40"></div>
        </div>
      </section>
    </div>
  );
};

export default CustomStackAuth;
