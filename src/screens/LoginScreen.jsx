import { useState } from "react";
import { Mail, ArrowRight, Loader } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "../components/Logo";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ isDesktop }) {
  const { t, dark, navigate } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendLink = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    if (!supabase) {
      setLoading(false);
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendLink();
  };

  if (sent) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: t.accentGlow, border: `2px solid ${t.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
          }}>
            <Mail size={36} color={t.accent} />
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, textAlign: "center", marginBottom: 8 }}>
            Check your email
          </div>
          <div style={{ fontSize: 14, color: t.textSec, textAlign: "center", lineHeight: 1.6, maxWidth: 300, marginBottom: 32 }}>
            We sent a magic link to <strong style={{ color: t.text }}>{email}</strong>. Tap the link in your email to sign in.
          </div>

          <div style={{
            padding: "14px 20px", borderRadius: 12,
            background: t.bgCard, border: `1px solid ${t.border}`,
            fontSize: 13, color: t.textMuted, textAlign: "center", lineHeight: 1.5, maxWidth: 300,
          }}>
            Didn't get it? Check your spam folder, or{" "}
            <span
              onClick={() => { setSent(false); setError(""); }}
              style={{ color: t.accent, fontWeight: 600, cursor: "pointer" }}
            >try again</span>.
          </div>

          <div
            onClick={() => navigate("therapy")}
            style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: t.textSec, cursor: "pointer" }}
          >
            ← Back to Sound Therapy
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <Logo height={40} style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 40 }}>Tinnitus Relief & Recovery Program</div>

        <div style={{ width: "100%", maxWidth: 320 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>Welcome</div>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28 }}>
            Enter your email to sign in or create an account — no password needed.
          </div>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@email.com"
              autoComplete="email"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                background: t.bgInput, border: `1px solid ${t.border}`,
                fontSize: 14, color: t.text, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, marginBottom: 16,
              background: t.redBg, border: `1px solid ${dark ? "rgba(239,107,107,0.15)" : "rgba(212,80,80,0.12)"}`,
              fontSize: 13, color: t.red,
            }}>
              {error}
            </div>
          )}

          {/* Send magic link */}
          <div
            onClick={!loading ? handleSendLink : undefined}
            style={{
              padding: "16px", borderRadius: 14, textAlign: "center",
              background: t.accent, color: "white", fontSize: 16, fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              boxShadow: `0 4px 16px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.2)"}`,
              opacity: email && !loading ? 1 : 0.6,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <><Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
            ) : (
              <>Continue with Email <ArrowRight size={18} /></>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>
            We'll send you a magic link — just click it to sign in instantly. No password required.
          </div>

          <div
            onClick={() => navigate("therapy")}
            style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: t.textSec, cursor: "pointer" }}
          >
            ← Back to Sound Therapy
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
