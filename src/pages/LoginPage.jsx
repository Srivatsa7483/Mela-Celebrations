import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "./LoginPage.css";

export default function LoginPage({ setCurrentPage, initialMode = "user" }) {
  const { login, register, isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [loginMode, setLoginMode] = useState(initialMode); // "user" or "admin"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Admin login form states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Register form states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Sync initialMode when it changes (e.g. navigated from /admin)
  useEffect(() => {
    setLoginMode(initialMode);
    setError("");
    setSuccess("");
  }, [initialMode]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = sessionStorage.getItem("mela_login_redirect");
      if (redirect) {
        sessionStorage.removeItem("mela_login_redirect");
        setCurrentPage(redirect);
      } else {
        setCurrentPage("dashboard");
      }
    }
  }, [isAuthenticated, setCurrentPage]);

  const switchLoginMode = (mode) => {
    setLoginMode(mode);
    setError("");
    setSuccess("");
    setLoginEmail("");
    setLoginPassword("");
    setAdminUsername("");
    setAdminPassword("");
  };

  const handleUserLoginSubmit = async (e) => {
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
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!adminUsername.trim()) {
      setError("Username is required");
      return;
    }
    if (!adminPassword) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (adminUsername === "admin" && adminPassword === "admin123") {
        sessionStorage.setItem("mela_admin_auth", "true");
        setSuccess("Admin authenticated! Redirecting...");
        setTimeout(() => setCurrentPage("admin-dashboard"), 600);
      } else {
        setError("Invalid admin credentials. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!regName.trim()) { setError("Name is required"); return; }
    if (!regEmail.includes("@")) { setError("Enter a valid email address"); return; }
    if (!/^\d{10}$/.test(regPhone)) { setError("Enter a valid 10-digit phone number"); return; }
    if (regPassword.length < 4) { setError("Password must be at least 4 characters long"); return; }
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

  const isAdminMode = loginMode === "admin";

  return (
    <div className={`login-page-container ${isAdminMode ? "admin-theme" : ""}`}>
      {/* Decorative Glow Circles */}
      <div className="login-bg-glow login-bg-glow--1"></div>
      <div className="login-bg-glow login-bg-glow--2"></div>
      <div className="login-bg-glow login-bg-glow--3"></div>

      <div className="login-card-container">

        {/* Card Frame */}
        <div className={`login-card animate-fade-in ${isAdminMode ? "admin-theme" : ""}`}>

          {/* Left Side: Brand Panel */}
          <div className="login-card__image-side">
            <div className="login-card__brand-header">
              <div className="login-card__brand-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
                  <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" fill="var(--gold)" />
                </svg>
                <h1 className="login-card__brand-logo-text">Mela</h1>
              </div>
              <p className="login-card__brand-tagline">Celebrations</p>
            </div>

            <div className="login-card__brand-body">
              <h2 className="login-card__marketing-title">
                {loginMode === "admin"
                  ? "Welcome, Admin 🛡️"
                  : "Crafting Magical Moments & Bespoke Decor"}
              </h2>
              <p className="login-card__brand-desc">
                {loginMode === "admin"
                  ? "Sign in to manage designs, orders, and the full Mela Celebrations platform."
                  : "Log in to explore our range of custom themes, calculate event pricing, and design your perfect celebration."}
              </p>
            </div>

            <div className="login-card__brand-footer">
              <ul className="login-card__features-list">
                <li className="login-card__feature-tag">#Birthday</li>
                <li className="login-card__feature-tag">#Anniversary</li>
                <li className="login-card__feature-tag">#Festival</li>
                <li className="login-card__feature-tag">#Candlelight</li>
              </ul>
            </div>
          </div>

          {/* Right Side: Form Panel */}
          <div className="login-card__form-side">
            {/* Tabs */}
            <div className="login-tabs">
              <button
                className={`login-tab-btn ${activeTab === "login" ? "active" : ""}`}
                onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
              >
                LOGIN
              </button>
              <button
                className={`login-tab-btn ${activeTab === "register" ? "active" : ""}`}
                onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); setLoginMode("user"); }}
              >
                REGISTER
              </button>
            </div>

            {/* Card Body */}
            <div className="login-card__body">

              {/* Alerts */}
              {error && (
                <div className="login-alert login-alert--error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="login-alert login-alert--success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {activeTab === "login" ? (
                <>
                  {/* ── Mode Toggle: Customer / Admin ── */}
                  <div className="login-mode-toggle">
                    <button
                      type="button"
                      className={`login-mode-btn ${loginMode === "user" ? "active" : ""}`}
                      onClick={() => switchLoginMode("user")}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Customer Login
                    </button>
                    <button
                      type="button"
                      className={`login-mode-btn admin-mode ${loginMode === "admin" ? "active" : ""}`}
                      onClick={() => switchLoginMode("admin")}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Admin Login
                    </button>
                  </div>

                  {/* Admin badge indicator */}
                  {loginMode === "admin" && (
                    <div className="admin-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Secure Admin Portal
                    </div>
                  )}

                  {/* ── CUSTOMER LOGIN FORM ── */}
                  {loginMode === "user" && (
                    <form onSubmit={handleUserLoginSubmit}>
                      <div className="login-form-group">
                        <label className="login-label">Email Address</label>
                        <div className="login-input-wrapper">
                          <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <input
                            className="login-input"
                            type="email"
                            placeholder="you@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="login-form-group" style={{ marginBottom: "26px" }}>
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                          <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          <input
                            className="login-input"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? (
                          <span>Logging in...</span>
                        ) : (
                          <>
                            <span>Log In</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* ── ADMIN LOGIN FORM ── */}
                  {loginMode === "admin" && (
                    <form onSubmit={handleAdminLoginSubmit}>
                      <div className="login-form-group">
                        <label className="login-label">Admin Username</label>
                        <div className="login-input-wrapper">
                          <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                          <input
                            className="login-input"
                            type="text"
                            placeholder="Enter admin username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                            autoComplete="username"
                          />
                        </div>
                      </div>
                      <div className="login-form-group" style={{ marginBottom: "26px" }}>
                        <label className="login-label">Admin Password</label>
                        <div className="login-input-wrapper" style={{ position: "relative" }}>
                          <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          <input
                            className="login-input"
                            type={showAdminPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            style={{ paddingRight: "48px" }}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            style={{
                              position: "absolute", right: "14px", top: "50%",
                              transform: "translateY(-50%)",
                              background: "none", border: "none",
                              color: "#94a3b8", cursor: "pointer",
                              fontSize: "1rem", padding: 0, lineHeight: 1
                            }}
                          >
                            {showAdminPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>
                      <button
                        className="login-btn login-btn--admin"
                        type="submit"
                        disabled={loading}
                        style={!loading ? {
                          background: "linear-gradient(135deg, var(--chrome-yellow) 0%, var(--chrome-yellow-dark) 100%)",
                          boxShadow: "0 4px 15px rgba(255, 179, 0, 0.3)",
                          color: "var(--admin-navy)",
                          fontWeight: "700"
                        } : {}}
                      >
                        {loading ? (
                          <span>Authenticating...</span>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span>Sign In as Admin</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                /* ── REGISTER FORM ── */
                <form onSubmit={handleRegisterSubmit}>
                  <div className="login-form-group">
                    <label className="login-label">Full Name</label>
                    <div className="login-input-wrapper">
                      <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input
                        className="login-input"
                        type="text"
                        placeholder="Aisha Patel"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="login-form-group">
                    <label className="login-label">Email Address</label>
                    <div className="login-input-wrapper">
                      <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input
                        className="login-input"
                        type="email"
                        placeholder="aisha@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="login-form-group">
                    <label className="login-label">Phone Number</label>
                    <div className="login-input-wrapper">
                      <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.93 19.79 19.79 0 0 1 1.04 3.23a2 2 0 0 1 1.77-2.11h3.09A2 2 0 0 1 7.93 2.87a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <input
                        className="login-input"
                        type="tel"
                        placeholder="8152033967"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="login-form-group" style={{ marginBottom: "26px" }}>
                    <label className="login-label">Password</label>
                    <div className="login-input-wrapper">
                      <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input
                        className="login-input"
                        type="password"
                        placeholder="Min 4 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button className="login-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <span>Registering...</span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            className="login-back-btn"
            onClick={() => setCurrentPage("home")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Return to Homepage
          </button>
        </div>

      </div>
    </div>
  );
}
