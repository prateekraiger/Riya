/**
 * Production-safe logging utility
 * Prevents sensitive information from being logged in production
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  private sanitizeData(data: any): any {
    if (!data) return data;

    // Convert to string and remove sensitive patterns
    const str = JSON.stringify(data);
    const sanitized = str
      .replace(
        /("api_key"|"apiKey"|"token"|"password"|"secret")[^,}]*/gi,
        '"$1":"[REDACTED]"'
      )
      .replace(/AIza[0-9A-Za-z_-]{35}/g, "[REDACTED_API_KEY]")
      .replace(/sk-[a-zA-Z0-9]{48}/g, "[REDACTED_SECRET_KEY]")
      .replace(
        /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
        "[REDACTED_JWT]"
      );

    try {
      return JSON.parse(sanitized);
    } catch {
      return sanitized;
    }
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const sanitizedData = this.sanitizeData(data);

    const entry: LogEntry = {
      level,
      message,
      data: sanitizedData,
      timestamp,
    };

    // Add to history (keep only recent entries)
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // Only log to console in development
    if (this.isDevelopment) {
      const logMethod = console[level] || console.log;
      if (data) {
        logMethod(`[${timestamp}] ${message}`, sanitizedData);
      } else {
        logMethod(`[${timestamp}] ${message}`);
      }
    }
  }

  debug(message: string, data?: any): void {
    this.log("debug", message, data);
  }

  info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  error(message: string, data?: any): void {
    this.log("error", message, data);

    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment) {
      // TODO: Send to error monitoring service (e.g., Sentry, LogRocket)
      // this.sendToMonitoringService(message, data);
    }
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

export const logger = new Logger();

// Convenience exports
export const { debug, info, warn, error } = logger;
