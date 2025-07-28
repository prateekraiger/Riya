/**
 * Security configuration and constants
 */

export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 100,
    API_WINDOW_MS: 60000,
    API_MAX_REQUESTS: 50,
  },

  // Input validation
  INPUT_LIMITS: {
    MAX_MESSAGE_LENGTH: 2000,
    MAX_NAME_LENGTH: 100,
    MAX_BIO_LENGTH: 500,
    MAX_INTERESTS: 10,
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:"],
    CONNECT_SRC: [
      "'self'",
      "https://api.gemini.google.com",
      "https://*.supabase.co",
      "wss://*.supabase.co",
      "https://texttospeech.googleapis.com",
    ],
    FONT_SRC: ["'self'", "data:"],
    MEDIA_SRC: ["'self'", "blob:"],
  },

  // Allowed domains for external resources
  ALLOWED_DOMAINS: [
    "api.gemini.google.com",
    "texttospeech.googleapis.com",
    "*.supabase.co",
  ],

  // Security headers
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  },
} as const;

// Environment validation
export function validateSecurityEnvironment(): void {
  const requiredVars = [
    "VITE_GEMINI_API_KEY",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_STACK_PROJECT_ID",
    "VITE_STACK_PUBLISHABLE_CLIENT_KEY",
  ];

  const missingVars = requiredVars.filter(
    (varName) =>
      !import.meta.env[varName] ||
      import.meta.env[varName].includes("your_") ||
      import.meta.env[varName].includes("YOUR_")
  );

  if (missingVars.length > 0) {
    console.error(
      "❌ Security Error: Missing or invalid environment variables:",
      missingVars
    );
    throw new Error("Invalid environment configuration detected");
  }
}
