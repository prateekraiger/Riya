/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  safeString: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
};

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  let sanitized = input
    // Remove null bytes
    .replace(/\0/g, "")
    // Encode HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      throw new Error("Input contains potentially dangerous content");
    }
  }

  return sanitized;
}

/**
 * Validate input against common patterns
 */
export function validateInput(
  input: string,
  type: keyof typeof VALIDATION_PATTERNS
): boolean {
  if (typeof input !== "string") {
    return false;
  }

  const pattern = VALIDATION_PATTERNS[type];
  return pattern ? pattern.test(input) : false;
}

/**
 * Rate limiting utility (simple in-memory implementation)
 */
class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];

    // Filter out old requests
    const recentRequests = requests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure random string generation
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Content Security Policy helper
 */
export function getCSPNonce(): string {
  return generateSecureToken(16);
}

/**
 * Validate environment variables are not exposed
 */
export function validateEnvironmentSecurity(): void {
  const sensitiveKeys = [
    "VITE_GEMINI_API_KEY",
    "VITE_GOOGLE_TTS_API_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_STACK_SECRET_SERVER_KEY",
  ];

  for (const key of sensitiveKeys) {
    const value = import.meta.env[key];
    if (
      value &&
      (value.includes("your_") ||
        value.includes("YOUR_") ||
        value === "your_gemini_api_key" ||
        value === "your_google_tts_api_key_here")
    ) {
      console.warn(
        `⚠️ Environment variable ${key} appears to contain placeholder value`
      );
    }
  }
}

/**
 * Secure headers for API requests
 */
export function getSecureHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}
