import { Music, Sun as SunIcon, BarChart3, User, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "therapy", label: "Therapy", Icon: Music },
  { id: "redlight", label: "Red Light", Icon: SunIcon },
  { id: "progress", label: "Progress", Icon: BarChart3 },
  { id: "account", label: "Account", Icon: User },
];

export default function NavBar({ active }) {
  const { t, dark, setDark, navigateWithAuth } = useApp();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "14px 16px 28px",
        background: t.navBg,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${t.border}`,
        flexShrink: 0,
      }}
    >
      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={() => navigateWithAuth(item.id)}
          style={{ textAlign: "center", cursor: "pointer" }}
        >
          <item.Icon size={22} color={active === item.id ? t.accent : t.textMuted} />
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 0.3,
              color: active === item.id ? t.accent : t.textMuted,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
      <div
        onClick={() => setDark(!dark)}
        style={{ textAlign: "center", cursor: "pointer" }}
      >
        {dark ? (
          <SunIcon size={22} color={t.textMuted} />
        ) : (
          <Moon size={22} color={t.textMuted} />
        )}
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 0.3,
            color: t.textMuted,
          }}
        >
          {dark ? "Light" : "Dark"}
        </div>
      </div>
    </div>
  );
}
