import React from 'react'

// Error boundary component to catch React errors and prevent full app crashes
// Wrap sections of the app that might fail independently (e.g. admin modules)
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service in production
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-700 mb-4">
            An error occurred while rendering this component. Please refresh the page.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-red-600 overflow-auto p-2 bg-red-100 rounded">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
