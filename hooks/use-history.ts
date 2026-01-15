"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Configuration options for the history hook
 */
interface UseHistoryOptions {
  /** Maximum number of history entries to keep (default: 50) */
  maxHistory?: number;
  /** Debounce time in ms for grouping rapid changes (default: 300) */
  debounceMs?: number;
}

/**
 * Return type for the useHistory hook
 */
interface UseHistoryReturn<T> {
  /** Current state value */
  currentState: T;
  /** Set new state (pushes to history after debounce) */
  setState: (newState: T | ((prev: T) => T)) => void;
  /** Undo to previous state */
  undo: () => void;
  /** Redo to next state */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Current history stack length */
  historyLength: number;
  /** Clear all history (keeps current state) */
  clear: () => void;
  /** Replace current state without affecting history */
  replaceState: (newState: T) => void;
}

/**
 * Deep clone utility using JSON serialization
 * Safe for ResumeData structure (no functions, circular refs, or special types)
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Production-grade history management hook
 * 
 * Features:
 * - Undo/redo with configurable stack limits
 * - Debounced state capture for grouping rapid edits
 * - Memory-efficient with automatic pruning
 * - Type-safe with generics
 * 
 * @param initialState - The initial state value
 * @param options - Configuration options
 * @returns History management interface
 */
export function useHistory<T>(
  initialState: T,
  options: UseHistoryOptions = {}
): UseHistoryReturn<T> {
  const { maxHistory = 50, debounceMs = 300 } = options;

  // Current state (what the user sees)
  const [currentState, setCurrentState] = useState<T>(() => deepClone(initialState));
  
  // History stacks
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  // Refs for debouncing
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStateRef = useRef<T | null>(null);
  const lastCommittedStateRef = useRef<T>(deepClone(initialState));

  /**
   * Commit the pending state to history
   */
  const commitToHistory = useCallback((newState: T) => {
    const stateSnapshot = deepClone(newState);
    
    setPast((prevPast) => {
      // Add current state to past before moving to new state
      const newPast = [...prevPast, deepClone(lastCommittedStateRef.current)];
      
      // Enforce max history limit
      if (newPast.length > maxHistory) {
        return newPast.slice(-maxHistory);
      }
      return newPast;
    });

    // Clear future on new action (standard undo/redo behavior)
    setFuture([]);
    
    // Update last committed state
    lastCommittedStateRef.current = stateSnapshot;
  }, [maxHistory]);

  /**
   * Set state with debounced history capture
   * Groups rapid changes (e.g., typing) into single history entries
   */
  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setCurrentState((prevState) => {
      const resolvedState = typeof newState === "function" 
        ? (newState as (prev: T) => T)(prevState)
        : newState;
      
      const stateSnapshot = deepClone(resolvedState);
      pendingStateRef.current = stateSnapshot;

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        if (pendingStateRef.current !== null) {
          commitToHistory(pendingStateRef.current);
          pendingStateRef.current = null;
        }
      }, debounceMs);

      return stateSnapshot;
    });
  }, [commitToHistory, debounceMs]);

  /**
   * Undo to previous state
   */
  const undo = useCallback(() => {
    // Cancel any pending debounced commit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;

      const newPast = [...prevPast];
      const previousState = newPast.pop()!;

      // Move current state to future
      setFuture((prevFuture) => [deepClone(lastCommittedStateRef.current), ...prevFuture]);

      // Restore previous state
      const restoredState = deepClone(previousState);
      setCurrentState(restoredState);
      lastCommittedStateRef.current = restoredState;
      pendingStateRef.current = null;

      return newPast;
    });
  }, []);

  /**
   * Redo to next state
   */
  const redo = useCallback(() => {
    // Cancel any pending debounced commit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const newFuture = [...prevFuture];
      const nextState = newFuture.shift()!;

      // Move current state to past
      setPast((prevPast) => [...prevPast, deepClone(lastCommittedStateRef.current)]);

      // Restore next state
      const restoredState = deepClone(nextState);
      setCurrentState(restoredState);
      lastCommittedStateRef.current = restoredState;
      pendingStateRef.current = null;

      return newFuture;
    });
  }, []);

  /**
   * Clear all history (keeps current state)
   */
  const clear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setPast([]);
    setFuture([]);
    pendingStateRef.current = null;
    lastCommittedStateRef.current = deepClone(currentState);
  }, [currentState]);

  /**
   * Replace current state without affecting history
   * Useful for loading saved data
   */
  const replaceState = useCallback((newState: T) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const stateSnapshot = deepClone(newState);
    setCurrentState(stateSnapshot);
    lastCommittedStateRef.current = stateSnapshot;
    pendingStateRef.current = null;
    // Clear history when replacing state (e.g., loading from storage)
    setPast([]);
    setFuture([]);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    currentState,
    setState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyLength: past.length + future.length,
    clear,
    replaceState,
  };
}
