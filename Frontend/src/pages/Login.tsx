import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { login } from "../auth/authService";
import "../styles/auth.css";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      loginUser(data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Promotional */}
      <div className="auth-panel promotional orange">
        <div className="brand-logo float-anim">
          <div className="brand-icon">⚡</div>
          <h1 className="brand-name">OverDO</h1>
        </div>

        <p className="tagline">
          Where productivity meets personality.
        </p>

        <div className="flex gap-4" style={{ marginTop: "2rem" }}>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: "0.9rem",
            }}
          >
            🎯 Tasks
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: "0.9rem",
            }}
          >
            🍅 Pomodoro
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: "0.9rem",
            }}
          >
            🏆 Ranks
          </span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="auth-panel">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2 className="auth-title">Welcome back!</h2>
            <p className="auth-subtitle">
              Ready to be judged for your productivity?
            </p>
          </div>

          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input-field"
                  placeholder="........"
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

            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>

            <p
              className="text-center"
              style={{ marginTop: "1.5rem", color: "var(--text-muted)" }}
            >
              Don't have an account?{" "}
              <a className="link" onClick={() => navigate("/signup")}>
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
