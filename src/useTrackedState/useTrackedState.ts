import { useCallback, useState } from 'react'

interface TrackedState<T> {
  current: T
  undoStack: T[]
  redoStack: T[]
}

function isInitializer<T>(
  candidate: T | (() => T) | undefined
): candidate is () => T {
  return typeof candidate === 'function'
}

function isModifier<T>(
  candidate: T | ((current: T) => T) | undefined
): candidate is (current: T) => T {
  return typeof candidate === 'function'
}

/**
 * useTrackedState hook provides the standard `[value, setValue]` array with an additional object providing
 * `undo` and `redo` functions with convenience `boolean`s for `canUndo` and `canRedo`.
 */
export function useTrackedState<T = undefined>(): [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
  {
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
  }
]

/**
 * useTrackedState hook provides the standard `[value, setValue]` array with an additional object providing
 * `undo` and `redo` functions with convenience `boolean`s for `canUndo` and `canRedo`.
 *
 * @param initialState starting state or function to provide starting state
 */
export function useTrackedState<T>(initialState: T | (() => T)): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  {
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
  }
]

/**
 * useTrackedState hook provides the standard `[value, setValue]` array with an additional object providing
 * `undo` and `redo` functions with convenience `boolean`s for `canUndo` and `canRedo`.
 *
 * @param initialState (optional) starting state or function to provide starting state
 */
export function useTrackedState<T>(initialState?: T | (() => T)): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  {
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
  }
] {
  const [tracked, setTracked] = useState<TrackedState<T | undefined>>({
    current: isInitializer(initialState) ? initialState() : initialState,
    undoStack: [],
    redoStack: [],
  })

  const undo = useCallback((): void => {
    setTracked((currentTracked) => {
      if (currentTracked.undoStack.length === 0) {
        return currentTracked
      }
      const { current, undoStack, redoStack } = currentTracked
      return {
        current: undoStack[undoStack.length - 1],
        undoStack: undoStack.slice(0, undoStack.length - 1),
        redoStack: [...redoStack, current],
      }
    })
  }, [])

  const redo = useCallback((): void => {
    setTracked((currentTracked) => {
      if (currentTracked.redoStack.length === 0) {
        return currentTracked
      }
      const { current, undoStack, redoStack } = currentTracked
      return {
        current: redoStack[redoStack.length - 1],
        undoStack: [...undoStack, current],
        redoStack: redoStack.slice(0, redoStack.length - 1),
      }
    })
  }, [])

  const setValue = useCallback((setState: React.SetStateAction<T>): void => {
    setTracked(({ current, undoStack }) => {
      return {
        current: isModifier(setState) ? setState(current as T) : setState,
        undoStack: [...undoStack, current],
        redoStack: [],
      }
    })
    // Incorrectly suggests adding T
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [
    tracked.current as T,
    setValue,
    {
      undo,
      redo,
      canUndo: tracked.undoStack.length > 0,
      canRedo: tracked.redoStack.length > 0,
    },
  ]
}
