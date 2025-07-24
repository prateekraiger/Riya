"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SoftPinkBackground from "@/components/ui/Background";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    errorType: "",
    platform: "",
    browser: "",
    description: "",
    steps: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        errorType: "",
        platform: "",
        browser: "",
        description: "",
        steps: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SoftPinkBackground />
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black mb-4 pt-12">
            Technical Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your feedback is invaluable. If you've encountered a bug or have a
            suggestion, please let us know. We are committed to making Riya the
            best AI companion.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white/90 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-gray-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="mx-auto bg-gradient-to-r from-green-400 to-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center"
              >
                <Send className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mt-6">
                Thank You!
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Your report has been submitted successfully. We'll get back to
                you soon.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8 p-8 sm:p-12 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Jane Doe"
                    required
                    className="w-full bg-gray-50/50 border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-lg p-4"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., jane.doe@example.com"
                    required
                    className="w-full bg-gray-50/50 border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-lg p-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    htmlFor="errorType"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Type of Issue
                  </label>
                  <select
                    id="errorType"
                    name="errorType"
                    value={formData.errorType}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-gray-50/50 rounded-md px-3 py-4 text-lg focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="">Select an issue type</option>
                    <option value="bug">Bug or Error</option>
                    <option value="performance">Performance Issue</option>
                    <option value="ui-ux">UI/UX Problem</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="security">Security Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="platform"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Platform
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 bg-gray-50/50 rounded-md px-3 py-4 text-lg focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="">Select a platform</option>
                    <option value="web">Web Browser</option>
                    <option value="mobile-web">Mobile Browser</option>
                    <option value="android">Android App (if applicable)</option>
                    <option value="ios">iOS App (if applicable)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="browser"
                  className="text-lg font-semibold text-gray-700"
                >
                  Browser & Version (if applicable)
                </label>
                <Input
                  type="text"
                  id="browser"
                  name="browser"
                  value={formData.browser}
                  onChange={handleChange}
                  placeholder="e.g., Chrome 120.0.6099.130"
                  className="w-full bg-gray-50/50 border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-lg p-4"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-lg font-semibold text-gray-700"
                >
                  Detailed Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe the issue in detail..."
                  required
                  className="w-full h-36 bg-gray-50/50 border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-lg p-4"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="steps"
                  className="text-lg font-semibold text-gray-700"
                >
                  Steps to Reproduce
                </label>
                <Textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="1. Go to '...' page&#10;2. Click on the '...' button&#10;3. See the error"
                  required
                  className="w-full h-36 bg-gray-50/50 border-gray-300 focus:border-pink-500 focus:ring-pink-500 text-lg p-4"
                />
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-pink-500 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          ease: "linear",
                          repeat: Infinity,
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 mr-2" />
                      Submit Report
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
