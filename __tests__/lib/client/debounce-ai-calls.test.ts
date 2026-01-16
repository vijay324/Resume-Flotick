/**
 * @fileoverview Unit tests for lib/client/debounce-ai-calls.ts
 * Tests AI call debouncing and queue management
 */

import {
  debouncedAICall,
  cancelPendingCalls,
  getPendingCallCount,
  isRateLimited,
  subscribeToRateLimitStatus,
} from "@/lib/client/debounce-ai-calls";

describe("debouncedAICall", () => {
  beforeEach(() => {
    cancelPendingCalls();
  });

  afterEach(() => {
    cancelPendingCalls();
  });

  describe("basic functionality", () => {
    it("should execute the provided function", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");

      const result = await debouncedAICall(mockFn);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe("success");
    });

    it("should return the result of the function", async () => {
      const result = await debouncedAICall(() =>
        Promise.resolve({ data: "test" })
      );

      expect(result).toEqual({ data: "test" });
    });

    it("should propagate errors", async () => {
      await expect(
        debouncedAICall(() => Promise.reject(new Error("Test error")))
      ).rejects.toThrow("Test error");
    });
  });
});

describe("cancelPendingCalls", () => {
  beforeEach(() => {
    cancelPendingCalls();
  });

  it("should clear the queue", async () => {
    cancelPendingCalls();
    expect(getPendingCallCount()).toBe(0);
  });
});

describe("getPendingCallCount", () => {
  beforeEach(() => {
    cancelPendingCalls();
  });

  it("should return 0 when no calls are pending", () => {
    expect(getPendingCallCount()).toBe(0);
  });
});

describe("isRateLimited", () => {
  beforeEach(() => {
    cancelPendingCalls();
  });

  it("should return false when queue is empty", () => {
    expect(isRateLimited()).toBe(false);
  });
});

describe("subscribeToRateLimitStatus", () => {
  beforeEach(() => {
    cancelPendingCalls();
  });

  it("should return an unsubscribe function", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToRateLimitStatus(listener);

    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });

  it("should not throw when unsubscribing", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToRateLimitStatus(listener);

    expect(() => unsubscribe()).not.toThrow();
  });
});
