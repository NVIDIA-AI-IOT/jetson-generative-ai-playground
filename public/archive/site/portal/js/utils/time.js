/*
 * Timers and date/clock functions (TODO)
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

