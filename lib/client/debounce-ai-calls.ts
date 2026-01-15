/**
 * Client-Side AI Call Debouncing
 * Prevents rapid API calls and provides rate limiting feedback
 */

interface QueuedCall {
  id: string;
  execute: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

const MINIMUM_CALL_INTERVAL_MS = 300;
const MAX_QUEUE_SIZE = 10;

let lastCallTimestamp = 0;
let callQueue: QueuedCall[] = [];
let isProcessing = false;

/**
 * Rate limit listeners for UI feedback
 */
const rateLimitListeners: Set<(isRateLimited: boolean) => void> = new Set();

export function subscribeToRateLimitStatus(
  listener: (isRateLimited: boolean) => void
): () => void {
  rateLimitListeners.add(listener);
  return () => rateLimitListeners.delete(listener);
}

function notifyRateLimitStatus(isRateLimited: boolean): void {
  for (const listener of rateLimitListeners) {
    listener(isRateLimited);
  }
}

/**
 * Process the call queue
 */
async function processQueue(): Promise<void> {
  if (isProcessing || callQueue.length === 0) return;

  isProcessing = true;

  while (callQueue.length > 0) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimestamp;

    if (timeSinceLastCall < MINIMUM_CALL_INTERVAL_MS) {
      // Wait before next call
      notifyRateLimitStatus(true);
      await new Promise((resolve) =>
        setTimeout(resolve, MINIMUM_CALL_INTERVAL_MS - timeSinceLastCall)
      );
    }

    notifyRateLimitStatus(false);
    const call = callQueue.shift();
    if (!call) continue;

    try {
      lastCallTimestamp = Date.now();
      const result = await call.execute();
      call.resolve(result);
    } catch (error) {
      call.reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  isProcessing = false;
}

/**
 * Debounce an AI call
 * Returns a promise that resolves when the call completes
 */
export function debouncedAICall<T>(
  callFn: () => Promise<T>,
  callId?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Check queue size
    if (callQueue.length >= MAX_QUEUE_SIZE) {
      reject(new Error("Too many pending requests. Please wait."));
      return;
    }

    // Remove duplicate calls if callId provided
    if (callId) {
      callQueue = callQueue.filter((c) => c.id !== callId);
    }

    callQueue.push({
      id: callId || crypto.randomUUID(),
      execute: callFn as () => Promise<unknown>,
      resolve: resolve as (value: unknown) => void,
      reject,
      timestamp: Date.now(),
    });

    processQueue();
  });
}

/**
 * Cancel all pending calls
 */
export function cancelPendingCalls(): void {
  for (const call of callQueue) {
    call.reject(new Error("Request cancelled"));
  }
  callQueue = [];
}

/**
 * Get pending call count
 */
export function getPendingCallCount(): number {
  return callQueue.length;
}

/**
 * Check if currently rate limited
 */
export function isRateLimited(): boolean {
  const timeSinceLastCall = Date.now() - lastCallTimestamp;
  return timeSinceLastCall < MINIMUM_CALL_INTERVAL_MS && callQueue.length > 0;
}
