let textArea

/**
 * Decode HTML entities in a string. Falls back to common entities
 * when running outside the browser (e.g., during SSR/build).
 */
export function decodeHtmlEntities(value) {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return value
  if (value === '') return ''

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (!textArea) {
      textArea = document.createElement('textarea')
    }
    textArea.innerHTML = value
    return textArea.value
  }

  // Basic fallback for environments without DOM access
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, '\'')
    .replace(/&#039;/g, '\'')
    .replace(/&#8217;/g, '\'')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
}

/**
 * Normalize user-provided text before submission to avoid
 * persisting encoded characters.
 */
export function normalizeTextInput(value) {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'string') return value
  return decodeHtmlEntities(value)
}
