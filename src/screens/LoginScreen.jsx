import { useState } from "react";
import { useApp } from "../context/AppContext";


export default function LoginScreen({ isDesktop }) {
  const { t, dark, setLoggedIn, setAppView } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Placeholder — will integrate Supabase later
    if (email && password) {
      setLoggedIn(true);
      setAppView("main");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 4 }}>
          Ear<span style={{ color: t.accent }}>Bliss</span>
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 40 }}>Tinnitus Relief & Recovery Program</div>

        <div style={{ width: "100%", maxWidth: 320 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28 }}>Sign in to access your relief program</div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: t.bgInput, border: `1px solid ${t.border}`,
                fontSize: 14, color: t.text, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: t.bgInput, border: `1px solid ${t.border}`,
                fontSize: 14, color: t.text, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: t.accent, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
          </div>

          {/* Sign in */}
          <div onClick={handleSignIn} style={{
            padding: "16px", borderRadius: 14, textAlign: "center",
            background: t.accent, color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer", boxShadow: `0 4px 16px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.2)"}`,
            opacity: email && password ? 1 : 0.6,
          }}>Sign In</div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <span style={{ fontSize: 13, color: t.textMuted }}>New to EarBliss? </span>
            <span onClick={() => setAppView("onboarding")} style={{ fontSize: 13, color: t.accent, fontWeight: 600, cursor: "pointer" }}>Get Started</span>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span onClick={() => setAppView("main")} style={{ fontSize: 13, color: t.textMuted, cursor: "pointer" }}>
              Skip for now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
