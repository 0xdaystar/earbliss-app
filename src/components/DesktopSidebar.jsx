import { Music, Sun, BarChart3, User, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

const navItems = [
  { id: "therapy", label: "Sound Therapy", Icon: Music },
  { id: "redlight", label: "Red Light Session", Icon: Sun },
  { id: "progress", label: "Progress", Icon: BarChart3 },
  { id: "account", label: "Account", Icon: User },
];

export default function DesktopSidebar() {
  const { t, dark, setDark, screen, navigateWithAuth } = useApp();

  return (
    <div
      style={{
        width: 220,
        background: dark ? "#0D1120" : "#FFFFFF",
        borderRight: `1px solid ${t.border}`,
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${t.border}` }}>
        <Logo height={28} />
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 6 }}>
          Tinnitus Relief Program
        </div>
      </div>
      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={() => navigateWithAuth(item.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            cursor: "pointer",
            background: screen === item.id ? t.accentGlow : "transparent",
            borderLeft: screen === item.id ? `3px solid ${t.accent}` : "3px solid transparent",
            transition: "all 0.15s",
          }}
        >
          <item.Icon size={18} color={screen === item.id ? t.accent : t.textMuted} />
          <span
            style={{
              fontSize: 14,
              fontWeight: screen === item.id ? 600 : 400,
              color: screen === item.id ? t.accent : t.textSec,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${t.border}` }}>
        <div
          onClick={() => setDark(!dark)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            cursor: "pointer",
            background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            transition: "background 0.15s",
          }}
        >
          {dark ? <Sun size={16} color={t.accent} /> : <Moon size={16} color={t.accent} />}
          <span style={{ fontSize: 13, fontWeight: 500, color: t.textSec }}>
            {dark ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </div>
      <div style={{ padding: "4px 20px 16px" }}>
        <div style={{ fontSize: 12, color: t.textMuted }}>EarBliss App</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>v1.0</div>
      </div>
    </div>
  );
}
