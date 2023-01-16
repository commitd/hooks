import { useState } from 'react'

/**
 * useClipboard hook can be used to copy text to the clipboard and report.
 *
 * Returns a function to set the copied text, a reset function, a boolean to report successful copy and an error state.
 *
 * @param {number | undefined} timeout set to change the default timeout for notification of copy
 */
export function useClipboard(timeout = 2000): {
  copy: (valueToCopy: string) => Promise<void>
  reset: () => void
  error: Error | undefined
  copied: boolean
} {
  const [error, setError] = useState<Error | undefined>()
  const [copied, setCopied] = useState(false)
  const [copyTimeout, setCopyTimeout] = useState<
    ReturnType<typeof setTimeout> | undefined
  >()

  const handleCopyResult = (value: boolean) => {
    copyTimeout && clearTimeout(copyTimeout)
    const newTimeout: ReturnType<typeof setTimeout> = setTimeout(
      () => setCopied(false),
      timeout
    )
    setCopyTimeout(newTimeout)
    setCopied(value)
  }

  const copy = async (valueToCopy: string) => {
    if ('clipboard' in navigator) {
      return navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => {
          if (err instanceof Error) setError(err)
        })
    } else {
      setError(new Error('useClipboard: clipboard is not supported'))
    }
  }

  const reset = () => {
    setCopied(false)
    setError(undefined)
    copyTimeout && clearTimeout(copyTimeout)
  }

  return { copy, reset, error, copied }
}
