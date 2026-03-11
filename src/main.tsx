import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@/lib/gsap";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480 }}>
          <h1 style={{ color: "#c00", marginBottom: 8 }}>Something went wrong</h1>
          <pre style={{ background: "#f5f5f5", padding: 12, overflow: "auto", fontSize: 12 }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
