import {
  User,
  Mail,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useApp } from "../context/AppContext";


export default function AccountScreen({ progress, isDesktop }) {
  const { t, dark, setDark, loggedIn, user, setAppView, signOut } = useApp();

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
          <User size={48} color={t.accent} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>Sign in to your account</div>
          <div style={{ fontSize: 14, color: t.textSec, textAlign: "center", lineHeight: 1.6, marginBottom: 28 }}>
            Access your personalized relief program, track progress, and manage your settings.
          </div>
          <div onClick={() => setAppView("login")} style={{
            width: "100%", maxWidth: 280, padding: "16px", borderRadius: 14, textAlign: "center",
            background: t.accent, color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}>Sign In</div>
        </div>
      </div>
    );
  }

  const { totalSessions, totalTimeHours, improvement, streak } = progress;

  return (
    <div style={{ padding: "0 0 24px" }}>

      <div style={{ padding: isDesktop ? "32px 40px 0" : "20px 24px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: t.accent, marginBottom: 4 }}>Account</div>
        <div style={{ fontSize: isDesktop ? 26 : 22, fontWeight: 700, color: t.text }}>Your Profile</div>
      </div>

      {/* Profile card */}
      <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
        <div style={{
          background: t.bgCard, borderRadius: 16, padding: 20,
          border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: t.accentGlow, border: `2px solid ${t.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <User size={26} color={t.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{user?.email ?? "EarBliss User"}</div>
            <div style={{ fontSize: 11, color: t.green, fontWeight: 600, marginTop: 4 }}>Active Member</div>
          </div>
        </div>
      </div>

      {/* Program stats */}
      <div style={{ display: "flex", gap: 10, padding: isDesktop ? "20px 40px 0" : "16px 24px 0" }}>
        {[
          { num: `${streak}`, label: "Day Streak", color: t.accent },
          { num: `${totalSessions}`, label: "Sessions", color: t.green },
          { num: `${improvement}%`, label: "Improvement", color: t.yellow },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: t.bgCard, borderRadius: 12, padding: "14px 10px",
            border: `1px solid ${t.border}`, textAlign: "center"
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.num}</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div style={{ padding: isDesktop ? "20px 40px 0" : "16px 24px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px", background: t.bgCard, borderRadius: 14,
          border: `1px solid ${t.border}`,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: t.accentGlow, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {dark ? <Moon size={18} color={t.accent} /> : <Sun size={18} color={t.accent} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Appearance</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>{dark ? "Dark mode" : "Light mode"}</div>
          </div>
          <div
            onClick={() => setDark(!dark)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: dark ? "rgba(91,141,239,0.3)" : t.barTrack,
              display: "flex", alignItems: "center", padding: 2, cursor: "pointer",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: dark ? t.accent : t.textMuted,
              marginLeft: dark ? 20 : 0,
              transition: "margin-left 0.2s",
            }} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div style={{ padding: isDesktop ? "20px 40px 0" : "16px 24px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Support</div>
        <a
          href="mailto:support@myearbliss.com"
          style={{ textDecoration: "none" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px", background: t.bgCard, borderRadius: 14,
            border: `1px solid ${t.border}`, cursor: "pointer"
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: t.accentGlow, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Mail size={18} color={t.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Contact Us</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>support@myearbliss.com</div>
            </div>
            <ChevronRight size={16} color={t.textMuted} />
          </div>
        </a>
      </div>

      {/* Log out */}
      <div style={{ padding: isDesktop ? "20px 40px 24px" : "20px 24px 24px" }}>
        <div
          onClick={signOut}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px", borderRadius: 14,
            background: t.redBg, border: `1px solid ${dark ? "rgba(239,107,107,0.15)" : "rgba(212,80,80,0.12)"}`,
            cursor: "pointer"
          }}
        >
          <LogOut size={16} color={t.red} />
          <span style={{ fontSize: 14, fontWeight: 600, color: t.red }}>Log Out</span>
        </div>
      </div>
    </div>
  );
}
