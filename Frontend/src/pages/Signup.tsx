import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { signup } from "../auth/authService";
import "../styles/auth.css";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = await signup({ username, email, password });
      loginUser(data.token);
      navigate("/");
    } catch (err) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Signup Form */}
      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2 className="auth-title">Join OverDO</h2>
            <p className="auth-subtitle">
              Create an account and meet your new productivity companion
            </p>
          </div>

          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
                Username
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-icons-round"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontSize: 20,
                  }}
                >
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="input-field"
                  placeholder="coolproductivitymaster"
                  style={{ paddingLeft: 40 }}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-icons-round"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontSize: 20,
                  }}
                >
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="you@example.com"
                  style={{ paddingLeft: 40 }}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-icons-round"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontSize: 20,
                  }}
                >
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input-field"
                  placeholder="........"
                  style={{ paddingLeft: 40 }}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="material-icons-round"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "⌣" : "👁"}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-icons-round"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontSize: 20,
                  }}
                >
                </span>
                <input
                  type="password"
                  id="confirm-password"
                  className="input-field"
                  placeholder="........"
                  style={{ paddingLeft: 40 }}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Create account
            </button>

            <p
              className="text-center"
              style={{ marginTop: "1.5rem", color: "var(--text-muted)" }}
            >
              Already have an account?{" "}
              <a href="/login" className="link">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel: Promotional */}
      <div className="auth-panel promotional purple">
        <div className="brand-logo float-anim">
          <div className="brand-icon">⚡</div>
          <h1 className="brand-name">OverDO</h1>
        </div>

        <p className="tagline">
          Get ready for a productivity experience that's actually fun (and
          slightly judgmental).
        </p>

        <div style={{ marginTop: "3rem", width: "100%", maxWidth: 350 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: 15,
              borderRadius: 16,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ fontSize: 24 }}>🌱</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700 }}>Start as a Rookie</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                Complete tasks to earn XP and rank up
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: 15,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ fontSize: 24 }}>🐶</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700 }}>Meet your companion</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                They'll cheer you on... or roast you
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
