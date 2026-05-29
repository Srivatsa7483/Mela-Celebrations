import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f7f4ef",
          color: "#0d1b2a",
          fontFamily: "'DM Sans', sans-serif",
          textAlign: "center"
        }}>
          <h1 style={{ color: "#c9a84c", fontSize: "2.5rem", marginBottom: "16px" }}>Something went wrong 😢</h1>
          <p style={{ fontSize: "1.1rem", marginBottom: "24px", maxWidth: "600px" }}>
            The application encountered a client-side error. This is often caused by corrupted cached data in your browser.
          </p>
          <pre style={{
            backgroundColor: "rgba(13, 27, 42, 0.05)",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            maxWidth: "90%",
            overflowX: "auto",
            marginBottom: "24px",
            color: "#e63946"
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: "#0d1b2a",
              color: "white",
              border: "none",
              padding: "14px 28px",
              fontSize: "1rem",
              borderRadius: "30px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(13, 27, 42, 0.2)",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c9a84c"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0d1b2a"}
          >
            Clear App Cache & Reload 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
