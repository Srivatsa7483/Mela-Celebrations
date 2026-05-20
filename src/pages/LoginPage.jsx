import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function LoginPage({ setCurrentPage }) {
  const { login, register, isAuthenticated, error: authError } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage("dashboard");
    }
  }, [isAuthenticated, setCurrentPage]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!loginEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!loginPassword) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setSuccess("Success! Logging in...");
      setTimeout(() => {
        setCurrentPage("dashboard");
      }, 800);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!regName.trim()) {
      setError("Name is required");
      return;
    }
    if (!regEmail.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    if (!/^\d{10}$/.test(regPhone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    setLoading(true);
    try {
      await register(regName, regEmail, regPhone, regPassword);
      setSuccess("Account created successfully! Switching to Login...");
      setTimeout(() => {
        setLoginEmail(regEmail);
        setActiveTab("login");
        setError("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{
      padding: "80px 0",
      backgroundColor: "#f7f4ef",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Jost', sans-serif"
    }}>
      <div className="container" style={{ width: "100%", maxWidth: "440px" }}>
        
        {/* Card Frame */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "var(--shadow-card)",
          border: "1px solid #e2ddd6",
          overflow: "hidden"
        }}>
          {/* Logo Heading */}
          <div style={{
            backgroundColor: "var(--navy)",
            padding: "30px 20px 20px 20px",
            color: "white",
            textAlign: "center"
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--gold)", margin: 0, fontSize: "1.8rem" }}>
              Mela Celebrations
            </h2>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginTop: "4px", letterSpacing: "0.05em" }}>
              YOUR DREAM CELEBRATION IS ONE LOGIN AWAY
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            <button
              onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                background: activeTab === "login" ? "white" : "#f2f0ec",
                color: activeTab === "login" ? "var(--navy)" : "var(--text-muted)",
                fontWeight: "600",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                borderBottom: activeTab === "login" ? "3px solid var(--gold)" : "none"
              }}
            >
              LOGIN
            </button>
            <button
              onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); }}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                background: activeTab === "register" ? "white" : "#f2f0ec",
                color: activeTab === "register" ? "var(--navy)" : "var(--text-muted)",
                fontWeight: "600",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                borderBottom: activeTab === "register" ? "3px solid var(--gold)" : "none"
              }}
            >
              REGISTER
            </button>
          </div>

          {/* Card Body */}
          <div style={{ padding: "30px" }}>
            {error && (
              <div style={{
                backgroundColor: "rgba(230, 57, 70, 0.1)",
                color: "#e63946",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                marginBottom: "20px",
                border: "1px solid rgba(230, 57, 70, 0.2)"
              }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{
                backgroundColor: "rgba(37, 211, 102, 0.1)",
                color: "#25D366",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                marginBottom: "20px",
                border: "1px solid rgba(37, 211, 102, 0.2)"
              }}>
                ✓ {success}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: "var(--navy)",
                    color: "white",
                    border: "none",
                    padding: "14px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 10px rgba(13, 27, 42, 0.15)"
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--gold)"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--navy)"; }}
                >
                  {loading ? "Logging in..." : "LOG IN"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Aisha Patel"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="aisha@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--navy)", marginBottom: "6px" }}>Password</label>
                  <input
                    type="password"
                    placeholder="Min 4 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: "var(--navy)",
                    color: "white",
                    border: "none",
                    padding: "14px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 10px rgba(13, 27, 42, 0.15)"
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--gold)"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--navy)"; }}
                >
                  {loading ? "Registering..." : "CREATE ACCOUNT"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setCurrentPage("home")}
            style={{
              background: "none",
              border: "none",
              color: "var(--navy)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
              letterSpacing: "0.05em"
            }}
          >
            ← RETURN TO HOMEPAGE
          </button>
        </div>

      </div>
    </div>
  );
}
