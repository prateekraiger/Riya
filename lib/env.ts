/**
 * Environment variables utility
 *
 * This file provides a centralized way to access environment variables
 * with proper type checking and validation.
 */

// Function to get required environment variables with type safety
export function getRequiredEnvVar(name: string): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// API Keys and configuration
export const ENV = {
  // Gemini AI
  GEMINI_API_KEY: getRequiredEnvVar("VITE_GEMINI_API_KEY"),

  // Supabase
  SUPABASE_URL: getRequiredEnvVar("VITE_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getRequiredEnvVar("VITE_SUPABASE_ANON_KEY"),

  // Stack Authentication
  STACK_PROJECT_ID: getRequiredEnvVar("VITE_STACK_PROJECT_ID"),
  STACK_PUBLISHABLE_CLIENT_KEY: getRequiredEnvVar(
    "VITE_STACK_PUBLISHABLE_CLIENT_KEY"
  ),

  // Google TTS
  GOOGLE_TTS_API_KEY: getRequiredEnvVar("VITE_GOOGLE_TTS_API_KEY"),

  // Environment mode
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
