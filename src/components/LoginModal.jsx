import { useState } from "react";
import { Mail, ArrowRight, Loader, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";

export default function LoginModal() {
  const { t, dark, setShowLoginModal } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setShowLoginModal(false);
    setSent(false);
    setError("");
    setEmail("");
  };

  const handleSendLink = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    if (!supabase) {
      setLoading(false);
      setError("Supabase is not configured.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
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

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        background: dark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 380,
          background: dark ? "#131829" : "#FFFFFF",
          borderRadius: 20, padding: "28px 24px",
          border: `1px solid ${t.border}`,
          boxShadow: dark
            ? "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 24px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Logo height={28} />

          <div
            onClick={close}
            style={{
              width: 32, height: 32, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: t.bgCard,
            }}
          >
            <X size={16} color={t.textMuted} />
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
              background: t.accentGlow, border: `2px solid ${t.accentBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Mail size={28} color={t.accent} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>
              Check your email
            </div>
            <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6, marginBottom: 24 }}>
              We sent a magic link to <strong style={{ color: t.text }}>{email}</strong>.
            </div>
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: t.bgCard, border: `1px solid ${t.border}`,
              fontSize: 13, color: t.textMuted, lineHeight: 1.5,
            }}>
              Didn't get it? Check spam, or{" "}
              <span
                onClick={() => { setSent(false); setError(""); }}
                style={{ color: t.accent, fontWeight: 600, cursor: "pointer" }}
              >try again</span>.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>
              Sign in to continue
            </div>
            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 22 }}>
              This feature requires an account.
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="you@email.com"
                autoComplete="email"
                autoFocus
                style={{
                  width: "100%", padding: "13px 14px", borderRadius: 12,
                  background: t.bgInput, border: `1px solid ${t.border}`,
                  fontSize: 14, color: t.text, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 10, marginBottom: 14,
                background: t.redBg,
                border: `1px solid ${dark ? "rgba(239,107,107,0.15)" : "rgba(212,80,80,0.12)"}`,
                fontSize: 13, color: t.red,
              }}>
                {error}
              </div>
            )}

            <div
              onClick={!loading ? handleSendLink : undefined}
              style={{
                padding: "14px", borderRadius: 14, textAlign: "center",
                background: t.accent, color: "white", fontSize: 15, fontWeight: 700,
                cursor: loading ? "default" : "pointer",
                boxShadow: `0 4px 16px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.2)"}`,
                opacity: email && !loading ? 1 : 0.6,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
              ) : (
                <>Continue with Email <ArrowRight size={16} /></>
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: t.textMuted }}>
              No password needed — we'll email you a magic link.
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
