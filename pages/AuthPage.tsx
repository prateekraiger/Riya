import React, { useState, useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { FaGoogle, FaDiscord, FaMicrosoft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// Social Login Icons Component
const SocialLoginButtons = ({ isSignUp }: { isSignUp: boolean }) => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const handleSocialLogin = async (strategy: string) => {
    try {
      if (isSignUp) {
        await signUp?.authenticateWithRedirect({
          strategy: strategy as any,
          redirectUrl: "/chat",
          redirectUrlComplete: "/chat",
        });
      } else {
        await signIn?.authenticateWithRedirect({
          strategy: strategy as any,
          redirectUrl: "/chat",
          redirectUrlComplete: "/chat",
        });
      }
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      {/* Google Login Button */}
      <button
        onClick={() => handleSocialLogin("oauth_google")}
        className="bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
      >
        <FaGoogle className="text-2xl text-red-500" />
      </button>

      {/* Microsoft Login Button */}
      <button
        onClick={() => handleSocialLogin("oauth_microsoft")}
        className="bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
      >
        <FaMicrosoft className="text-2xl text-blue-600" />
      </button>

      {/* Discord Login Button */}
      <button
        onClick={() => handleSocialLogin("oauth_discord")}
        className="bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
      >
        <FaDiscord className="text-2xl text-indigo-600" />
      </button>
    </div>
  );
};

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn?.create({
        identifier: email,
        password,
      });

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setErrors({
        email: "",
        password: error.errors?.[0]?.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
          placeholder="Enter your password"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>

        <button
          type="button"
          className="text-sm text-pink-600 hover:text-pink-500 font-medium"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "", firstName: "", lastName: "" };

    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.firstName &&
      !newErrors.lastName
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signUp?.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error: any) {
      console.error("Sign up error:", error);
      setErrors({
        firstName: "",
        lastName: "",
        email: error.errors?.[0]?.message || "An error occurred during sign up",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp?.status === "complete") {
        if (setActive) {
          await setActive({ session: completeSignUp.createdSessionId });
        }
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setErrors({
        firstName: "",
        lastName: "",
        email: error.errors?.[0]?.message || "Invalid verification code",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <form onSubmit={onPressVerify} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Check your email
          </h3>
          <p className="text-gray-600">
            We sent a verification code to {email}
          </p>
        </div>

        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400 text-center text-2xl tracking-widest"
            placeholder="Enter code"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
            placeholder="First name"
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
            placeholder="Last name"
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-700 placeholder-gray-400"
          placeholder="Create a password"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

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

              {/* Social Login Icons */}
              <SocialLoginButtons isSignUp={isSignUp} />

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Auth Form */}
              {isSignUp ? <SignUpForm /> : <SignInForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
