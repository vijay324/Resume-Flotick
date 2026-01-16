/**
 * @fileoverview Unit tests for hooks/use-history.ts
 * Tests undo/redo history management hook
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useHistory } from "@/hooks/use-history";

// Helper to advance timers past debounce
const advancePastDebounce = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });
};

describe("useHistory", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with the provided initial state", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      expect(result.current.currentState).toEqual({ count: 0 });
    });

    it("should deep clone initial state", () => {
      const initialState = { nested: { value: 1 } };
      const { result } = renderHook(() => useHistory(initialState));

      // Modify original should not affect hook state
      initialState.nested.value = 999;

      expect(result.current.currentState.nested.value).toBe(1);
    });

    it("should start with canUndo as false", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      expect(result.current.canUndo).toBe(false);
    });

    it("should start with canRedo as false", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      expect(result.current.canRedo).toBe(false);
    });

    it("should start with historyLength as 0", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      expect(result.current.historyLength).toBe(0);
    });
  });

  describe("setState", () => {
    it("should update current state immediately", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      expect(result.current.currentState).toEqual({ count: 1 });
    });

    it("should support functional updates", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState((prev) => ({ count: prev.count + 1 }));
      });

      expect(result.current.currentState).toEqual({ count: 1 });
    });

    it("should add to history after debounce", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      // Before debounce, history should be empty
      expect(result.current.canUndo).toBe(false);

      await advancePastDebounce();

      // After debounce, should be able to undo
      expect(result.current.canUndo).toBe(true);
    });

    it("should group rapid changes within debounce window", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
        result.current.setState({ count: 2 });
        result.current.setState({ count: 3 });
      });

      await advancePastDebounce();

      // Should only have one history entry (initial state)
      expect(result.current.historyLength).toBe(1);
      expect(result.current.currentState).toEqual({ count: 3 });
    });
  });

  describe("undo", () => {
    it("should restore previous state", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await waitFor(() => {
        expect(result.current.canUndo).toBe(true);
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.currentState).toEqual({ count: 0 });
    });

    it("should enable redo after undo", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      expect(result.current.canRedo).toBe(false);

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);
    });

    it("should do nothing when canUndo is false", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.undo();
      });

      expect(result.current.currentState).toEqual({ count: 0 });
    });

    it("should cancel pending debounced commits", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      // Set state to create history
      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      // Make a change
      act(() => {
        result.current.setState({ count: 2 });
      });

      // Immediately undo before debounce completes
      act(() => {
        result.current.undo();
      });

      // Should go back to initial state
      expect(result.current.currentState).toEqual({ count: 0 });
    });
  });

  describe("redo", () => {
    it("should restore undone state", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      act(() => {
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.currentState).toEqual({ count: 1 });
    });

    it("should do nothing when canRedo is false", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.redo();
      });

      expect(result.current.currentState).toEqual({ count: 0 });
    });

    it("should clear redo stack on new state", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);

      // Make a new change
      act(() => {
        result.current.setState({ count: 5 });
      });

      await advancePastDebounce();

      // Redo stack should be cleared
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all history", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      act(() => {
        result.current.setState({ count: 2 });
      });

      await advancePastDebounce();

      expect(result.current.historyLength).toBeGreaterThan(0);

      act(() => {
        result.current.clear();
      });

      expect(result.current.historyLength).toBe(0);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it("should keep current state after clear", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 5 });
      });

      await advancePastDebounce();

      act(() => {
        result.current.clear();
      });

      expect(result.current.currentState).toEqual({ count: 5 });
    });
  });

  describe("replaceState", () => {
    it("should replace current state without history", () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.replaceState({ count: 10 });
      });

      expect(result.current.currentState).toEqual({ count: 10 });
      expect(result.current.canUndo).toBe(false);
    });

    it("should clear history when replacing state", async () => {
      const { result } = renderHook(() => useHistory({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      await advancePastDebounce();

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.replaceState({ count: 100 });
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.currentState).toEqual({ count: 100 });
    });
  });

  describe("options", () => {
    it("should respect maxHistory option", async () => {
      const { result } = renderHook(() =>
        useHistory({ count: 0 }, { maxHistory: 3 })
      );

      // Add more than maxHistory entries
      for (let i = 1; i <= 5; i++) {
        act(() => {
          result.current.setState({ count: i });
        });
        await advancePastDebounce();
      }

      // History should be limited to maxHistory
      // (past entries only, doesn't count current state)
      expect(result.current.historyLength).toBeLessThanOrEqual(3);
    });

    it("should respect custom debounceMs option", async () => {
      const { result } = renderHook(() =>
        useHistory({ count: 0 }, { debounceMs: 100 })
      );

      act(() => {
        result.current.setState({ count: 1 });
      });

      // At 50ms, should not be committed yet
      await act(async () => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.canUndo).toBe(false);

      // At 150ms, should be committed
      await act(async () => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.canUndo).toBe(true);
    });
  });

  describe("complex state", () => {
    it("should handle nested objects", async () => {
      const { result } = renderHook(() =>
        useHistory({
          user: { name: "John", age: 30 },
          settings: { theme: "dark" },
        })
      );

      act(() => {
        result.current.setState({
          user: { name: "Jane", age: 25 },
          settings: { theme: "light" },
        });
      });

      await advancePastDebounce();

      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.currentState).toEqual({
          user: { name: "John", age: 30 },
          settings: { theme: "dark" },
        });
      });
    });

    it("should handle arrays", async () => {
      const { result } = renderHook(() => useHistory({ items: [1, 2, 3] }));

      act(() => {
        result.current.setState({ items: [1, 2, 3, 4] });
      });

      await advancePastDebounce();

      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.currentState).toEqual({ items: [1, 2, 3] });
      });
    });
  });
});
