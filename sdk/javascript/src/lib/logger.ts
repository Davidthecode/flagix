/**
 * 'info' is for detailed debugging information
 * 'warn' is for non-critical issues
 * 'error' is for critical failures
 * 'none' suppresses all output.
 */
export type LogLevel = "none" | "error" | "warn" | "info";

let currentLogLevel: LogLevel = "none";

const LOG_LEVELS: Record<LogLevel, number> = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
};

export function setLogLevel(level: LogLevel = "none"): void {
  currentLogLevel = level;
}

export function log(
  level: "error" | "warn" | "info",
  message: string,
  ...args: unknown[]
): void {
  const currentLevel = LOG_LEVELS[currentLogLevel];
  const requiredLevel = LOG_LEVELS[level];

  if (currentLevel >= requiredLevel) {
    const prefixedMessage = `[Flagix SDK] ${message}`;

    if (level === "error") {
      console.error(prefixedMessage, ...args);
    } else if (level === "warn") {
      console.warn(prefixedMessage, ...args);
    } else {
      console.info(prefixedMessage, ...args);
    }
  }
}
