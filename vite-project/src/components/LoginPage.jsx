import { useEffect, useState } from "react";
import "./LoginPage.css";

// Change this to your FastAPI address
const API_URL = "http://localhost:8000";

export default function LoginPage({
  onClose,
  onLoginSuccess,
  onCreateAccount,
  onTroubleSigningIn,
}) {
  // step 1 = email, step 2 = password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Close the login box with the Esc key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email.trim());

  // Step 1 -> Step 2
  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  // Step 2 -> call the API
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Incorrect email or password.");

      // Save the token (localStorage = stays after closing the browser)
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.access_token);

      if (onLoginSuccess) onLoginSuccess(data);
      if (onClose) onClose();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Is the backend running?"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    setPassword("");
    setShowPassword(false);
    setStep(1);
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="login-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="login-close" onClick={onClose} aria-label="Close" type="button">
          ×
        </button>

        <h2 id="login-title" className="login-title">Sign In</h2>

        {/* ---------- STEP 1: EMAIL ---------- */}
        {step === 1 && (
          <form onSubmit={handleNext} noValidate>
            <div className="login-label-row">
              <label htmlFor="login-email">Email</label>
              <span className="login-info" tabIndex={0} aria-label="We use your email to find your account">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="7.9" r="1.1" fill="currentColor" />
                  <path d="M12 11v5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="login-tooltip" role="tooltip">
                  We use your email to find your account.
                </span>
              </span>
            </div>

            <input
              id="login-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />

            {error && <p className="login-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="login-primary"
              disabled={email.trim().length === 0}
            >
              Next
            </button>

            <button
              type="button"
              className="login-trouble"
              onClick={() => onTroubleSigningIn && onTroubleSigningIn()}
            >
              Trouble Signing In?
            </button>

            <div className="login-divider" role="separator">
              <span>Or</span>
            </div>

            <button
              type="button"
              className="login-secondary"
              onClick={() => onCreateAccount && onCreateAccount()}
            >
              Create Account
            </button>
          </form>
        )}

        {/* ---------- STEP 2: PASSWORD ---------- */}
        {step === 2 && (
          <form onSubmit={handleSignIn} noValidate>
            <p className="login-email-chip">
              <span>{email}</span>
              <button type="button" onClick={goBack}>Change</button>
            </p>

            <div className="login-label-row">
              <label htmlFor="login-password">Password</label>
            </div>

            <div className="login-password-row">
              <input
                id="login-password"
                className="login-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="login-primary"
              disabled={loading || password.length === 0}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              className="login-trouble"
              onClick={() => onTroubleSigningIn && onTroubleSigningIn()}
            >
              Trouble Signing In?
            </button>
          </form>
        )}
      </div>
    </div>
  );
}