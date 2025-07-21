"use client"; // Required for Next.js App Router to make this a client component

import { useState } from "react";
import { motion } from "framer-motion"; // Import motion directly
import { Bug, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input"; // Import Input from your components folder
import { Textarea } from "@/components/ui/textarea"; // Import Textarea from your components folder
import { cn } from "@/lib/utils"; // Import cn utility

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send to an API)
    console.log("Form submitted:", formData);
    // For a real application, replace alert with a proper UI message/toast
    alert("Thank you for your report! We will look into it shortly.");
    setFormData({
      name: "",
      email: "",
      errorType: "",
      platform: "",
      browser: "",
      description: "",
      steps: "",
    });
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
    <div className="min-h-screen pt-24 pb-8 w-full relative bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col items-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-dotted-pattern" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 px-4"
      >
        <div className="inline-block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pink-accent text-white px-4 py-2 rounded-full text-sm font-medium mb-4 flex items-center gap-2 shadow-md"
          >
            <Bug className="w-5 h-5" />
            Report an Issue
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:text-5xl">
          Technical Support
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Found a bug or experiencing issues? Help us improve by reporting the
          problem. Your feedback is valuable to us.
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-pink-200 p-8 shadow-xl max-w-4xl mx-auto w-full bg-white/80 backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-dark"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="errorType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type of Issue
              </label>
              <select
                id="errorType"
                name="errorType"
                value={formData.errorType}
                onChange={handleChange}
                required
                className="w-full border border-input bg-background text-gray-900 rounded-md px-3 py-2 text-sm focus:border-pink-dark transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select issue type</option>
                <option value="bug">Bug/Error</option>
                <option value="performance">Performance Issue</option>
                <option value="ui">UI/UX Problem</option>
                <option value="security">Security Concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full border border-input bg-background text-gray-900 rounded-md px-3 py-2 text-sm focus:border-pink-dark transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select platform</option>
                <option value="web">Web Browser</option>
                <option value="mobile">Mobile Browser</option>
                <option value="android">Android App</option>
                <option value="ios">iOS App</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="browser"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="w-full border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-dark"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Issue Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe the issue you're experiencing..."
              required
              className="w-full h-32 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-dark resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Steps to Reproduce
            </label>
            <Textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="1. Go to...\n2. Click on...\n3. Observe..."
              required
              className="w-full h-32 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-pink-dark resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-pink-dark text-white font-medium hover:bg-pink-dark/90 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <AlertTriangle className="w-5 h-5" />
              Submit Report
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
