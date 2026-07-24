import { Component } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Voyage UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle size={40} className="text-accent-500" />
          <h2 className="text-xl font-semibold text-slate-800">Something went wrong</h2>
          <p className="max-w-sm text-sm text-slate-500">
            An unexpected error occurred while rendering this page. Please refresh and try again.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
